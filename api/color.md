# 颜色 (Color)

colors 模块可用于 [ 颜色模式转换 / 色彩空间转换 / 颜色分量合成及分解 ] 等.<br>
同时包含一些颜色相关的工具, 如 [ 计算亮度值 / 相似度比较 / 对比度调整 / 配色生成 / 图像主要颜色提取 ] 等.<br>
[colors.theme](#p-theme) 可用于读取和修改 AutoJs6 的主题色.

colors 模块与 [images](image) 模块配合使用, 可完成更多图色方面的功能.

---

## 颜色表示

AutoJs6 支持以下方式表示一个颜色:

- [颜色代码 (ColorHex)](dataTypes#colorhex)
    - 字面量
        - `#RGB` (如 `#F00` 表示红色, 相当于 `#FF0000`)
        - `#RRGGBB` (如 `#FF0000` 表示红色)
        - `#AARRGGBB` (如 `#80FF0000` 表示半透明红色)
    - 方法
        - [colors.toHex](#m-tohex) (如 `colors.toHex(0xFF0000)` 表示红色对应的颜色字符串, 结果为 `#FF0000`)
        - [colors.toFullHex](#m-tofullhex) (如 `colors.toFullHex(0xFF0000)` 表示红色对应的完全颜色字符串, 结果为 `#FFFF0000`)
        - ... ...
- [颜色整数 (ColorInt)](dataTypes#colorint)
    - 字面量
        - `0xAARRGGBB` (如 `0x8000FF00` 在 `Java` 的 `Integer` 范围对应值表示半透明绿色)
    - 方法
        - [colors.rgb](#m-rgb) (如 `colors.rgb(255, 0, 0)` 表示红色)
        - [colors.argb](#m-argb) (如 `colors.argb(128, 255, 0, 0)` 表示半透明红色)
        - [colors.rgba](#m-rgba) (如 `colors.rgba(255, 0, 0, 128)` 表示半透明红色)
        - [colors.hsv](#m-hsv) (如 `colors.hsv(0, 1, 1)` 表示红色)
        - [colors.hsva](#m-hsva) (如 `colors.rgba(0, 1, 1, 0.5)` 表示半透明红色)
        - [colors.hsl](#m-hsl) (如 `colors.hsl(0, 1, 0.5)` 表示红色)
        - [colors.hsla](#m-hsla) (如 `colors.hsl(0, 1, 0.5, 0.5)` 表示半透明红色)
        - [colors.oklab](#m-oklab) (如 `colors.oklab(0.628, 0.2249, 0.1258)` 表示红色)
        - [colors.oklch](#m-oklch) (如 `colors.oklch(0.628, 0.2577, 29.23)` 表示红色)
        - [colors.toInt](#m-toint) (如 `colors.toInt('#FF0000')` 表示红色对应的颜色整数, 结果为 `-65536`)
        - ... ...
    - 常量
        - [colors.android.RED](#p-android) ([Android 颜色列表](colorTable#Android-颜色列表) 的红色颜色整数)
        - [colors.android.BLACK](#p-android) ([Android 颜色列表](colorTable#Android-颜色列表) 的黑色颜色整数)
        - ... ...
        - [colors.css.RED](#p-css) ([Css 颜色列表](colorTable#CSS-颜色列表) 的红色颜色整数)
        - [colors.css.BLACK](#p-css) ([Css 颜色列表](colorTable#CSS-颜色列表) 的黑色颜色整数)
        - ... ...
        - [colors.web.RED](#p-web) ([Web 颜色列表](colorTable#WEB-颜色列表) 的红色颜色整数)
        - [colors.web.BLACK](#p-web) ([Web 颜色列表](colorTable#WEB-颜色列表) 的黑色颜色整数)
        - ... ...
        - [colors.material.ORANGE](#p-material) ([Material 颜色列表](colorTable#Material-颜色列表) 的橙色颜色整数)
        - [colors.material.ORANGE_300](#p-material) ([Material 颜色列表](colorTable#Material-颜色列表) 的 300 色号橙色颜色整数)
        - ... ...
        - [colors.RED](#p-red) ([融合颜色列表](colorTable#融合颜色列表) 的红色颜色整数)
        - [colors.BLACK](#p-black) ([融合颜色列表](colorTable#融合颜色列表) 的黑色颜色整数)
        - [colors.ORANGE](#p-orange) ([融合颜色列表](colorTable#融合颜色列表) 的橙色颜色整数)
        - ... ...
- [颜色分量数组 (ColorComponents)](dataTypes#colorcomponents)
    - 方法
        - [colors.toRgb](#m-torgb) (颜色分量数组 `[R,G,B]`)
        - [colors.toRgba](#m-torgba) (颜色分量数组 `[R,G,B,A]`)
        - [colors.toArgb](#m-toargb) (颜色分量数组 `[A,R,G,B]`)
        - [colors.toHsv](#m-tohsv) (颜色分量数组 `[H,S,V]`)
        - [colors.toHsva](#m-tohsva) (颜色分量数组 `[H,S,V,A]`)
        - [colors.toHsl](#m-tohsl) (颜色分量数组 `[H,S,L]`)
        - [colors.toHsla](#m-tohsla) (颜色分量数组 `[H,S,L,A]`)
        - [colors.toOklab](#m-tooklab) (颜色分量数组 `[L,a,b]`)
        - [colors.toOklch](#m-tooklch) (颜色分量数组 `[L,C,h]`)
        - ... ...
- [颜色名称 (ColorName)](dataTypes#colorname)
    - 常量
        - "red" (红色)
        - "black" (黑色)
        - "orange" (橙色)
        - ... ...

## 黑色与 0

需特别留意, 黑色的颜色字符串为 `#000000`, 它是完全颜色字符串 `#FF000000` 的简写形式, 其 ARGB 分量表示为 `argb(255, 0, 0, 0)`.

因此黑色的颜色整数不是 `0`, 而是 `-16777216`.

颜色整数 `0` 对应的是完全透明色, 即 `#00000000`, 其 ARGB 分量表示为 `argb(0, 0, 0, 0)`.

---

<p style="font: bold 2em sans-serif; color: #FF7043">colors</p>

---

## [p] all

**`6.8.0`** **`Getter`**

- { [object](dataTypes#object) } - 颜色名称到 [ColorInt](dataTypes#colorint) 的映射对象

获取全部内置颜色表融合后的对象. 对象以颜色常量名称为属性名, 以对应的颜色整数为属性值.

当不同颜色表含有同名常量时, 按 Android, CSS, Web, Material 的顺序保留第一个值.

```js
console.log(colors.all.RED === colors.android.RED); // true
console.log(colors.all.ORANGE_300 === colors.material.ORANGE_300); // true
```

## [p] themeColor

**`6.7.0`** **`Getter`**

- { [ThemeColor](dataTypes#themecolor) } - 当前 AutoJs6 主题颜色实例

获取当前主题颜色. 此属性是 [`autojs.themeColor`](autojs#p-themecolor) 的别名, 两者返回同一个 `ThemeColor` 实例.

```js
console.log(colors.themeColor === autojs.themeColor); // true
```

如需修改主题色, 可使用 [colors.theme](#p-theme).

## [m] toInt

### toInt(color)

**`6.2.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) } - 颜色整数

将颜色参数转换为 [颜色整数 (ColorInt)](dataTypes#colorint).

```js
/* ColorHex - 颜色代码. */
colors.toInt('#CC5500'); // -3386112
colors.toInt('#C50'); // -3386112
colors.toInt('#FFCC5500'); // -3386112

/* ColorInt - 颜色整数. */
colors.toInt(0xFFCC5500); // -3386112
colors.toInt(colors.web.BURNT_ORANGE); // -3386112

/* ColorName - 颜色名称. */
colors.toInt('BURNT_ORANGE'); // -3386112
colors.toInt('burnt-orange'); // -3386112
```

## [m] toHex

### toHex(color)

**`6.2.0`** **`Overload 1/3`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [ColorHex](dataTypes#colorhex) } - 颜色代码

将颜色参数转换为 [颜色代码 (ColorHex)](dataTypes#colorhex).

```js
/* ColorHex - 颜色代码. */
colors.toHex('#CC5500'); // #CC5500
colors.toHex('#C50'); // #CC5500
colors.toHex('#DECC5500'); // #DECC5500
colors.toHex('#FFCC5500'); /* #CC5500, A (alpha) 分量被省略. */

/* ColorInt - 颜色整数. */
colors.toHex(0xFFCC5500); // #CC5500
colors.toHex(colors.web.BURNT_ORANGE); // #CC5500

/* ColorName - 颜色名称. */
colors.toHex('BURNT_ORANGE'); // #CC5500
colors.toHex('burnt-orange'); // #CC5500
```

当 `A (alpha)` 分量为 `100% (255/255;100/100)` 时, `FF` 会自动省略,<br>
如 `#FFC0C0C0` 将自动转换为 `#C0C0C0`, 此方法相当于 `toHex(color, 'auto')`.

### toHex(color, alpha)

**`6.2.0`** **`Overload 2/3`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **[ alpha = `'auto'` ]** { [boolean](dataTypes#boolean) | `'keep'` | `'none'` | `'auto'` } - A (alpha) 分量参数
- <ins>**returns**</ins> { [ColorHex](dataTypes#colorhex) } - 颜色代码

将颜色参数转换为 [颜色代码 (ColorHex)](dataTypes#colorhex), 并根据 `alpha` 参数决定颜色代码 `A (alpha)` 分量的显示状态.

`A (alpha)` 分量参数取值表:

| 取值                                                     | 含义                                                                  | 默认 |
|--------------------------------------------------------|---------------------------------------------------------------------|:--:|
| <span style="white-space:nowrap">'keep' / true</span>  | <span style="white-space:nowrap">强制显示 A 分量, 不论 A 分量是否为 0xFF</span>  |    |
| <span style="white-space:nowrap">'none' / false</span> | <span style="white-space:nowrap">强制去除 A 分量, 只保留 R / G / B 分量</span> |    |
| <span style="white-space:nowrap">'auto'</span>         | <span style="white-space:nowrap">根据 A 分量是否为 0xFF 自动决定显示状态</span>    | √  |

```js
let cA = '#AAC0C0C0';
let cB = '#FFC0C0C0';
let cC = '#C0C0C0';

colors.toHex(cA, 'auto'); /* #AAC0C0C0, 'auto' 参数可省略. */
colors.toHex(cB, 'auto'); /* #C0C0C0, 'auto' 参数可省略. */
colors.toHex(cC, 'auto'); /* #C0C0C0, 'auto' 参数可省略. */

/* cA 舍弃 A 分量. */
colors.toHex(cA, false); // #C0C0C0
colors.toHex(cA, 'none'); /* 同上. */

/* cB 保留 A 分量. */
colors.toHex(cB, true); // #FFC0C0C0
colors.toHex(cB, 'keep'); /* 同上. */

/* cC 强制显示 A 分量. */
colors.toHex(cC, true); // #FFC0C0C0
colors.toHex(cC, 'keep'); /* 同上. */
```

### toHex(color, length)

**`6.2.0`** **`Overload 3/3`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **length** { `8` | `6` | `3` } - Hex 代码长度参数
- <ins>**returns**</ins> { [ColorHex](dataTypes#colorhex) } - 颜色代码

将颜色参数转换为 [颜色代码 (ColorHex)](dataTypes#colorhex), 并根据 `length` 参数决定颜色代码的显示状态.

Hex 代码长度参数取值表:

| <span style="white-space:nowrap">取值</span> | 含义                                                                 |
|:------------------------------------------:|--------------------------------------------------------------------|
|                     8                      | <span style="white-space:nowrap">强制显示 A 分量, 结果格式为 #AARRGGBB</span> |
|                     6                      | <span style="white-space:nowrap">强制去除 A 分量, 结果格式为 #RRGGBB</span>   |
|                     3                      | <span style="white-space:nowrap">强制去除 A 分量, 结果格式为 #RGB</span>      |

```js
let cA = '#AA9966CC';
let cB = '#FF9966CC';
let cC = '#9966CC';
let cD = '#FAEBD7';

/* 转换为 8 长度颜色代码, 强制保留 A 分量. */
colors.toHex(cA, 8); // #AA9966CC
colors.toHex(cB, 8); // #FF9966CC
colors.toHex(cC, 8); // #FF9966CC
colors.toHex(cD, 8); // #FFFAEBD7

/* 转换为 6 长度颜色代码, 强制去除 A 分量. */
colors.toHex(cA, 6); // #9966CC
colors.toHex(cB, 6); // #9966CC
colors.toHex(cC, 6); // #9966CC
colors.toHex(cD, 6); // #FAEBD7

/* 转换为 3 长度颜色代码, 强制去除 A 分量. */
colors.toHex(cA, 3); // #96C
colors.toHex(cB, 3); // #96C
colors.toHex(cC, 3); // #96C
colors.toHex(cD, 3); /* 抛出异常. */
```

## [m] toFullHex

### toFullHex(color)

**`6.2.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [ColorHex](dataTypes#colorhex) } - 颜色代码的完整形式

将颜色参数强制转换为 [颜色代码 (ColorHex)](dataTypes#colorhex) 的完整形式 (#AARRGGBB).

此方法为 [colors.toHex(color, 8)](#tohexcolor-length) 的别名方法.

```js
colors.toHex('#CC5500'); // #CC5500
colors.toFullHex('#CC5500'); // #FFCC5500
```

## [m] build

### build(color?)

**`6.3.0`** **`Overload [1-2]/4`**

- **[ color = `Colors.BLACK` ]** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [Color](colorType) } - Color 实例

构建一个 [Color](colorType) 实例, 相当于 `new Color(color?)` 或 `Color(color?)`.

```js
colors.build('dark-orange') /* 以深橙色构建 Color 实例. */
    .setAlpha(0.85) /* 设置透明度 85%. */
    .removeBlue() /* 移除 B (blue) 分量. */
    .toHex(); // #D9FF8C00

/* 构建空 Color 实例, 设置 HSLA 分量并转换为 Hex 代码. */
colors.build().setHsla(0.25, 0.8, 0.64, 0.9).toHex(); // #E6A3ED5A
```

### build(red, green, blue, alpha?)

**`6.3.0`** **`Overload [3-4]/4`**

- **red** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - R (red)
- **green** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - G (green)
- **blue** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - B (blue)
- **[ alpha = `1` ]** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - A (alpha)
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

构建一个 [Color](colorType) 实例, 相当于 `new Color(red, green, blue, alpha?)`.

```js
colors.build(120, 60, 240).setAlpha(0.85).toHex(); // #D9783CF0
colors.build(120, 60, 240, 0.85).toHex(); /* 同上. */
colors.build().setRgba(120, 60, 240, 0.85).toHex(); /* 同上. */
```

## [m] summary

### summary(color)

**`6.3.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [string](dataTypes#string) } - 颜色摘要

获取颜色摘要.

格式为 `hex($HEX), rgba($R,$G,$B/$A), int($INT)`.

其中, `A (alpha)` 分量将显示为 `0..1` 范围, 至少一位小数, 至多两位小数:

| 分量值  | 显示值  |
|------|------|
| 0    | 0.0  |
| 1    | 1.0  |
| 0.64 | 0.64 |
| 128  | 0.5  |
| 255  | 1.0  |
| 100  | 0.39 |

示例:

```js
// hex(#009688), rgba(0,150,136/1.0), int(-16738680)
colors.summary('#009688');

// hex(#BE009688), rgba(0,150,136/0.75), int(-1107257720)
colors.summary('#BE009688');

// hex(#FF0000), rgba(255,0,0/1.0), int(-65536)
colors.summary('red');

// hex(#6400008B), rgba(0,0,139/0.39), int(1677721739)
colors.build('dark-blue').setAlpha(100).summary();
```

## [m] parseColor

### parseColor(color)

- **color** { [string](dataTypes#string) } - 颜色参数
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) } - 颜色整数

将颜色参数转换为 [颜色整数 (ColorInt)](dataTypes#colorint).

类似 [toInt](#m-toint), 但参数接受范围相对狭小且类型及数值要求更加严格.<br>
parseColor 的颜色参数仅支持六位数及八位数颜色代码及部分颜色名称.

支持的颜色名称 (不区分大小写):
> 'aqua', 'black', 'blue', 'cyan', 'darkgray', 'darkgrey',
>
> 'fuchsia', 'gray', 'green', 'grey', 'lightgray',
>
> 'lightgrey', 'lime', 'magenta', 'maroon', 'navy', 'olive',
>
> 'purple', 'red', 'silver', 'teal', 'white', 'yellow'.

下表列出部分 toInt 与 parseColor 传参后的结果对照:

| 参数                      | toInt     | parseColor |
|-------------------------|-----------|------------|
| 'blue'                  | -16776961 | -16776961  |
| 'burnt-orange'          | -3386112  | # 抛出异常 #   |
| '#FFCC5500'             | -3386112  | -3386112   |
| '#CC5500'               | -3386112  | -3386112   |
| '#C50'                  | -3386112  | # 抛出异常 #   |
| 0xFFCC5500              | -3386112  | # 抛出异常 #   |
| colors.web.BURNT_ORANGE | -3386112  | # 抛出异常 #   |

除非需要考虑多版本兼容, 否则建议始终使用 toInt 替代 parseColor.

## [m] toString

### toString(color)

**`[6.2.0]`** **`Overload 1/3`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [ColorHex](dataTypes#colorhex) } - 颜色代码

将颜色参数转换为 [颜色代码 (ColorHex)](dataTypes#colorhex).

[toHex(color)](#tohexcolor) 的别名方法.

### toString(color, alpha)

**`6.2.0`** **`Overload 2/3`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **[ alpha = `'auto'` ]** { [boolean](dataTypes#boolean) | `'keep'` | `'none'` | `'auto'` } - A (alpha) 分量参数
- <ins>**returns**</ins> { [ColorHex](dataTypes#colorhex) } - 颜色代码

将颜色参数转换为 [颜色代码 (ColorHex)](dataTypes#colorhex), 并根据 `alpha` 参数决定颜色代码 `A (alpha)` 分量的显示状态.

[toHex(color, alpha)](#tohexcolor-alpha) 的别名方法.

### toString(color, length)

**`6.2.0`** **`Overload 3/3`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **length** { `8` | `6` | `3` } - Hex 代码长度参数
- <ins>**returns**</ins> { [ColorHex](dataTypes#colorhex) } - 颜色代码

将颜色参数转换为 [颜色代码 (ColorHex)](dataTypes#colorhex), 并根据 `length` 参数决定颜色代码的显示状态.

[toHex(color, length)](#tohexcolor-length) 的别名方法.

## [m] alpha

### alpha(color)

**`Overload 1/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [IntRange[0..255]](dataTypes#intrange) }

获取颜色的 `A (alpha)` 分量, 取值范围 `[0..255]`.

```js
colors.alpha('#663399'); // 255
colors.alpha(colors.TRANSPARENT); // 0
colors.alpha('#05060708'); // 5
```

### alpha(color, options)

**`6.3.0`** **`Overload 2/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **options** {{
    - [ max = `255` ]?: `1` | `255` - 范围最大值
- }} - 选项参数
- <ins>**returns**</ins> { [IntRange[0..1]](dataTypes#intrange) | [IntRange[0..255]](dataTypes#intrange) }

获取颜色的 `A (alpha)` 分量.

取值范围 `[0..1]` (`options.max` 为 `1`) 或 `[0..255]` (`options.max` 为 `255` 或不指定).

```js
colors.alpha('#663399', { max: 1 }); // 1
colors.alpha('#663399', { max: 255 }); // 255
colors.alpha('#663399'); /* 同上. */

colors.alpha('#05060708', { max: 1 }); // 0.0196078431372549
colors.alpha('#05060708', { max: 255 }); // 5
colors.alpha('#05060708'); /* 同上. */
```

当 `options.max` 为 `1` 时, 相当于 [colors.alphaDouble](#m-alphadouble) 方法.

## [m] alphaDouble

### alphaDouble(color)

**`6.3.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [Range[0..1]](dataTypes#range) }

获取颜色的 `A (alpha)` 分量, 取值范围 `[0..1]`.

相当于 `colors.alpha(color, { max: 1 })`.

```js
colors.alphaDouble('#663399'); // 1
colors.alphaDouble(colors.TRANSPARENT); // 0

colors.alphaDouble('#05060708'); // 0.0196078431372549
colors.alpha('#05060708', { max: 1 }); /* 同上. */
```

## [m] getAlpha

### getAlpha(color)

**`6.3.0`** **`Overload 1/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [IntRange[0..255]](dataTypes#intrange) }

获取颜色的 `A (alpha)` 分量, 取值范围 `[0..255]`.

[colors.alpha(color)](#m-alpha) 的别名方法.

### getAlpha(color, options)

**`6.3.0`** **`Overload 2/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **options** {{
    - [ max = `255` ]?: `1` | `255` - 范围最大值
- }} - 选项参数
- <ins>**returns**</ins> { [IntRange[0..1]](dataTypes#intrange) | [IntRange[0..255]](dataTypes#intrange) }

获取颜色的 `A (alpha)` 分量.

[colors.alpha(color, options)](#m-alpha) 的别名方法.

## [m] getAlphaDouble

### getAlphaDouble(color)

**`6.3.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [Range[0..1]](dataTypes#range) }

获取颜色的 `A (alpha)` 分量, 取值范围 `[0..1]`.

[colors.alphaDouble(color)](#m-alphadouble) 的别名方法.

## [m] setAlpha

### setAlpha(color, alpha)

**`6.3.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **alpha** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - A (alpha)
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

设置颜色的 `A (alpha)` 分量, 返回新颜色的颜色整数.

```js
colors.toHex(colors.setAlpha('#663399', 0x80)); // #80663399
colors.toHex(colors.setAlpha('#663399', 0.5)); /* 同上, 0.5 解析为百分数分量, 即 50%. */

colors.toHex(colors.setAlpha('#663399', 255)); // #FF663399
colors.toHex(colors.setAlpha('#663399', 1)); /* 同上, 1 默认作为百分数分量, 即 100%. */
```

## [m] setAlphaRelative

### setAlphaRelative(color, percentage)

**`6.3.1`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **percentage** { [ColorComponent](dataTypes#colorcomponent) } - 相对百分数
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

针对 `A (alpha)` 分量设置其相对百分比, 返回新颜色的颜色整数.

如当前颜色 `A (alpha)` 分量为 `80`, 希望设置 `A` 分量为 `50%` 相对量, 即 `40`:

```js
colors.setAlphaRelative(color, 0.5);
colors.setAlphaRelative(color, '50%'); /* 效果同上. */
```

同样地, 如希望设置 `A` 分量为 `1.5` 倍相对量, 即 `120`:

```js
colors.setAlphaRelative(color, 1.5);
colors.setAlphaRelative(color, '150%');
```

当设置的相对量超过 `255` 时, 将以 `255` 为最终值:

```js
colors.setAlphaRelative(color, 10); /* A 分量最终值为 255, 而非 800. */
```

特别地, 当原本颜色的 `A` 分量为 `0` 时, 无论如何设置相对量, `A` 分量均保持 `0` 值.

## [m] removeAlpha

### removeAlpha(color)

**`6.3.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

去除颜色的 `A (alpha)` 分量, 返回新颜色的颜色整数.

```js
colors.toHex(colors.removeAlpha('#BE663399')); // #663399
colors.toHex(colors.removeAlpha('#CC5500')); // #CC5500
````

相当于 `colors.setAlpha(color, 0)`.

## [m] red

### red(color)

**`Overload 1/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [IntRange[0..255]](dataTypes#intrange) }

获取颜色的 `R (red)` 分量, 取值范围 `[0..255]`.

```js
colors.red('#663399'); // 102
colors.red(colors.TRANSPARENT); // 0
colors.red('#05060708'); // 6
```

### red(color, options)

**`6.3.0`** **`Overload 2/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **options** {{
    - [ max = `255` ]?: `1` | `255` - 范围最大值
- }} - 选项参数
- <ins>**returns**</ins> { [IntRange[0..1]](dataTypes#intrange) | [IntRange[0..255]](dataTypes#intrange) }

获取颜色的 `R (red)` 分量.

取值范围 `[0..1]` (`options.max` 为 `1`) 或 `[0..255]` (`options.max` 为 `255` 或不指定).

```js
colors.red('#663399', { max: 1 }); // 0.4
colors.red('#663399', { max: 255 }); // 102
colors.red('#663399'); /* 同上. */
```

当 `options.max` 为 `1` 时, 相当于 [colors.redDouble](#m-reddouble) 方法.

## [m] redDouble

### redDouble(color)

**`6.3.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [Range[0..1]](dataTypes#range) }

获取颜色的 `R (red)` 分量, 取值范围 `[0..1]`.

相当于 `colors.red(color, { max: 1 })`.

```js
colors.redDouble('#663399'); // 0.4
```

## [m] getRed

### getRed(color)

**`6.3.0`** **`Overload 1/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [IntRange[0..255]](dataTypes#intrange) }

获取颜色的 `R (red)` 分量, 取值范围 `[0..255]`.

[colors.red(color)](#m-red) 的别名方法.

### getRed(color, options)

**`6.3.0`** **`Overload 2/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **options** {{
    - [ max = `255` ]?: `1` | `255` - 范围最大值
- }} - 选项参数
- <ins>**returns**</ins> { [IntRange[0..1]](dataTypes#intrange) | [IntRange[0..255]](dataTypes#intrange) }

获取颜色的 `R (red)` 分量.

[colors.red(color, options)](#m-red) 的别名方法.

## [m] getRedDouble

### getRedDouble(color)

**`6.3.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [Range[0..1]](dataTypes#range) }

获取颜色的 `R (red)` 分量, 取值范围 `[0..1]`.

[colors.redDouble(color)](#m-reddouble) 的别名方法.

## [m] setRed

### setRed(color, red)

**`6.3.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **red** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - R (red)
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

设置颜色的 `R (red)` 分量, 返回新颜色的颜色整数.

```js
colors.toHex(colors.setRed('#663399', 0x80)); // #803399
colors.toHex(colors.setRed('#663399', 0.5)); /* 同上, 0.5 解析为百分数分量, 即 50%. */

colors.toHex(colors.setRed('#663399', 255)); // #FF3399
colors.toHex(colors.setRed('#663399', 1)); /* #013399, 不同上. 1 默认作为整数分量, 而非 100%. */
```

## [m] setRedRelative

### setRedRelative(color, percentage)

**`6.3.1`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **percentage** { [ColorComponent](dataTypes#colorcomponent) } - 相对百分数
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

针对 `R (red)` 分量设置其相对百分比, 返回新颜色的颜色整数.

如当前颜色 `R (red)` 分量为 `80`, 希望设置 `R` 分量为 `50%` 相对量, 即 `40`:

```js
colors.setRedRelative(color, 0.5);
colors.setRedRelative(color, '50%'); /* 效果同上. */
```

同样地, 如希望设置 `R` 分量为 `1.5` 倍相对量, 即 `120`:

```js
colors.setRedRelative(color, 1.5);
colors.setRedRelative(color, '150%');
```

当设置的相对量超过 `255` 时, 将以 `255` 为最终值:

```js
colors.setRedRelative(color, 10); /* R 分量最终值为 255, 而非 800. */
```

特别地, 当原本颜色的 `R` 分量为 `0` 时, 无论如何设置相对量, `R` 分量均保持 `0` 值.

## [m] removeRed

### removeRed(color)

**`6.3.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

去除颜色的 `R (red)` 分量, 返回新颜色的颜色整数.

```js
colors.toHex(colors.removeRed('#BE663399')); // #BE003399
colors.toHex(colors.removeRed('#CC5500')); // #005500
````

相当于 `colors.setRed(color, 0)`.

## [m] green

### green(color)

**`Overload 1/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [IntRange[0..255]](dataTypes#intrange) }

获取颜色的 `G (green)` 分量, 取值范围 `[0..255]`.

```js
colors.green('#663399'); // 51
colors.green(colors.TRANSPARENT); // 0
colors.green('#05060708'); // 7
```

### green(color, options)

**`6.3.0`** **`Overload 2/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **options** {{
    - [ max = `255` ]?: `1` | `255` - 范围最大值
- }} - 选项参数
- <ins>**returns**</ins> { [IntRange[0..1]](dataTypes#intrange) | [IntRange[0..255]](dataTypes#intrange) }

获取颜色的 `G (green)` 分量.

取值范围 `[0..1]` (`options.max` 为 `1`) 或 `[0..255]` (`options.max` 为 `255` 或不指定).

```js
colors.green('#663399', { max: 1 }); // 0.2
colors.green('#663399', { max: 255 }); // 51
colors.green('#663399'); /* 同上. */
```

当 `options.max` 为 `1` 时, 相当于 [colors.greenDouble](#m-greendouble) 方法.

## [m] greenDouble

### greenDouble(color)

**`6.3.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [Range[0..1]](dataTypes#range) }

获取颜色的 `G (green)` 分量, 取值范围 `[0..1]`.

相当于 `colors.green(color, { max: 1 })`.

```js
colors.greenDouble('#663399'); // 0.2
```

## [m] getGreen

### getGreen(color)

**`6.3.0`** **`Overload 1/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [IntRange[0..255]](dataTypes#intrange) }

获取颜色的 `G (green)` 分量, 取值范围 `[0..255]`.

[colors.green(color)](#m-green) 的别名方法.

## [m] setGreenRelative

### setGreenRelative(color, percentage)

**`6.3.1`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **percentage** { [ColorComponent](dataTypes#colorcomponent) } - 相对百分数
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

针对 `G (green)` 分量设置其相对百分比, 返回新颜色的颜色整数.

如当前颜色 `G (green)` 分量为 `80`, 希望设置 `G` 分量为 `50%` 相对量, 即 `40`:

```js
colors.setGreenRelative(color, 0.5);
colors.setGreenRelative(color, '50%'); /* 效果同上. */
```

同样地, 如希望设置 `G` 分量为 `1.5` 倍相对量, 即 `120`:

```js
colors.setGreenRelative(color, 1.5);
colors.setGreenRelative(color, '150%');
```

当设置的相对量超过 `255` 时, 将以 `255` 为最终值:

```js
colors.setGreenRelative(color, 10); /* G 分量最终值为 255, 而非 800. */
```

特别地, 当原本颜色的 `G` 分量为 `0` 时, 无论如何设置相对量, `G` 分量均保持 `0` 值.

### getGreen(color, options)

**`6.3.0`** **`Overload 2/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **options** {{
    - [ max = `255` ]?: `1` | `255` - 范围最大值
- }} - 选项参数
- <ins>**returns**</ins> { [IntRange[0..1]](dataTypes#intrange) | [IntRange[0..255]](dataTypes#intrange) }

获取颜色的 `G (green)` 分量.

[colors.green(color, options)](#m-green) 的别名方法.

## [m] getGreenDouble

### getGreenDouble(color)

**`6.3.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [Range[0..1]](dataTypes#range) }

获取颜色的 `G (green)` 分量, 取值范围 `[0..1]`.

[colors.greenDouble(color)](#m-greendouble) 的别名方法.

## [m] setGreen

### setGreen(color, green)

**`6.3.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **green** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - G (green)
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

设置颜色的 `G (green)` 分量, 返回新颜色的颜色整数.

```js
colors.toHex(colors.setGreen('#663399', 0x80)); // #668099
colors.toHex(colors.setGreen('#663399', 0.5)); /* 同上, 0.5 解析为百分数分量, 即 50%. */

colors.toHex(colors.setGreen('#663399', 255)); // #66FF99
colors.toHex(colors.setGreen('#663399', 1)); /* #660199, 不同上. 1 默认作为整数分量, 而非 100%. */
```

## [m] removeGreen

### removeGreen(color)

**`6.3.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

去除颜色的 `G (green)` 分量, 返回新颜色的颜色整数.

```js
colors.toHex(colors.removeGreen('#BE663399')); // #BE660099
colors.toHex(colors.removeGreen('#CC5500')); // #CC0000
````

相当于 `colors.setGreen(color, 0)`.

## [m] blue

### blue(color)

**`Overload 1/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [IntRange[0..255]](dataTypes#intrange) }

获取颜色的 `B (blue)` 分量, 取值范围 `[0..255]`.

```js
colors.blue('#663399'); // 153
colors.blue(colors.TRANSPARENT); // 0
colors.blue('#05060708'); // 8
```

### blue(color, options)

**`6.3.0`** **`Overload 2/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **options** {{
    - [ max = `255` ]?: `1` | `255` - 范围最大值
- }} - 选项参数
- <ins>**returns**</ins> { [IntRange[0..1]](dataTypes#intrange) | [IntRange[0..255]](dataTypes#intrange) }

获取颜色的 `B (blue)` 分量.

取值范围 `[0..1]` (`options.max` 为 `1`) 或 `[0..255]` (`options.max` 为 `255` 或不指定).

```js
colors.blue('#663399', { max: 1 }); // 0.6
colors.blue('#663399', { max: 255 }); // 153
colors.blue('#663399'); /* 同上. */
```

当 `options.max` 为 `1` 时, 相当于 [colors.blueDouble](#m-bluedouble) 方法.

## [m] blueDouble

### blueDouble(color)

**`6.3.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [Range[0..1]](dataTypes#range) }

获取颜色的 `A (blue)` 分量, 取值范围 `[0..1]`.

相当于 `colors.blue(color, { max: 1 })`.

```js
colors.blueDouble('#663399'); // 0.6
```

## [m] getBlue

### getBlue(color)

**`6.3.0`** **`Overload 1/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [IntRange[0..255]](dataTypes#intrange) }

获取颜色的 `B (blue)` 分量, 取值范围 `[0..255]`.

[colors.blue(color)](#m-blue) 的别名方法.

### getBlue(color, options)

**`6.3.0`** **`Overload 2/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **options** {{
    - [ max = `255` ]?: `1` | `255` - 范围最大值
- }} - 选项参数
- <ins>**returns**</ins> { [IntRange[0..1]](dataTypes#intrange) | [IntRange[0..255]](dataTypes#intrange) }

获取颜色的 `B (blue)` 分量.

[colors.blue(color, options)](#m-blue) 的别名方法.

## [m] getBlueDouble

### getBlueDouble(color)

**`6.3.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [Range[0..1]](dataTypes#range) }

获取颜色的 `A (blue)` 分量, 取值范围 `[0..1]`.

[colors.blueDouble(color)](#m-bluedouble) 的别名方法.

## [m] setBlue

### setBlue(color, blue)

**`6.3.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **blue** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - B (blue)
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

设置颜色的 `B (blue)` 分量, 返回新颜色的颜色整数.

```js
colors.toHex(colors.setBlue('#663399', 0x80)); // #663380
colors.toHex(colors.setBlue('#663399', 0.5)); /* 同上, 0.5 解析为百分数分量, 即 50%. */

colors.toHex(colors.setBlue('#663399', 255)); // #6633FF
colors.toHex(colors.setBlue('#663399', 1)); /* #663301, 不同上. 1 默认作为整数分量, 而非 100%. */
```

## [m] setBlueRelative

### setBlueRelative(color, percentage)

**`6.3.1`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **percentage** { [ColorComponent](dataTypes#colorcomponent) } - 相对百分数
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

针对 `B (blue)` 分量设置其相对百分比, 返回新颜色的颜色整数.

如当前颜色 `B (blue)` 分量为 `80`, 希望设置 `B` 分量为 `50%` 相对量, 即 `40`:

```js
colors.setBlueRelative(color, 0.5);
colors.setBlueRelative(color, '50%'); /* 效果同上. */
```

同样地, 如希望设置 `B` 分量为 `1.5` 倍相对量, 即 `120`:

```js
colors.setBlueRelative(color, 1.5);
colors.setBlueRelative(color, '150%');
```

当设置的相对量超过 `255` 时, 将以 `255` 为最终值:

```js
colors.setBlueRelative(color, 10); /* B 分量最终值为 255, 而非 800. */
```

特别地, 当原本颜色的 `B` 分量为 `0` 时, 无论如何设置相对量, `B` 分量均保持 `0` 值.

## [m] removeBlue

### removeBlue(color)

**`6.3.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

去除颜色的 `B (blue)` 分量, 返回新颜色的颜色整数.

```js
colors.toHex(colors.removeBlue('#BE663399')); // #BE663300
colors.toHex(colors.removeBlue('#CC5500')); // #CC5500
````

相当于 `colors.setBlue(color, 0)`.

## [m] rgb

### rgb(color)

**`[6.2.0]`** **`Overload 1/3`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

获取 `color` 参数对应的 [颜色整数 (ColorInt)](dataTypes#colorint).

`color` 参数为颜色代码时, 支持情况如下:

| 格式        | 备注              |
|-----------|-----------------|
| #RRGGBB   | 正常              |
| #RGB      | 正常              |
| #AARRGGBB | A (alpha) 分量被忽略 |

方法调用结果的 `A (alpha)` 分量恒为 `255`, 意味着 `color` 参数中的 `A` 分量信息将被忽略.

```js
colors.rgb('#663399');
colors.rgb('#DE663399'); /* 同上, A 分量被忽略. */
```

### rgb(red, green, blue)

**`6.2.0`** **`Overload 2/3`**

- **red** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - R (red)
- **green** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - G (green)
- **blue** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - B (blue)
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

通过 [颜色分量](dataTypes#colorcomponent) 获取 [颜色整数 (ColorInt)](dataTypes#colorint).

```js
colors.rgb(255, 128, 9);
colors.rgb(0xFF, 0x80, 0x09); /* 同上. */
colors.rgb('#FF8009'); /* 同上. */
colors.rgb(1, 0.5, '3.53%'); /* 同上. */
```

### rgb(components)

**`6.2.0`** **`Overload 3/3`**

- **components** { [ColorComponents](dataTypes#colorcomponents)[[]](dataTypes#array) } - 颜色分量数组
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

通过 [颜色分量数组](dataTypes#colorcomponents) 获取 [颜色整数 (ColorInt)](dataTypes#colorint).

```js
colors.rgb([ 255, 128, 9 ]);
colors.rgb([ 0xFF, 0x80, 0x09 ]); /* 同上. */
colors.rgb([ 1, 0.5, '3.53%' ]); /* 同上. */
```

## [m] argb

### argb(colorHex)

**`[6.2.0]`** **`Overload 1/3`**

- **colorHex** { [string](dataTypes#string) } - 颜色代码
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

获取 `colorHex` 颜色代码对应的 [颜色整数 (ColorInt)](dataTypes#colorint).

| 格式        | 备注                 |
|-----------|--------------------|
| #RRGGBB   | A (alpha) 分量为 0xFF |
| #RGB      | A (alpha) 分量为 0xFF |
| #AARRGGBB | -                  |

```js
colors.argb('#663399'); /* 相当于 argb('#FF663399'). */
colors.argb('#DE663399'); /* 结果不同上. */
```

### argb(alpha, red, green, blue)

**`6.2.0`** **`Overload 2/3`**

- **alpha** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - A (alpha)
- **red** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - R (red)
- **green** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - G (green)
- **blue** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - B (blue)
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

通过 [颜色分量](dataTypes#colorcomponent) 获取 [颜色整数 (ColorInt)](dataTypes#colorint).

```js
colors.argb(64, 255, 128, 9);
colors.argb(0x40, 0xFF, 0x80, 0x09); /* 同上. */
colors.argb('#40FF8009'); /* 同上. */
colors.argb(0.25, 1, 0.5, '3.53%'); /* 同上. */
```

### argb(components)

**`6.2.0`** **`Overload 3/3`**

- **components** { [ColorComponents](dataTypes#colorcomponents)[[]](dataTypes#array) } - 颜色分量数组
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

通过 [颜色分量数组](dataTypes#colorcomponents) 获取 [颜色整数 (ColorInt)](dataTypes#colorint).

```js
colors.argb([ 64, 255, 128, 9 ]);
colors.argb([ 0x40, 0xFF, 0x80, 0x09 ]); /* 同上. */
colors.argb([ 0.25, 1, 0.5, '3.53%' ]); /* 同上. */
```

## [m] rgba

### rgba(colorHex)

**`[6.2.0]`** **`Overload 1/3`**

- **colorHex** { [string](dataTypes#string) } - 颜色代码
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

获取 `colorHex` 颜色代码对应的 [颜色整数 (ColorInt)](dataTypes#colorint).

| 格式        | 备注                 |
|-----------|--------------------|
| #RRGGBB   | A (alpha) 分量为 0xFF |
| #RGB      | A (alpha) 分量为 0xFF |
| #RRGGBBAA | -                  |

```js
colors.rgba('#663399'); /* 相当于 rgba('#663399FF'). */
colors.rgba('#663399FF'); /* 结果同上. */
colors.rgba('#FF663399'); /* 结果不同上. */
```

注意区分 `colors.rgba` 与 `colors.argb`:

```js
colors.rgba('#11335577'); /* A (alpha) 分量为 0x77. */
colors.argb('#11335577'); /* A (alpha) 分量为 0x11. */
```

### rgba(red, green, blue, alpha)

**`6.2.0`** **`Overload 2/3`**

- **red** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - R (red)
- **green** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - G (green)
- **blue** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - B (blue)
- **alpha** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - A (alpha)
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

通过 [颜色分量](dataTypes#colorcomponent) 获取 [颜色整数 (ColorInt)](dataTypes#colorint).

```js
colors.rgba(255, 128, 9, 64);
colors.rgba(0xFF, 0x80, 0x09, 0x40); /* 同上. */
colors.rgba('#FF800940'); /* 同上. */
colors.rgba(1, 0.5, '3.53%', 0.25); /* 同上. */
```

### rgba(components)

**`6.2.0`** **`Overload 3/3`**

- **components** { [ColorComponents](dataTypes#colorcomponents)[[]](dataTypes#array) } - 颜色分量数组
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

通过 [颜色分量数组](dataTypes#colorcomponents) 获取 [颜色整数 (ColorInt)](dataTypes#colorint).

```js
colors.rgba([ 255, 128, 9, 64 ]);
colors.rgba([ 0xFF, 0x80, 0x09, 0x40 ]); /* 同上. */
colors.rgba([ 1, 0.5, '3.53%', 0.25 ]); /* 同上. */
```

## [m] hsv

### hsv(hue, saturation, value)

**`6.2.0`** **`Overload 1/2`**

- **hue** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - H (hue)
- **saturation** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - S (saturation)
- **value** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - V (value)
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

通过 [颜色分量](dataTypes#colorcomponent) 获取 [颜色整数 (ColorInt)](dataTypes#colorint).

```js
colors.hsv(90, 80, 64);
colors.hsv(90, 0.8, 0.64); /* 同上. */
colors.hsv(0.25, 0.8, 0.64); /* 同上. */
colors.hsv('25%', '80%', '64%'); /* 同上. */
```

### hsv(components)

**`6.2.0`** **`Overload 2/2`**

- **components** { [ColorComponents](dataTypes#colorcomponents)[[]](dataTypes#array) } - 颜色分量数组
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

通过 [颜色分量数组](dataTypes#colorcomponents) 获取 [颜色整数 (ColorInt)](dataTypes#colorint).

```js
colors.hsv([ 90, 80, 64 ]);
colors.hsv([ 90, 0.8, 0.64 ]); /* 同上. */
colors.hsv([ 0.25, 0.8, 0.64 ]); /* 同上. */
colors.hsv([ '25%', '80%', '64%' ]); /* 同上. */
```

## [m] hsva

### hsva(hue, saturation, value, alpha)

**`6.2.0`** **`Overload 1/2`**

- **hue** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - H (hue)
- **saturation** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - S (saturation)
- **value** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - V (value)
- **alpha** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - A (alpha)
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

通过 [颜色分量](dataTypes#colorcomponent) 获取 [颜色整数 (ColorInt)](dataTypes#colorint).

```js
colors.hsva(90, 80, 64, 64);
colors.hsva(90, 0.8, 0.64, 0.25); /* 同上. */
colors.hsva(0.25, 0.8, 0.64, 0.25); /* 同上. */
colors.hsva('25%', '80%', '64%', '25%'); /* 同上. */
```

### hsva(components)

**`6.2.0`** **`Overload 2/2`**

- **components** { [ColorComponents](dataTypes#colorcomponents)[[]](dataTypes#array) } - 颜色分量数组
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

通过 [颜色分量数组](dataTypes#colorcomponents) 获取 [颜色整数 (ColorInt)](dataTypes#colorint).

```js
colors.hsva([ 90, 80, 64, 64 ]);
colors.hsva([ 90, 0.8, 0.64, 0.25 ]); /* 同上. */
colors.hsva([ 0.25, 0.8, 0.64, 0.25 ]); /* 同上. */
colors.hsva([ '25%', '80%', '64%', '25%' ]); /* 同上. */
```

## [m] hsl

### hsl(hue, saturation, lightness)

**`6.2.0`** **`Overload 1/2`**

- **hue** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - H (hue)
- **saturation** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - S (saturation)
- **lightness** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - L (lightness)
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

通过 [颜色分量](dataTypes#colorcomponent) 获取 [颜色整数 (ColorInt)](dataTypes#colorint).

```js
colors.hsl(90, 80, 64);
colors.hsl(90, 0.8, 0.64); /* 同上. */
colors.hsl(0.25, 0.8, 0.64); /* 同上. */
colors.hsl('25%', '80%', '64%'); /* 同上. */
```

### hsl(components)

**`6.2.0`** **`Overload 2/2`**

- **components** { [ColorComponents](dataTypes#colorcomponents)[[]](dataTypes#array) } - 颜色分量数组
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

通过 [颜色分量数组](dataTypes#colorcomponents) 获取 [颜色整数 (ColorInt)](dataTypes#colorint).

```js
colors.hsl([ 90, 80, 64 ]);
colors.hsl([ 90, 0.8, 0.64 ]); /* 同上. */
colors.hsl([ 0.25, 0.8, 0.64 ]); /* 同上. */
colors.hsl([ '25%', '80%', '64%' ]); /* 同上. */
```

## [m] hsla

### hsla(hue, saturation, lightness, alpha)

**`6.2.0`** **`Overload 1/2`**

- **hue** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - H (hue)
- **saturation** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - S (saturation)
- **lightness** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - L (lightness)
- **alpha** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - A (alpha)
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

通过 [颜色分量](dataTypes#colorcomponent) 获取 [颜色整数 (ColorInt)](dataTypes#colorint).

```js
colors.hsla(90, 80, 64, 64);
colors.hsla(90, 0.8, 0.64, 0.25); /* 同上. */
colors.hsla(0.25, 0.8, 0.64, 0.25); /* 同上. */
colors.hsla('25%', '80%', '64%', '25%'); /* 同上. */
```

### hsla(components)

**`6.2.0`** **`Overload 2/2`**

- **components** { [ColorComponents](dataTypes#colorcomponents)[[]](dataTypes#array) } - 颜色分量数组
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

通过 [颜色分量数组](dataTypes#colorcomponents) 获取 [颜色整数 (ColorInt)](dataTypes#colorint).

```js
colors.hsla([ 90, 80, 64, 64 ]);
colors.hsla([ 90, 0.8, 0.64, 0.25 ]); /* 同上. */
colors.hsla([ 0.25, 0.8, 0.64, 0.25 ]); /* 同上. */
colors.hsla([ '25%', '80%', '64%', '25%' ]); /* 同上. */
```

## [m] oklab

### oklab(L, a, b, alpha?)

**`6.8.0`** **`Overload [1-2]/3`**

- **L** { [number](dataTypes#number) | [string](dataTypes#string) } - 颜色分量 - L (lightness), 取值范围 `[0..1]`, 也可使用百分比字符串, 如 `'50%'`
- **a** { [number](dataTypes#number) } - 颜色分量 - a (绿-红轴), 通常位于 `[-0.4..0.4]`
- **b** { [number](dataTypes#number) } - 颜色分量 - b (蓝-黄轴), 通常位于 `[-0.4..0.4]`
- **[ alpha ]** { [number](dataTypes#number) } - 颜色分量 - A (alpha), 不大于 `1` 时按比例处理 (`1` 表示不透明), 大于 `1` 时按 `[0..255]` 处理; 省略时为不透明颜色
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

通过 [OKLab](https://bottosson.github.io/posts/oklab/) 颜色分量获取 [颜色整数 (ColorInt)](dataTypes#colorint).

OKLab 是感知均匀的色彩空间: 分量变化相同时, 人眼感受到的颜色变化也大致相同. `L` 为亮度, `a` 与 `b` 分别表示绿-红轴与蓝-黄轴上的位置.

分量超出 sRGB 色域时, 保持亮度与色相并降低彩度, 直到颜色可以表示.

```js
colors.toHex(colors.oklab(0.628, 0.2249, 0.1258)); // "#FF0000"
colors.toHex(colors.oklab('50%', 0, 0)); // "#636363"
colors.toHex(colors.oklab(0.5, 0, 0, 0.5), 8); // "#80636363"
colors.toHex(colors.oklab(0.7, 0.4, 0)); /* "#FF5799", 超出 sRGB 色域, 彩度被降低. */
```

### oklab(components)

**`6.8.0`** **`Overload 3/3`**

- **components** { [number](dataTypes#number)[] } - 颜色分量数组 `[L, a, b]` 或 `[L, a, b, alpha]`
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

通过 OKLab 颜色分量数组获取 [颜色整数 (ColorInt)](dataTypes#colorint). 分量的含义与 [oklab(L, a, b, alpha?)](#oklabl-a-b-alpha) 相同.

```js
colors.oklab([ 0.5, 0, 0 ]); /* 与 colors.oklab(0.5, 0, 0) 相同. */

/* 与 colors.toOklab 配合, 提高亮度但保持色相. */
let [ l, a, b ] = colors.toOklab('#00897B');
colors.toHex(colors.oklab(l + 0.1, a, b));
```

## [m] oklch

### oklch(L, C, h, alpha?)

**`6.8.0`** **`Overload [1-2]/3`**

- **L** { [number](dataTypes#number) | [string](dataTypes#string) } - 颜色分量 - L (lightness), 取值范围 `[0..1]`, 也可使用百分比字符串, 如 `'50%'`
- **C** { [number](dataTypes#number) } - 颜色分量 - C (chroma, 彩度), 不小于 `0`, sRGB 颜色的彩度至多约为 `0.37`
- **h** { [number](dataTypes#number) } - 颜色分量 - h (hue, 色相), 单位为度, 超出 `[0..360)` 时按周期折算
- **[ alpha ]** { [number](dataTypes#number) } - 颜色分量 - A (alpha), 不大于 `1` 时按比例处理 (`1` 表示不透明), 大于 `1` 时按 `[0..255]` 处理; 省略时为不透明颜色
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

通过 OKLCH 颜色分量获取 [颜色整数 (ColorInt)](dataTypes#colorint).

OKLCH 是 [OKLab](#m-oklab) 的极坐标形式, 便于单独调整亮度, 彩度或色相. 彩度超出 sRGB 色域时, 保持亮度与色相并降低彩度.

```js
colors.toHex(colors.oklch(0.7, 0.1, 200)); // "#40B1B7"
colors.toHex(colors.oklch('50%', 0.1, 270)); // "#4D5F9C"
colors.toHex(colors.oklch(0.7, 0.1, 200, 0.5), 8); // "#8040B1B7"
colors.toHex(colors.oklch(0.7, 0.1, 200, 128), 8); /* 同上. */
colors.oklch(0.6, 0.1, -20) === colors.oklch(0.6, 0.1, 340); // true
colors.toHex(colors.oklch(0.6, 0.4, 145)); /* "#009B29", 超出 sRGB 色域, 彩度被降低. */
```

### oklch(components)

**`6.8.0`** **`Overload 3/3`**

- **components** { [number](dataTypes#number)[] } - 颜色分量数组 `[L, C, h]` 或 `[L, C, h, alpha]`
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

通过 OKLCH 颜色分量数组获取 [颜色整数 (ColorInt)](dataTypes#colorint). 分量的含义与 [oklch(L, C, h, alpha?)](#oklchl-c-h-alpha) 相同.

```js
colors.oklch([ 0.7, 0.1, 200 ]); /* 与 colors.oklch(0.7, 0.1, 200) 相同. */

/* 与 colors.toOklch 配合, 保持亮度与彩度, 将色相旋转 180 度. */
let [ l, c, h ] = colors.toOklch('#2196F3');
colors.toHex(colors.oklch(l, c, h + 180)); // "#C97E00"
```

## [m] toRgb

### toRgb(color)

**`6.2.0`** **`Overload 1/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [ColorComponents](dataTypes#colorcomponents) } - 颜色分量数组

获取颜色参数的 RGB [颜色分量数组](dataTypes#colorcomponents).

```js
let [ r, g, b ] = colors.toRgb('#663399');
console.log(`R: ${r}, G: ${g}, B: ${b}`);
```

### toRgb(red, green, blue)

**`Overload 2/2`**

- **red** { [ColorComponent](dataTypes#colorcomponent) } - R 分量
- **green** { [ColorComponent](dataTypes#colorcomponent) } - G 分量
- **blue** { [ColorComponent](dataTypes#colorcomponent) } - B 分量
- <ins>**returns**</ins> { [ColorComponents](dataTypes#colorcomponents) } - RGB 分量数组

先按 `colors.rgb(red, green, blue)` 解析颜色, 再返回 RGB 分量数组.

## [m] toRgba

### toRgba(color)

**`6.2.0`** **`Overload 1/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [ColorComponents](dataTypes#colorcomponents) } - 颜色分量数组

获取颜色参数的 RGBA [颜色分量数组](dataTypes#colorcomponents).

```js
let [ r, g, b, a ] = colors.toRgba('#DE663399');
console.log(`R: ${r}, G: ${g}, B: ${b}, A: ${a}`);
```

需留意上述示例的参数格式为 `#AARRGGBB`, 结果格式为 `[RR, GG, BB, AA]`.

### toRgba(color, options)

**`6.3.0`** **`Overload 2/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **options** {{
    - [ maxAlpha = `255` ]?: `1` | `255` - A (alpha) 分量的范围最大值
- }} - 选项参数
- <ins>**returns**</ins> { [ColorComponents](dataTypes#colorcomponents) } - 颜色分量数组

根据 `options` 选项参数获取颜色参数的 RGBA [颜色分量数组](dataTypes#colorcomponents).

```js
let [ r1, g1, b1, a1 ] = colors.toRgba('#DE663399');
console.log(`R: ${r1}, G: ${g1}, B: ${b1}, A: ${a1}`); /* A 分量范围为 [0..255]. */

let [ r2, g2, b2, a2 ] = colors.toRgba('#DE663399', { maxAlpha: 1 });
console.log(`R: ${r2}, G: ${g2}, B: ${b2}, A: ${a2}`); /* A 分量范围为 [0..1]. */
```

## [m] toArgb

### toArgb(color)

**`6.2.0`** **`Overload 1/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [ColorComponents](dataTypes#colorcomponents) } - 颜色分量数组

获取颜色参数的 ARGB [颜色分量数组](dataTypes#colorcomponents).

```js
let [ a, r, g, b ] = colors.toArgb('#DE663399');
console.log(`A: ${a}, R: ${r}, G: ${g}, B: ${b}`);
```

### toArgb(color, options)

**`6.3.0`** **`Overload 2/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **options** {{
    - [ maxAlpha = `255` ]?: `1` | `255` - A (alpha) 分量的范围最大值
- }} - 选项参数
- <ins>**returns**</ins> { [ColorComponents](dataTypes#colorcomponents) } - 颜色分量数组

根据 `options` 选项参数获取颜色参数的 ARGB [颜色分量数组](dataTypes#colorcomponents).

```js
let [ a1, r1, g1, b1 ] = colors.toArgb('#DE663399');
console.log(`A: ${a1}, R: ${r1}, G: ${g1}, B: ${b1}`); /* A 分量范围为 [0..255]. */

let [ a2, r2, g2, b2 ] = colors.toArgb('#DE663399', { maxAlpha: 1 });
console.log(`A: ${a2}, R: ${r2}, G: ${g2}, B: ${b2}`); /* A 分量范围为 [0..1]. */
```

## [m] toHsv

### toHsv(color)

**`6.2.0`** **`Overload 1/4`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [ColorComponents](dataTypes#colorcomponents) } - 颜色分量数组

获取颜色参数的 HSV [颜色分量数组](dataTypes#colorcomponents).

```js
let [ h, s, v ] = colors.toHsv('#663399');
console.log(`H: ${h}, S: ${s}, V: ${v}`);
```

### toHsv(red, green, blue)

**`6.2.0`** **`Overload 2/4`**

- **red** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - R (red)
- **green** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - G (green)
- **blue** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - B (blue)
- <ins>**returns**</ins> { [ColorComponents](dataTypes#colorcomponents) } - 颜色分量数组

获取颜色参数的 HSV [颜色分量数组](dataTypes#colorcomponents).

```js
let [ h, s, v ] = colors.toHsv(102, 51, 153);
console.log(`H: ${h}, S: ${s}, V: ${v}`);
```

### toHsv(color, result)

**`Overload 3/4`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **result** { [JavaArray](dataTypes#javaarray) } - Java 原始类型 `float[]`, 长度至少为 3
- <ins>**returns**</ins> { [ColorComponents](dataTypes#colorcomponents) } - 转换结果的 JavaScript 数组

将转换后的 HSV 分量写入 `result`, 同时返回 JavaScript 数组. `result` 必须是 Java `float[]`, 不能使用普通 JavaScript 数组或 Java `Float[]`. 写入前三项; 返回值复制整个结果容器, 因此建议传入长度恰为 3 的数组.

### toHsv(red, green, blue, result)

**`Overload 4/4`**

- **red** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量
- **green** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量
- **blue** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量
- **result** { [JavaArray](dataTypes#javaarray) } - Java 原始类型 `float[]`, 长度至少为 3
- <ins>**returns**</ins> { [ColorComponents](dataTypes#colorcomponents) } - 转换结果的 JavaScript 数组

将转换后的 HSV 分量写入 `result`, 同时返回 JavaScript 数组. `result` 必须是 Java `float[]`, 不能使用普通 JavaScript 数组或 Java `Float[]`. 写入前三项; 返回值复制整个结果容器, 因此建议传入长度恰为 3 的数组.

```js
let result = util.java.array('float', 3);
let hsv = colors.toHsv('#663399', result);
console.log(hsv, result[0]);
```

## [m] toHsva

### toHsva(color)

**`6.2.0`** **`Overload 1/4`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [ColorComponents](dataTypes#colorcomponents) } - 颜色分量数组

获取颜色参数的 HSVA [颜色分量数组](dataTypes#colorcomponents).

其中 A (alpha) 分量范围恒为 `[0..1]`.

```js
let [ h, s, v, a ] = colors.toHsva('#BF663399');
console.log(`H: ${h}, S: ${s}, V: ${v}, A: ${a}`);
```

### toHsva(red, green, blue, alpha)

**`6.2.0`** **`Overload 2/4`**

- **red** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - R (red)
- **green** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - G (green)
- **blue** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - B (blue)
- **alpha** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - A (alpha)
- <ins>**returns**</ins> { [ColorComponents](dataTypes#colorcomponents) } - 颜色分量数组

获取颜色参数的 HSVA [颜色分量数组](dataTypes#colorcomponents).

其中 A (alpha) 分量范围恒为 `[0..1]`.

```js
let [ h, s, v, a ] = colors.toHsva(102, 51, 153, 191);
console.log(`H: ${h}, S: ${s}, V: ${v}, A: ${a}`);
```

### toHsva(color, result)

**`Overload 3/4`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **result** { [JavaArray](dataTypes#javaarray) } - Java 原始类型 `float[]`, 长度至少为 4
- <ins>**returns**</ins> { [ColorComponents](dataTypes#colorcomponents) } - 转换结果的 JavaScript 数组

将转换后的 HSVA 分量写入 `result`, 同时返回 JavaScript 数组. `result` 必须是 Java `float[]`, 不能使用普通 JavaScript 数组或 Java `Float[]`. 实现写入前四项并返回四个分量.

### toHsva(red, green, blue, alpha, result)

**`Overload 4/4`**

- **red** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量
- **green** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量
- **blue** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量
- **alpha** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量
- **result** { [JavaArray](dataTypes#javaarray) } - Java 原始类型 `float[]`, 长度至少为 4
- <ins>**returns**</ins> { [ColorComponents](dataTypes#colorcomponents) } - 转换结果的 JavaScript 数组

将转换后的 HSVA 分量写入 `result`, 同时返回 JavaScript 数组. `result` 必须是 Java `float[]`, 不能使用普通 JavaScript 数组或 Java `Float[]`. 实现写入前四项并返回四个分量.

## [m] toHsl

### toHsl(color)

**`6.2.0`** **`Overload 1/4`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [ColorComponents](dataTypes#colorcomponents) } - 颜色分量数组

获取颜色参数的 HSL [颜色分量数组](dataTypes#colorcomponents).

```js
let [ h, s, l ] = colors.toHsl('#663399');
console.log(`H: ${h}, S: ${s}, L: ${l}`);
```

### toHsl(red, green, blue)

**`6.2.0`** **`Overload 2/4`**

- **red** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - R (red)
- **green** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - G (green)
- **blue** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - B (blue)
- <ins>**returns**</ins> { [ColorComponents](dataTypes#colorcomponents) } - 颜色分量数组

获取颜色参数的 HSL [颜色分量数组](dataTypes#colorcomponents).

```js
let [ h, s, l ] = colors.toHsl(102, 51, 153);
console.log(`H: ${h}, S: ${s}, L: ${l}`);
```

### toHsl(color, result)

**`Overload 3/4`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **result** { [JavaArray](dataTypes#javaarray) } - Java 原始类型 `float[]`, 长度至少为 3
- <ins>**returns**</ins> { [ColorComponents](dataTypes#colorcomponents) } - 转换结果的 JavaScript 数组

将转换后的 HSL 分量写入 `result`, 同时返回 JavaScript 数组. `result` 必须是 Java `float[]`, 不能使用普通 JavaScript 数组或 Java `Float[]`. 写入前三项; 返回值复制整个结果容器, 因此建议传入长度恰为 3 的数组.

### toHsl(red, green, blue, result)

**`Overload 4/4`**

- **red** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量
- **green** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量
- **blue** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量
- **result** { [JavaArray](dataTypes#javaarray) } - Java 原始类型 `float[]`, 长度至少为 3
- <ins>**returns**</ins> { [ColorComponents](dataTypes#colorcomponents) } - 转换结果的 JavaScript 数组

将转换后的 HSL 分量写入 `result`, 同时返回 JavaScript 数组. `result` 必须是 Java `float[]`, 不能使用普通 JavaScript 数组或 Java `Float[]`. 写入前三项; 返回值复制整个结果容器, 因此建议传入长度恰为 3 的数组.

## [m] toHsla

### toHsla(color)

**`6.2.0`** **`Overload 2/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [ColorComponents](dataTypes#colorcomponents) } - 颜色分量数组

获取颜色参数的 HSLA [颜色分量数组](dataTypes#colorcomponents).

其中 A (alpha) 分量范围恒为 `[0..1]`.

```js
let [ h, s, l, a ] = colors.toHsla('#BF663399');
console.log(`H: ${h}, S: ${s}, L: ${l}, A: ${a}`);
```

### toHsla(red, green, blue, alpha)

**`6.2.0`** **`Overload 1/2`**

- **red** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - R (red)
- **green** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - G (green)
- **blue** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - B (blue)
- **alpha** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - A (alpha)
- <ins>**returns**</ins> { [ColorComponents](dataTypes#colorcomponents) } - 颜色分量数组

获取颜色参数的 HSLA [颜色分量数组](dataTypes#colorcomponents).

其中 A (alpha) 分量范围恒为 `[0..1]`.

```js
let [ h, s, l, a ] = colors.toHsla(102, 51, 153, 191);
console.log(`H: ${h}, S: ${s}, L: ${l}, A: ${a}`);
```

## [m] toOklab

### toOklab(color)

**`6.8.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [number](dataTypes#number)[] } - OKLab 颜色分量数组 `[L, a, b]`

获取颜色参数的 [OKLab](#m-oklab) 颜色分量数组.

`L` 的取值范围为 `[0..1]`, `a` 与 `b` 通常位于 `[-0.4..0.4]`. 分量不经舍入, 结果不含 A (alpha) 分量.

```js
colors.toOklab('white'); /* 约为 [ 1, 0, 0 ]. */
let [ l, a, b ] = colors.toOklab('red'); /* 约为 [ 0.628, 0.2249, 0.1258 ]. */
```

## [m] toOklch

### toOklch(color)

**`6.8.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [number](dataTypes#number)[] } - OKLCH 颜色分量数组 `[L, C, h]`

获取颜色参数的 [OKLCH](#m-oklch) 颜色分量数组.

`L` 的取值范围为 `[0..1]`, 彩度 `C` 不小于 `0`, 色相 `h` 的取值范围为 `[0..360)`. 黑, 白, 灰等无彩色没有色相, 其 `h` 为 `0`. 分量不经舍入, 结果不含 A (alpha) 分量.

```js
let [ l, c, h ] = colors.toOklch('red'); /* 约为 [ 0.628, 0.2577, 29.2339 ]. */
colors.toOklch('#808080'); /* 约为 [ 0.5999, 0, 0 ]. */
```

## [m] toRgbString

### toRgbString(color)

**`6.6.2`** **`Overload 1/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [string](dataTypes#string) } - `rgb(r, g, b)` 格式的颜色字符串

将颜色转换为 RGB 字符串. 各分量会四舍五入并限制在 `0` 至 `255`.

```js
console.log(colors.toRgbString("#663399")); // rgb(102, 51, 153)
```

### toRgbString(red, green, blue)

**`6.6.2`** **`Overload 2/2`**

- **red** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - R (red)
- **green** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - G (green)
- **blue** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - B (blue)
- <ins>**returns**</ins> { [string](dataTypes#string) } - `rgb(r, g, b)` 格式的颜色字符串

```js
console.log(colors.toRgbString(102, 51, 153)); // rgb(102, 51, 153)
```

## [m] toRgbaString

### toRgbaString(color, options?)

**`6.6.2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **[ options = true ]** { [boolean](dataTypes#boolean) | [object](dataTypes#object) } - 是否为完全不透明的 A 分量保留末尾 `.0`
- <ins>**returns**</ins> { [string](dataTypes#string) } - `rgba(r, g, b, a)` 格式的颜色字符串

将颜色转换为 RGBA 字符串. A 分量范围为 `0` 至 `1`, 保留 1 位小数后移除无意义的末尾 `0`.

`options` 为对象时, 使用其 `keepTrailingZeroForFullAlpha` 属性. 默认值为 `true`, 因此完全不透明的 A 分量表示为 `1.0`; 设为 `false` 时表示为 `1`.

```js
console.log(colors.toRgbaString("#80663399")); // rgba(102, 51, 153, 0.5)
console.log(colors.toRgbaString("#663399")); // rgba(102, 51, 153, 1.0)
console.log(colors.toRgbaString("#663399", false)); // rgba(102, 51, 153, 1)
```

## [m] toArgbString

### toArgbString(color, options?)

**`6.6.2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **[ options = true ]** { [boolean](dataTypes#boolean) | [object](dataTypes#object) } - 是否为完全不透明的 A 分量保留末尾 `.0`
- <ins>**returns**</ins> { [string](dataTypes#string) } - `argb(a, r, g, b)` 格式的颜色字符串

将颜色转换为 ARGB 字符串. `options` 的布尔值或对象属性 `keepTrailingZeroForFullAlpha` 与 [`toRgbaString()`](#m-torgbastring) 相同.

```js
console.log(colors.toArgbString("#80663399")); // argb(0.5, 102, 51, 153)
```

## [m] toHsvString

### toHsvString(color)

**`6.6.2`** **`Overload 1/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [string](dataTypes#string) } - `hsv(h, s, v)` 格式的颜色字符串

将颜色转换为 HSV 字符串. H 分量四舍五入为整数, S 和 V 分量使用百分比并保留至多 1 位小数.

```js
console.log(colors.toHsvString("#663399")); // hsv(270, 66.7%, 60%)
```

### toHsvString(red, green, blue)

**`6.6.2`** **`Overload 2/2`**

- **red** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - R (red)
- **green** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - G (green)
- **blue** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - B (blue)
- <ins>**returns**</ins> { [string](dataTypes#string) } - `hsv(h, s, v)` 格式的颜色字符串

```js
console.log(colors.toHsvString(102, 51, 153)); // hsv(270, 66.7%, 60%)
```

## [m] toHsvaString

### toHsvaString(color, options?)

**`6.6.2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **[ options = true ]** { [boolean](dataTypes#boolean) | [object](dataTypes#object) } - 是否为完全不透明的 A 分量保留末尾 `.0`
- <ins>**returns**</ins> { [string](dataTypes#string) } - `hsva(h, s, v, a)` 格式的颜色字符串

将颜色转换为 HSVA 字符串. H, S 和 V 的格式与 [`toHsvString()`](#m-tohsvstring) 相同. `options` 的布尔值或对象属性 `keepTrailingZeroForFullAlpha` 与 [`toRgbaString()`](#m-torgbastring) 相同.

```js
console.log(colors.toHsvaString("#80663399")); // hsva(270, 66.7%, 60%, 0.5)
```

## [m] toHslString

### toHslString(color)

**`6.6.2`** **`Overload 1/2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [string](dataTypes#string) } - `hsl(h, s, l)` 格式的颜色字符串

将颜色转换为 HSL 字符串. H 分量四舍五入为整数, S 和 L 分量使用百分比并保留至多 1 位小数.

```js
console.log(colors.toHslString("#663399")); // hsl(270, 50%, 40%)
```

### toHslString(red, green, blue)

**`6.6.2`** **`Overload 2/2`**

- **red** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - R (red)
- **green** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - G (green)
- **blue** { [ColorComponent](dataTypes#colorcomponent) } - 颜色分量 - B (blue)
- <ins>**returns**</ins> { [string](dataTypes#string) } - `hsl(h, s, l)` 格式的颜色字符串

```js
console.log(colors.toHslString(102, 51, 153)); // hsl(270, 50%, 40%)
```

## [m] toHslaString

### toHslaString(color, options?)

**`6.6.2`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **[ options = true ]** { [boolean](dataTypes#boolean) | [object](dataTypes#object) } - 是否为完全不透明的 A 分量保留末尾 `.0`
- <ins>**returns**</ins> { [string](dataTypes#string) } - `hsla(h, s, l, a)` 格式的颜色字符串

将颜色转换为 HSLA 字符串. H, S 和 L 的格式与 [`toHslString()`](#m-tohslstring) 相同. `options` 的布尔值或对象属性 `keepTrailingZeroForFullAlpha` 与 [`toRgbaString()`](#m-torgbastring) 相同.

```js
console.log(colors.toHslaString("#80663399")); // hsla(270, 50%, 40%, 0.5)
```

## [m] isSimilar

### isSimilar(colorA, colorB, threshold?, algorithm?)

**`[6.2.0]`** **`Overload [1-3]/4`**

- **colorA** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **colorB** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **[ threshold = `4` ]** { [IntRange[0..255]](dataTypes#intrange) } - [颜色匹配阈值](glossaries#颜色匹配阈值)
- **[ algorithm = `'diff'` ]** { [ColorDetectionAlgorithm](dataTypes#colordetectionalgorithm) } - 颜色检测算法
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 两个颜色是否相似

判断两个颜色是否相似.

不同阈值对结果的影响 (阈值越高, 条件越宽松, 阈值越低, 条件越严格):

```js
colors.isSimilar('orange', 'dark-orange', 5); /* false, 阈值较小, 条件相对严格. */
colors.isSimilar('orange', 'dark-orange', 10); /* true, 阈值增大, 条件趋于宽松. */
```

不同 [颜色检测算法](dataTypes#colordetectionalgorithm) 对结果的影响:

```js
colors.isSimilar('orange', 'dark-orange', 9, 'rgb+'); // false
colors.isSimilar('orange', 'dark-orange', 9, 'diff'); // true
colors.isSimilar('orange', 'dark-orange', 9, 'hs'); // true

colors.isSimilar('orange', 'dark-orange', 8, 'rgb+'); // false
colors.isSimilar('orange', 'dark-orange', 8, 'diff'); // false
colors.isSimilar('orange', 'dark-orange', 8, 'hs'); // true
```

### isSimilar(colorA, colorB, options)

**`Overload 4/4`**

- **colorA** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **colorB** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **options** {{
    - [ similarity ≈ `0.9843` ]?: [Range[0..1]](dataTypes#range) - [颜色匹配相似度](glossaries#相似度)
    - [ threshold = `4` ]?: [IntRange[0..255]](dataTypes#intrange) - [颜色匹配阈值](glossaries#颜色匹配阈值)
    - [ algorithm = `'diff'` ]?: [ColorDetectionAlgorithm](dataTypes#colordetectionalgorithm) - 颜色检测算法
- }} - 选项参数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 两个颜色是否相似

判断两个颜色是否相似.

此方法将非必要参数集中于 `options` 对象中.

```js
colors.isSimilar('#010101', '#020202', { similarity: 0.95 }); // true
```

## [m] isEqual

### isEqual(colorA, colorB, alphaMatters?)

**`6.2.0`** **`Overload[1-2]/2`**

- **colorA** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **colorB** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **[ alphaMatters = `false` ]** { [boolean](dataTypes#boolean) } - 是否考虑 `A (alpha)` 分量
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 两个颜色是否相等

判断两个颜色是否相等, 比较时由 `alphaMatters` 参数决定是否考虑 `A (alpha)` 分量:

```js
/* Hex 代码. */
colors.isEqual('#FF0000', '#FF0000'); // true
colors.isEqual('#FF0000', '#F00'); /* 同上, 三位数简写形式. */
/* 颜色整数. */
colors.isEqual(-65536, 0xFF0000); // true
/* 颜色名称. */
colors.isEqual('red', 'RED'); /* true, 不区分大小写. */
colors.isEqual('orange', 'Orange'); /* true, 不区分大小写. */
colors.isEqual('dark-gray', 'DARK_GRAY'); /* true, 连字符与下划线均被支持. */
/* 不同类型比较. */
colors.isEqual('red', '#FF0000'); // true
colors.isEqual('orange', '#FFA500'); // true
/* A (alpha) 分量的不同情况. */
colors.isEqual('#A1FF0000', '#A2FF0000'); /* true, 默认忽略 A 分量. */
colors.isEqual('#A1FF0000', '#A2FF0000', true); /* false, 需考虑 A 分量. */
```

## [m] equals

### equals(colorA, colorB)

**`DEPRECATED`**

- **colorA** { [number](dataTypes#number) | [string](dataTypes#string) } - 颜色参数
- **colorB** { [number](dataTypes#number) | [string](dataTypes#string) } - 颜色参数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 两个颜色是否相等 (忽略 `A (alpha)` 分量)

判断两个颜色是否相等, 比较时忽略 `A (alpha)` 分量:

```js
/* Hex 代码. */
colors.equals('#FF0000', '#FF0000'); // true
/* 颜色整数. */
colors.equals(-65536, 0xFF0000); // true
/* 颜色名称. */
colors.equals('red', 'RED'); // true
/* 不同类型比较. */
colors.equals('red', '#FF0000'); // true
/* A (alpha) 分量将被忽略. */
colors.equals('#A1FF0000', '#A2FF0000'); // true
```

但以下示例将全部抛出异常:

```js
colors.equals('orange', '#FFA500'); /* 抛出异常. */
colors.equals('dark-gray', '#444'); /* 抛出异常. */
colors.equals('#FF0000', '#F00'); /* 抛出异常. */
```

上述示例对于 [colors.isEqual](#m-isequal) 则全部返回 `true`.

除非需要考虑多版本兼容, 否则建议始终使用 `colors.isEqual` 替代 `colors.equals`.

## [m] luminance

### luminance(color)

**`6.2.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [Range[0..1]](dataTypes#range) } - 颜色亮度

获取颜色的 [亮度 (Luminance)](glossaries#luminance), 取值范围 `[0..1]`.

```js
colors.luminance(colors.WHITE); // 1
colors.luminance(colors.BLACK); // 0
colors.luminance(colors.RED); // 0.2126
colors.luminance(colors.GREEN); // 0.7152
colors.luminance(colors.BLUE); // 0.0722
colors.luminance(colors.YELLOW); // 0.9278
```

> 参阅: [W3C Wiki](https://www.w3.org/WAI/GL/wiki/Relative_luminance)

## [m] distance

### distance(colorA, colorB, algorithm?)

**`6.8.0`**

- **colorA** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **colorB** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **[ algorithm = `'diff'` ]** { [ColorDetectionAlgorithm](dataTypes#colordetectionalgorithm) | { algorithm?: [ColorDetectionAlgorithm](dataTypes#colordetectionalgorithm) } } - 颜色检测算法
- <ins>**returns**</ins> { [Range[0..255]](dataTypes#range) } - 颜色距离

按指定 [颜色检测算法](dataTypes#colordetectionalgorithm) 计算两个颜色的距离, 量纲与 [颜色匹配阈值](glossaries#颜色匹配阈值) 一致, 因此 `colors.isSimilar(a, b, threshold, algorithm)` 等价于 `colors.distance(a, b, algorithm) <= threshold`:

```js
colors.distance('red', 'red'); // 0
colors.distance('orange', 'dark-orange'); /* 约为 8.33. */
colors.distance('orange', 'dark-orange') <= 9; /* true, 与 colors.isSimilar('orange', 'dark-orange', 9) 一致. */
colors.distance('orange', 'dark-orange', 'hs'); /* 使用色相饱和度距离检测. */
```

`'equal'` 算法返回各分量差值的最大值, 仅当两个颜色完全相同时为 `0`.

## [m] invert

### invert(color)

**`6.8.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) } - 反色

反转颜色的 `R (red)`, `G (green)`, `B (blue)` 分量, 保留 `A (alpha)` 分量:

```js
colors.toHex(colors.invert('#FF0000')); // "#00FFFF"
colors.toHex(colors.invert('#80FF0000'), 8); // "#8000FFFF"
```

## [m] blend

### blend(colorA, colorB, ratio?)

**`6.8.0`**

- **colorA** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **colorB** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **[ ratio = `0.5` ]** { [Range[0..1]](dataTypes#range) | [string](dataTypes#string) } - 第二个颜色的权重, 字符串按 [Numberx.parseAny](numberx#m-parseany) 解析
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) } - 混合后的颜色

按权重线性混合两个颜色 (含 `A (alpha)` 分量), `ratio` 为 `0` 时结果为 `colorA`, 为 `1` 时结果为 `colorB`:

```js
colors.toHex(colors.blend('black', 'white')); // "#7F7F7F"
colors.toHex(colors.blend('black', 'white', 0)); // "#000000"
colors.toHex(colors.blend('black', 'white', '100%')); // "#FFFFFF"
colors.toHex(colors.blend('red', 'blue', 0.25)); // "#BF003F"
```

## [m] contrast

### contrast(foreground, background)

**`6.8.0`**

- **foreground** { [OmniColor](omniTypes#omnicolor) } - 前景色
- **background** { [OmniColor](omniTypes#omnicolor) } - 背景色, 须为不透明颜色
- <ins>**returns**</ins> { [Range[1..21]](dataTypes#range) } - 对比度

按 [WCAG](https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio) 公式计算前景色与背景色的对比度, 取值范围 `[1..21]`. 前景色带透明度时先与背景色合成; 背景色带透明度时抛出异常.

通常 `4.5` 以上满足普通文本的可读性要求 (AA 标准), `7` 以上满足更高要求 (AAA 标准):

```js
colors.contrast('black', 'white'); // 21
colors.contrast('white', 'white'); // 1
colors.contrast('#777777', 'white') >= 4.5; // false
```

## [m] ensureContrast

### ensureContrast(color, background, ratio?)

**`6.8.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **background** { [OmniColor](omniTypes#omnicolor) } - 背景色, 须为不透明颜色
- **[ ratio = `4.5` ]** { [Range[1..21]](dataTypes#range) } - 目标对比度
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) } - 满足对比度要求的颜色

调整颜色的亮度, 使其与背景色的 [对比度](#m-contrast) 不低于 `ratio`. 默认值 `4.5` 对应 WCAG AA 标准对普通文本的要求.

- 颜色已满足要求时原样返回.
- 否则保持 OKLCH 色相与彩度 (色域允许时), 返回亮度最接近原色且满足要求的颜色.
- 任何亮度都无法满足要求时, 返回黑色与白色中对比度更高的一个.
- 计算时忽略 `color` 的 A (alpha) 分量, 结果保留原 A 分量. 背景色带透明度时抛出异常.

```js
colors.contrast('#FFC107', 'white'); /* 约为 1.63, 琥珀色文字在白色背景上难以辨认. */
colors.toHex(colors.ensureContrast('#FFC107', 'white')); /* "#977000", 对比度约为 4.53. */
colors.toHex(colors.ensureContrast('#FFC107', 'white', 3)); /* "#BC8D00", 对比度约为 3.02. */
colors.toHex(colors.ensureContrast('#2196F3', '#121212')); /* "#2196F3", 已满足要求, 原样返回. */
colors.toHex(colors.ensureContrast('#80FFC107', 'white'), 8); /* "#80977000", 保留 A 分量. */
colors.toHex(colors.ensureContrast('#777777', 'white', 21)); /* "#000000", 只有黑色能达到 21. */
```

## [m] harmony

### harmony(color, type)

**`6.8.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **type** { `'complementary'` | `'analogous'` | `'triadic'` | `'splitComplementary'` | `'tetradic'` } - 和谐色类型
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint)[] } - 和谐色数组, 首个元素为颜色本身

通过旋转 OKLCH 色相生成和谐色, 亮度与彩度保持不变 (超出 sRGB 色域时降低彩度). 结果均为不透明颜色.

| type                 | 名称    | 色相偏移 (度)       | 颜色数量 |
|----------------------|-------|----------------|------|
| `complementary`      | 互补色   | 0, 180         | 2    |
| `analogous`          | 邻近色   | 0, -30, 30     | 3    |
| `triadic`            | 三分色   | 0, 120, 240    | 3    |
| `splitComplementary` | 分裂互补色 | 0, 150, 210    | 3    |
| `tetradic`           | 四分色   | 0, 90, 180, 270 | 4    |

接近灰色的颜色 (OKLCH 彩度低于 `0.015`) 没有可辨的色相, 结果为该颜色的重复.

```js
colors.harmony('#2196F3', 'complementary').map(c => colors.toHex(c)); // [ "#2196F3", "#C97E00" ]
colors.harmony('#2196F3', 'triadic').map(c => colors.toHex(c)); // [ "#2196F3", "#E45D7C", "#71A412" ]
colors.harmony('#808080', 'triadic').map(c => colors.toHex(c)); // [ "#808080", "#808080", "#808080" ]
```

## [m] tones

### tones(color, count?)

**`6.8.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **[ count = `10` ]** { [IntRange[2..20]](dataTypes#intrange) } - 色阶数量
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint)[] } - 由浅到深排列的色阶

生成与颜色同色相 (OKLCH) 的色阶, 由浅到深排列, 结果均为不透明颜色.

默认 10 级色阶的 OKLCH 亮度依次为 `0.97`, `0.92`, `0.85`, `0.77`, `0.69`, `0.62`, `0.55`, `0.48`, `0.40`, `0.32`, 接近 Material 调色板的 50 至 900 色号; 其他数量的色阶在 `0.97` 与 `0.32` 之间均匀分布. 亮度离原色越远, 彩度越低, 因此浅色阶接近淡色.

```js
colors.tones('#2196F3').map(c => colors.toHex(c));
/* [ "#EEF6FF", "#D1E8FF", "#A6D3FF", "#73BAFF", "#3DA0F7", "#0F8AE4", "#0075C5", "#0060A4", "#004A7F", "#00345D" ] */
colors.tones('#2196F3', 3).map(c => colors.toHex(c)); // [ "#EEF6FF", "#1C92EE", "#00345D" ]
```

## [m] derive

### derive(color)

**`6.8.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 主色
- <ins>**returns**</ins> {{ primary: [ColorInt](dataTypes#colorint); accent: [ColorInt](dataTypes#colorint); dark: [ColorInt](dataTypes#colorint) }} - 主色, 强调色与深色

由主色推导强调色与深色, 结果与 AutoJs6 主题色设置 "派生配色" 为 "自动" 时一致. 三个颜色均为不透明颜色:

- `primary`: 主色, 即去除 A (alpha) 分量的 `color`.
- `accent`: 强调色, 与主色同色相且彩度更高, 与 AutoJs6 日间及夜间窗口背景 (`#FAFAFA` 与 `#212121`) 的对比度均不低于 `3`; 无法同时满足时, 取两者中较低对比度最高的颜色.
- `dark`: 深色, 与主色同色相, OKLCH 亮度降低 `0.08`, 接近 Material 调色板中 500 与 700 色号的差距.

```js
let { primary, accent, dark } = colors.derive('#2196F3');
colors.toHex(accent); // "#0095F9"
colors.toHex(dark); // "#007DD2"
```

## [m] nightVariant

### nightVariant(color)

**`6.8.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 日间颜色
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) } - 夜间对应色

获取日间颜色在夜间的对应色: OKLCH 亮度收拢到约 `[0.25..0.5]` 且不会比原色更亮, 浅色会提高彩度以保持色相可辨. 结果为不透明颜色.

```js
colors.toHex(colors.nightVariant('#E0F2F1')); /* "#196D6B", 接近 Material 调色板的 Teal 800 (#00695C). */
colors.toHex(colors.nightVariant('#2196F3')); // "#004E86"
colors.toHex(colors.nightVariant('#1A237E')); /* "#1A237E", 已足够深, 保持不变. */
```

## [m] simulate

### simulate(color, deficiency)

**`6.8.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- **deficiency** { `'protanopia'` | `'deuteranopia'` | `'tritanopia'` } - 色觉缺陷类型
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) } - 色觉缺陷者看到的颜色

模拟颜色在色觉缺陷下呈现的样子, 结果保留原 A (alpha) 分量. 模拟采用 [Machado, Oliveira 与 Fernandes (2009)](https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html) 的完全缺失程度矩阵.

| deficiency     | 名称  | 说明         |
|----------------|-----|------------|
| `protanopia`   | 红色盲 | 缺少感知红光的 L 视锥 |
| `deuteranopia` | 绿色盲 | 缺少感知绿光的 M 视锥 |
| `tritanopia`   | 蓝色盲 | 缺少感知蓝光的 S 视锥 |

可用于检查配色对色觉缺陷者是否仍可区分:

```js
colors.toHex(colors.simulate('#FF0000', 'protanopia')); // "#6D5F00"
colors.toHex(colors.simulate('#FF0000', 'deuteranopia')); // "#A39000"

/* 红色与绿色在绿色盲下的感知距离, 远小于正常色觉下的距离. */
colors.distance(colors.simulate('red', 'deuteranopia'), colors.simulate('green', 'deuteranopia'), 'oklab');
colors.distance('red', 'green', 'oklab');
```

## [m] extract

### extract(image, options?)

**`6.8.0`**

- **image** { [ImageWrapper](imageWrapperType) } - 图像
- **[ options ]** {{
    - [ count = `5` ]?: [IntRange[1..16]](dataTypes#intrange) - 颜色数量上限;
    - region?: [number](dataTypes#number)[] | [AndroidRect](androidRectType) | [OpenCVRect](opencvRectType) - 提取区域, 与 [images.findColor](image#m-images-findcolor-image-color-options) 的 `region` 选项相同, 默认为整个图像;
    - step?: [number](dataTypes#number) - 采样间隔, 横向与纵向每隔 `step` 个像素采样一次, 须为正整数, 默认取值使采样数约为 65536;
- }} - 选项参数
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint)[] } - 主要颜色, 按占比降序排列

提取图像中的主要颜色. 先以 Wu 色彩量化算法初步划分颜色, 再在 OKLab 色彩空间中以加权 k-means 细化, 每个结果为一组相近像素的平均色.

- 结果按像素占比降序排列, 数量可能少于 `count`, 如图像中的颜色种类较少时.
- A (alpha) 分量低于 `128` 的像素被忽略.
- 与 [images](image) 模块的多数方法不同, `image` 只接受 [ImageWrapper](imageWrapperType), 不接受图片路径.
- 若 `image` 已通过 [oneShot](imageWrapperType#m-oneshot) 标记为一次性对象, 调用结束后自动回收.

```js
let img = images.read('./picture.png');
colors.extract(img).map(c => colors.toHex(c)); /* 至多 5 个主要颜色. */
colors.extract(img, { count: 3, region: [ 0, 0, 200, 200 ] }); /* 左上角区域的至多 3 个主要颜色. */
img.recycle();

/* 以截图的主要颜色作为主题色. */
images.requestScreenCapture();
let [ dominant ] = colors.extract(images.captureScreen(), { count: 1 });
colors.theme.set(dominant);
```

## [m] toColorStateList

### toColorStateList(...color)

**`6.2.0`**

- **color** { [...](documentation#可变参数)[OmniColor](omniTypes#omnicolor)[[]](documentation#可变参数) } - 颜色参数
- <ins>**returns**</ins> { [android.content.res.ColorStateList](https://developer.android.com/reference/android/content/res/ColorStateList) }

将一个或多个颜色参数转换为 ColorStateList 实例.

```js
colors.toColorStateList('red'); /* 包含单一颜色的 ColorStateList. */
colors.toColorStateList('red', 'green', 'orange'); /* 包含多个颜色的 ColorStateList. */
```

## [m] setPaintColor

### setPaintColor(paint, color)

**`6.2.0`**

- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 画笔参数
- **color** { [OmniColor](omniTypes#omnicolor) } - 颜色参数
- <ins>**returns**</ins> { [void](dataTypes#void) }

方法 `setPaintColor` 用于解决在 `Android API 29 (10) [Q]` 及以上系统中 `Paint#setColor(color)` 无法正常设置画笔颜色的问题.

```js
let paint = new android.graphics.Paint();

/* 安卓 10 及以上系统无法正常设置颜色. */
// paint.setColor(colors.toInt('blue'));

/* 使用 colors 模块实现原始功能. */
colors.setPaintColor(paint, 'blue');
```

画笔无法正常设置颜色的原因, 是 `Android API 29 (10) [Q]` 源码中 `setColor` 有以下两种方法签名:

```text
setColor(@ColorInt int color): void
setColor(@ColorLong long color): void
```

JavaScript 语言不区分 `int` 和 `long`, 即只有 `setColor(color: number)`,<br>
它会优先匹配 Java 的 `setColor(@ColorLong long color): void`.

`ColorLong` 颜色与 `ColorInt` 颜色不同在于, 前者包含了额外的 `ColorSpace` (颜色空间) 信息,<br>
原有的 `ColorInt` 被当做 `ColorLong` 来解析, 导致颜色解析异常.

除上述 `colors.setPaintColor` 的方法外, 还有其他一些解决方案:

```js
/* A. 使用 paint.setArgb 方法. */
paint.setARGB(
    colors.alpha(color),
    colors.red(color),
    colors.green(color),
    colors.blue(color),
);

/* 同上, 语法更简洁. */
paint.setARGB.apply(paint, colors.toArgb(color));

/* B. 将 ColorInt "打包" 为 ColorLong. */
paint.setColor(android.graphics.Color.pack(colors.toInt(color)));

/* C. 直接使用带 ColorSpace 信息的 ColorLong. */
paint.setColor(android.graphics.Color.pack(
    colors.redDouble(color),
    colors.greenDouble(color),
    colors.blueDouble(color),
    colors.alphaDouble(color),
    android.graphics.ColorSpace.get(android.graphics.ColorSpace.Named.SRGB),
));
```

`colors.setPaintColor` 的大致源码:

```js
function setPaintColor(paint, color) {
    if (util.version.sdkInt >= util.versionCodes.Q) {
        paint.setARGB.apply(paint, colors.toArgb(color));
    } else {
        paint.setColor(colors.toInt(color));
    }
}
```

## [p+] theme

**`6.8.0`**

- { [object](dataTypes#object) } - 主题色控制对象

用于读取和修改 AutoJs6 的主题色, 以及控制智能颜色库. [colors.themeColor](#p-themecolor) 只提供当前的主题颜色实例, 而 `colors.theme` 可以修改主题色.

脚本修改主题色时遵循以下规则:

- [theme.set](#m-themeset) 与 [theme.reset](#m-themereset) 相当于在主题色页面中选择颜色: 若有激活的智能颜色库, 该库会停用.
- 500 毫秒内的多次修改只有最后一次生效. 主题色历史只记录一条, 并标注来源 "脚本: 脚本名称".
- 脚本修改主题色后, 主题色页面的菜单提供 "撤销脚本修改", 可恢复脚本第一次修改之前的选择, 包括当时激活的智能颜色库. 之后若手动选择颜色或激活智能颜色库, 撤销记录将被丢弃.

智能颜色库中与脚本相关的设置:

- 状态源 "脚本状态": 填写 2 至 8 个状态名称 (默认为 `idle` 与 `busy`), 每个名称至多 32 个字符, 脚本通过 [theme.state](#m-themestate) 切换当前状态.
- 换组时机 "脚本启动": 每当有脚本启动时换组, 同时启动的多个脚本只换组一次.

## [m] theme.get

### theme.get()

**`6.8.0`**

- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) } - 主题色的主色

获取主题色的主色. 若 500 毫秒合并窗口中有尚未生效的脚本颜色, 则返回该颜色, 因此调用 [theme.set](#m-themeset) 后可立即读取到新颜色.

```js
colors.theme.set('#2196F3');
colors.toHex(colors.theme.get()); // "#2196F3"
```

## [m] theme.set

### theme.set(color, options?)

**`6.8.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 主色, 忽略 A (alpha) 分量
- **[ options ]** {{
    - accent?: [OmniColor](omniTypes#omnicolor) - 强调色, 用于悬浮按钮等;
    - dark?: [OmniColor](omniTypes#omnicolor) - 深色, 用于状态栏等;
- }} - 选项参数
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置主题色.

未指定强调色或深色时, 由主题色设置 "派生配色" 决定: 设为 "自动" 时由主色推导 (与 [colors.derive](#m-derive) 一致), 否则与主色相同.

```js
colors.theme.set('#2196F3');
colors.theme.set('#2196F3', { accent: '#FF9800' }); /* 指定强调色, 深色仍按 "派生配色" 设置决定. */
```

## [m] theme.reset

### theme.reset()

**`6.8.0`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

将主题色设置为 AutoJs6 的默认主题色 `#FFDEAD`. 与 [theme.set](#m-themeset) 相同, 此修改计入合并窗口, 主题色历史及 "撤销脚本修改".

## [m] theme.libraries

### theme.libraries()

**`6.8.0`**

- <ins>**returns**</ins> {{
    - id: [number](dataTypes#number) - 颜色库 id;
    - name: [string](dataTypes#string) - 颜色库名称, 预设库的名称随应用语言变化;
    - kind: `'preset'` | `'created'` | `'imported'` | `'cloned'` - 来源, 分别为预设, 新建, 导入与克隆;
    - intelligent: [boolean](dataTypes#boolean) - 是否为智能颜色库;
    - size: [number](dataTypes#number) - 普通颜色库的颜色数量, 或智能颜色库的组数量;
- }}[] - 颜色库摘要数组

获取全部颜色库的摘要, 依次为预设的普通颜色库, 预设的智能颜色库, 用户的普通颜色库与用户的智能颜色库.

```js
colors.theme.libraries()
    .filter(lib => lib.intelligent)
    .forEach(lib => console.log(`${lib.id}: ${lib.name} (${lib.size} 组)`));
```

## [m] theme.activate

### theme.activate(libraryId, options?)

**`6.8.0`**

- **libraryId** { [number](dataTypes#number) } - 智能颜色库 id, 可由 [theme.libraries](#m-themelibraries) 获取
- **[ options ]** {{
    - group?: [number](dataTypes#number) - 起始组 id;
- }} - 选项参数
- <ins>**returns**</ins> { [void](dataTypes#void) }

激活智能颜色库, 效果与在主题色页面中激活该库相同.

- 只接受智能颜色库. id 不存在或不是智能颜色库时抛出异常.
- `group` 须为该库中已启用且含有颜色的组, 否则抛出异常. 当前组的 id 可由 [theme.current](#m-themecurrent) 的 `groupId` 获取.
- 激活智能颜色库不属于可撤销的脚本修改, 且会丢弃已有的撤销记录.

```js
let lib = colors.theme.libraries().find(lib => lib.intelligent);
colors.theme.activate(lib.id);
```

## [m] theme.deactivate

### theme.deactivate()

**`6.8.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否停用了智能颜色库

停用当前激活的智能颜色库. 主题色保持当前颜色, 主题色页面中的选择转为调色板颜色. 没有激活的智能颜色库时返回 `false`.

## [m] theme.next

### theme.next()

**`6.8.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否存在激活的智能颜色库

让激活的智能颜色库立即换到下一组, 无需勾选换组时机 "脚本启动". 没有激活的智能颜色库时返回 `false`.

主题色相关页面打开期间, 智能颜色库暂停变化, 此时调用不会换组.

## [m] theme.state

### theme.state(name)

**`6.8.0`**

- **name** { [string](dataTypes#string) } - 状态名称
- <ins>**returns**</ins> { [void](dataTypes#void) }

切换激活的智能颜色库的当前状态, 智能颜色库随即按该状态选择颜色. 当前状态会被保存, 应用重启后保持不变.

以下情况抛出异常:

- 没有激活的智能颜色库, 或其状态源不是 "脚本状态".
- `name` 不在该库的状态名称中.

```js
/* 智能颜色库的状态源为 "脚本状态", 状态名称为 idle 与 busy. */
colors.theme.state('busy');
try {
    /* 执行耗时任务. */
} finally {
    colors.theme.state('idle');
}
```

## [m] theme.current

### theme.current()

**`6.8.0`**

- <ins>**returns**</ins> {{
    - libraryId: [number](dataTypes#number) - 当前颜色所属颜色库的 id;
    - libraryName: [string](dataTypes#string) | [null](dataTypes#null) - 颜色库名称;
    - intelligent: [boolean](dataTypes#boolean) - 是否来自激活的智能颜色库;
    - groupId: [number](dataTypes#number) | [null](dataTypes#null) - 智能颜色库的当前组 id, 其他情况为 `null`;
    - groupName: [string](dataTypes#string) | [null](dataTypes#null) - 智能颜色库的当前组名称, 或普通颜色库中颜色的名称;
    - state: [string](dataTypes#string) | [null](dataTypes#null) - 智能颜色库的当前状态, 状态源为 "脚本状态" 时为状态名称, 其他状态源为内部状态键 (如 `default`), 不是智能颜色库时为 `null`;
    - color: [ColorInt](dataTypes#colorint) - 主色;
    - accent: [ColorInt](dataTypes#colorint) - 强调色;
    - dark: [ColorInt](dataTypes#colorint) - 深色;
    - summary: [string](dataTypes#string) - 与主题色页面一致的摘要文本;
- }} - 当前主题色及其来源

获取当前主题色及其来源.

```js
let current = colors.theme.current();
console.log(current.summary);
if (current.intelligent) {
    console.log(`${current.libraryName}: ${current.groupName}`);
}
```

## [p+] android

**`6.2.0`**

[Android 颜色列表](colorTable#Android-颜色列表) 对象.

## [p+] css

**`6.2.0`**

[Css 颜色列表](colorTable#CSS-颜色列表) 对象.

## [p+] web

**`6.2.0`**

[Web 颜色列表](colorTable#WEB-颜色列表) 对象.

## [p+] material

**`6.2.0`**

[Material 颜色列表](colorTable#Material-颜色列表) 对象.

## [p] BLACK

**`CONSTANT`**

- [ `-16777216` ] { [number](dataTypes#number) }

<span style="color: #000000">◑</span> 黑 (`#000000` `rgb(0,0,0`) 的颜色整数.

## [p] BLUE

**`CONSTANT`**

- [ `-16776961` ] { [number](dataTypes#number) }

<span style="color: #0000FF">◑</span> 蓝 (`#0000FF` `rgb(0,0,255`) 的颜色整数.

## [p] CYAN

**`CONSTANT`**

- [ `-16711681` ] { [number](dataTypes#number) }

<span style="color: #00FFFF">◑</span> 青 (`#00FFFF` `rgb(0,255,255`) 的颜色整数.

## [p] AQUA

**`6.2.0`** **`CONSTANT`**

- [ `-16711681` ] { [number](dataTypes#number) }

<span style="color: #00FFFF">◑</span> 青 (`#00FFFF` `rgb(0,255,255`) 的颜色整数.

## [p] DARK_GRAY

**`6.2.0`** **`CONSTANT`**

- [ `-12303292` ] { [number](dataTypes#number) }

<span style="color: #444444">◑</span> 暗灰 (`#444444` `rgb(68,68,68`) 的颜色整数.

## [p] DARK_GREY

**`6.2.0`** **`CONSTANT`**

- [ `-12303292` ] { [number](dataTypes#number) }

<span style="color: #444444">◑</span> 暗灰 (`#444444` `rgb(68,68,68`) 的颜色整数.

## [p] DKGRAY

**`CONSTANT`**

- [ `-12303292` ] { [number](dataTypes#number) }

<span style="color: #444444">◑</span> 暗灰 (`#444444` `rgb(68,68,68`) 的颜色整数.

## [p] GRAY

**`CONSTANT`**

- [ `-7829368` ] { [number](dataTypes#number) }

<span style="color: #888888">◑</span> 灰 (`#888888` `rgb(136,136,136`) 的颜色整数.

## [p] GREY

**`6.2.0`** **`CONSTANT`**

- [ `-7829368` ] { [number](dataTypes#number) }

<span style="color: #888888">◑</span> 灰 (`#888888` `rgb(136,136,136`) 的颜色整数.

## [p] GREEN

**`CONSTANT`**

- [ `-16711936` ] { [number](dataTypes#number) }

<span style="color: #00FF00">◑</span> 绿 (`#00FF00` `rgb(0,255,0`) 的颜色整数.

## [p] LIME

**`6.2.0`** **`CONSTANT`**

- [ `-16711936` ] { [number](dataTypes#number) }

<span style="color: #00FF00">◑</span> 绿 (`#00FF00` `rgb(0,255,0`) 的颜色整数.

## [p] LIGHT_GRAY

**`6.2.0`** **`CONSTANT`**

- [ `-3355444` ] { [number](dataTypes#number) }

<span style="color: #CCCCCC">◑</span> 亮灰 (`#CCCCCC` `rgb(204,204,204`) 的颜色整数.

## [p] LIGHT_GREY

**`6.2.0`** **`CONSTANT`**

- [ `-3355444` ] { [number](dataTypes#number) }

<span style="color: #CCCCCC">◑</span> 亮灰 (`#CCCCCC` `rgb(204,204,204`) 的颜色整数.

## [p] LTGRAY

**`CONSTANT`**

- [ `-3355444` ] { [number](dataTypes#number) }

<span style="color: #CCCCCC">◑</span> 亮灰 (`#CCCCCC` `rgb(204,204,204`) 的颜色整数.

## [p] MAGENTA

**`CONSTANT`**

- [ `-65281` ] { [number](dataTypes#number) }

<span style="color: #FF00FF">◑</span> 品红 / 洋红 (`#FF00FF` `rgb(255,0,255`) 的颜色整数.

## [p] FUCHSIA

**`6.2.0`** **`CONSTANT`**

- [ `-65281` ] { [number](dataTypes#number) }

<span style="color: #FF00FF">◑</span> 品红 / 洋红 (`#FF00FF` `rgb(255,0,255`) 的颜色整数.

## [p] MAROON

**`6.2.0`** **`CONSTANT`**

- [ `-8388608` ] { [number](dataTypes#number) }

<span style="color: #800000">◑</span> 栗 (`#800000` `rgb(128,0,0`) 的颜色整数.

## [p] NAVY

**`6.2.0`** **`CONSTANT`**

- [ `-16777088` ] { [number](dataTypes#number) }

<span style="color: #000080">◑</span> 海军蓝 / 藏青 (`#000080` `rgb(0,0,128`) 的颜色整数.

## [p] OLIVE

**`6.2.0`** **`CONSTANT`**

- [ `-8355840` ] { [number](dataTypes#number) }

<span style="color: #808000">◑</span> 橄榄 (`#808000` `rgb(128,128,0`) 的颜色整数.

## [p] PURPLE

**`6.2.0`** **`CONSTANT`**

- [ `-8388480` ] { [number](dataTypes#number) }

<span style="color: #800080">◑</span> 紫 (`#800080` `rgb(128,0,128`) 的颜色整数.

## [p] RED

**`CONSTANT`**

- [ `-65536` ] { [number](dataTypes#number) }

<span style="color: #FF0000">◑</span> 红 (`#FF0000` `rgb(255,0,0`) 的颜色整数.

## [p] SILVER

**`6.2.0`** **`CONSTANT`**

- [ `-4144960` ] { [number](dataTypes#number) }

<span style="color: #C0C0C0">◑</span> 银 (`#C0C0C0` `rgb(192,192,192`) 的颜色整数.

## [p] TEAL

**`6.2.0`** **`CONSTANT`**

- [ `-16744320` ] { [number](dataTypes#number) }

<span style="color: #008080">◑</span> 鸭绿 / 凫绿 (`#008080` `rgb(0,128,128`) 的颜色整数.

## [p] WHITE

**`CONSTANT`**

- [ `-1` ] { [number](dataTypes#number) }

<span style="color: #FFFFFF">◑</span> 白 (`#FFFFFF` `rgb(255,255,255`) 的颜色整数.

## [p] YELLOW

**`CONSTANT`**

- [ `-256` ] { [number](dataTypes#number) }

<span style="color: #FFFF00">◑</span> 黄 (`#FFFF00` `rgb(255,255,0)`) 的颜色整数.

## [p] ORANGE

**`6.2.0`** **`CONSTANT`**

- [ `-23296` ] { [number](dataTypes#number) }

<span style="color: #FFA500">◑</span> 橙 (`#FFA500` `rgb(255,165,0)`) 的颜色整数.

## [p] TRANSPARENT

**`CONSTANT`**

- [ `0` ] { [number](dataTypes#number) }

全透明 (`#00000000` `argb(0, 0, 0, 0)`) 的颜色整数.

---

## 融合颜色

为节约篇幅, 本章节仅列出了常用的部分融合颜色, 融合颜色属性直接挂载于 colors 对象上, 使用 `colors.Xxx` 的形式访问:

```js
colors.toHex(colors.BLACK); /* 黑色. */
colors.toHex(colors.ORANGE); /* 橙色. */
colors.toHex(colors.PANSY); /* 三色堇紫色. */
colors.toHex(colors.ALIZARIN_CRIMSON); /* 茜红色. */
colors.toHex(colors.PURPLE_300); /* 材料紫色 (300 号). */
```

更多融合颜色, 参阅 [融合颜色列表](colorTable#融合颜色列表) 小节.
