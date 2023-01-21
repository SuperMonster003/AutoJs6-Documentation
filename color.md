# 颜色 (Colors)

---

<p style="font: italic 1em sans-serif; color: #78909C">此章节待补充或完善...</p>
<p style="font: italic 1em sans-serif; color: #78909C">Marked by SuperMonster003 on Jan 21, 2023.</p>

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
        - [colors.toInt](#m-toint) (如 `colors.toInt('#FF0000')` 表示红色对应的颜色整数, 结果为 `-65536`)
        - ... ...
    - 常量
        - [colors.RED](#p-red) ([Android 颜色列表](colorTable#Android-颜色列表) 的红色颜色整数)
        - [colors.BLACK](#p-black) ([Android 颜色列表](colorTable#Android-颜色列表) 的黑色颜色整数)
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
- [颜色分量数组 (ColorComponents)](dataTypes.md#colorcomponents)
    - 方法
        - [colors.toRgb](#m-torgb) (颜色分量数组 `[R,G,B]`)
        - [colors.toRgba](#m-torgba) (颜色分量数组 `[R,G,B,A]`)
        - [colors.toArgb](#m-toargb) (颜色分量数组 `[A,R,G,B]`)
        - [colors.toHsv](#m-tohsv) (颜色分量数组 `[H,S,V]`)
        - [colors.toHsva](#m-tohsva) (颜色分量数组 `[H,S,V,A]`)
        - [colors.toHsl](#m-tohsl) (颜色分量数组 `[H,S,L]`)
        - [colors.toHsla](#m-tohsla) (颜色分量数组 `[H,S,L,A]`)
        - ... ...
- [颜色名称 (ColorName)](dataTypes#colorname)
    - 常量
        - "red" (红色)
        - "black" (黑色)
        - ... ...

---

<p style="font: bold 2em sans-serif; color: #FF7043">colors</p>

---

## [m] toInt

### toInt(color)

- **color** { [ColorHex](dataTypes#colorhex) | [ColorInt](dataTypes#colorint) | [ColorName](dataTypes#colorname) } - 颜色参数
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

- **color** { [ColorHex](dataTypes#colorhex) | [ColorInt](dataTypes#colorint) | [ColorName](dataTypes#colorname) } - 颜色参数
- <ins>**returns**</ins> { [ColorHex](dataTypes#colorhex) } - 颜色代码

将颜色参数转换为 [颜色代码 (ColorHex)](dataTypes#colorhex).

```js
/* ColorHex - 颜色代码. */
colors.toHex('#CC5500'); // #CC5500
colors.toHex('#C50'); // #CC5500
colors.toHex('#FFCC5500'); // #CC5500

/* ColorInt - 颜色整数. */
colors.toHex(0xFFCC5500); // #CC5500
colors.toHex(colors.web.BURNT_ORANGE); // #CC5500

/* ColorName - 颜色名称. */
colors.toHex('BURNT_ORANGE'); // #CC5500
colors.toHex('burnt-orange'); // #CC5500
```

当 `A (alpha)` 分量为 `100% (255/255;100/100)` 时, `FF` 会自动省略,  
如 `#FFC0C0C0` 将自动转换为 `#C0C0C0`, 此方法相当于 `toHex(color, 'auto')`.

### toHex(color, alpha)

**`6.2.0`** **`Overload 2/3`**

- **color** { [ColorHex](dataTypes#colorhex) | [ColorInt](dataTypes#colorint) | [ColorName](dataTypes#colorname) } - 颜色参数
- **[alpha = 'auto']** { [boolean](dataTypes#boolean) | `'keep'` | `'none'` | `'auto'` } - A (alpha) 分量参数
- <ins>**returns**</ins> { [ColorHex](dataTypes#colorhex) } - 颜色代码

将颜色参数转换为 [颜色代码 (ColorHex)](dataTypes#colorhex), 并根据 `alpha` 参数决定颜色代码 `A (alpha)` 分量的显示状态.

`A (alpha)` 分量参数取值表:

| 取值             | 含义                          | 默认  |
|----------------|-----------------------------|:---:|
| 'keep' / true  | 强制显示 A 分量, 不论 A 分量是否为 0xFF  |     |      
| 'none' / false | 强制去除 A 分量, 只保留 R / G / B 分量 |     |      
| 'auto'         | 根据 A 分量是否为 0xFF 自动决定显示状态    |  √  |

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

- **color** { [ColorHex](dataTypes#colorhex) | [ColorInt](dataTypes#colorint) | [ColorName](dataTypes#colorname) } - 颜色参数
- **length** { `8` | `6` | `3` } - Hex 代码长度参数
- <ins>**returns**</ins> { [ColorHex](dataTypes#colorhex) } - 颜色代码

将颜色参数转换为 [颜色代码 (ColorHex)](dataTypes#colorhex), 并根据 `length` 参数决定颜色代码的显示状态.

Hex 代码长度参数取值表:

| 取值  | 含义                         |
|:---:|----------------------------|
|  8  | 强制显示 A 分量, 结果格式为 #AARRGGBB |        
|  6  | 强制去除 A 分量, 结果格式为 #RRGGBB   |        
|  3  | 强制去除 A 分量, 结果格式为 #RGB      |  

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

- **color** { [ColorHex](dataTypes#colorhex) | [ColorInt](dataTypes#colorint) | [ColorName](dataTypes#colorname) } - 颜色参数
- <ins>**returns**</ins> { [ColorHex](dataTypes#colorhex) } - 颜色代码的完整形式

将颜色参数强制转换为 [颜色代码 (ColorHex)](dataTypes#colorhex) 的完整形式 (#AARRGGBB).

此方法为 [colors.toHex(color, 8)](#tohexcolor-length) 的别名方法.

```js
colors.toHex('#CC5500'); // #CC5500
colors.toFullHex('#CC5500'); // #FFCC5500
```

## [m] parseColor

### parseColor(color)

- **color** { [string](dataTypes#string) } - 颜色参数
- <ins>**returns**</ins> { [number](dataTypes#number) } - 颜色整数

将颜色参数转换为 [颜色整数 (ColorInt)](dataTypes#colorint).

类似 [toInt](#m-toint), 但参数接受范围相对狭小且类型及数值要求更加严格.    
parseColor 的颜色参数仅支持六位数及八位数颜色代码及部分颜色名称.  

支持的颜色名称 (不区分大小写): 
> 'aqua', 'black', 'blue', 'cyan', 'darkgray', 'darkgrey',
> 
> 'fuchsia', 'gray', 'green', 'grey', 'lightgray',
> 
> 'lightgrey', 'lime', 'magenta', 'maroon', 'navy', 'olive',
> 
> 'purple', 'red', 'silver', 'teal', 'white', 'yellow'`.  

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

- **color** { [ColorHex](dataTypes#colorhex) | [ColorInt](dataTypes#colorint) | [ColorName](dataTypes#colorname) } - 颜色参数
- <ins>**returns**</ins> { [ColorHex](dataTypes#colorhex) } - 颜色代码

将颜色参数转换为 [颜色代码 (ColorHex)](dataTypes#colorhex).

[toHex(color)](#tohexcolor) 的别名方法.

### toString(color, alpha)

**`6.2.0`** **`Overload 2/3`**

- **color** { [ColorHex](dataTypes#colorhex) | [ColorInt](dataTypes#colorint) | [ColorName](dataTypes#colorname) } - 颜色参数
- **[alpha = 'auto']** { [boolean](dataTypes#boolean) | `'keep'` | `'none'` | `'auto'` } - A (alpha) 分量参数
- <ins>**returns**</ins> { [ColorHex](dataTypes#colorhex) } - 颜色代码

将颜色参数转换为 [颜色代码 (ColorHex)](dataTypes#colorhex), 并根据 `alpha` 参数决定颜色代码 `A (alpha)` 分量的显示状态.

[toHex(color, alpha)](#tohexcolor-alpha) 的别名方法.

### toString(color, length)

**`6.2.0`** **`Overload 3/3`**

- **color** { [ColorHex](dataTypes#colorhex) | [ColorInt](dataTypes#colorint) | [ColorName](dataTypes#colorname) } - 颜色参数
- **length** { `8` | `6` | `3` } - Hex 代码长度参数
- <ins>**returns**</ins> { [ColorHex](dataTypes#colorhex) } - 颜色代码

将颜色参数转换为 [颜色代码 (ColorHex)](dataTypes#colorhex), 并根据 `length` 参数决定颜色代码的显示状态.

[toHex(color, length)](#tohexcolor-length) 的别名方法.

## [m] alpha

### alpha(color)

- **color** { [ColorHex](dataTypes#colorhex) | [ColorInt](dataTypes#colorint) | [ColorName](dataTypes#colorname) } - 颜色参数
- <ins>**returns**</ins> { [IntRange[0..255]](dataTypes#intrange) }

获取颜色的 `A (alpha)` 分量, 取值范围 `[0..255]`.

```js
colors.alpha('#663399'); // 255
colors.alpha(colors.TRANSPARENT); // 0
colors.alpha('#05060708'); // 5
```

## [m] alphaDouble

### alphaDouble(color)

- **color** { [ColorHex](dataTypes#colorhex) | [ColorInt](dataTypes#colorint) | [ColorName](dataTypes#colorname) } - 颜色参数
- <ins>**returns**</ins> { [Range[0..1]](dataTypes#range) }

获取颜色的 `A (alpha)` 分量, 取值范围 `[0..1]`.

```js
colors.alphaDouble('#663399'); // 1
colors.alphaDouble(colors.TRANSPARENT); // 0
colors.alphaDouble('#05060708'); // 0.0196078431372549
```

## [m] red

### red(color)

- **color** { [ColorHex](dataTypes#colorhex) | [ColorInt](dataTypes#colorint) | [ColorName](dataTypes#colorname) } - 颜色参数
- <ins>**returns**</ins> { [IntRange[0..255]](dataTypes#intrange) }

获取颜色的 `R (red)` 分量, 取值范围 `[0..255]`.

```js
colors.red('#663399'); // 102
colors.red(colors.TRANSPARENT); // 0
colors.red('#05060708'); // 6
```

## [m] green

### green(color)

- **color** { [ColorHex](dataTypes#colorhex) | [ColorInt](dataTypes#colorint) | [ColorName](dataTypes#colorname) } - 颜色参数
- <ins>**returns**</ins> { [IntRange[0..255]](dataTypes#intrange) }

获取颜色的 `G (green)` 分量, 取值范围 `[0..255]`.

```js
colors.green('#663399'); // 51
colors.green(colors.TRANSPARENT); // 0
colors.green('#05060708'); // 7
```

## [m] blue

### blue(color)

- **color** { [ColorHex](dataTypes#colorhex) | [ColorInt](dataTypes#colorint) | [ColorName](dataTypes#colorname) } - 颜色参数
- <ins>**returns**</ins> { [IntRange[0..255]](dataTypes#intrange) }

获取颜色的 `B (blue)` 分量, 取值范围 `[0..255]`.

```js
colors.blue('#663399'); // 153
colors.blue(colors.TRANSPARENT); // 0
colors.blue('#05060708'); // 8
```

## [m] rgb

### rgb(color)

**`[6.2.0]`** **`Overload 1/3`**

- **color** { [ColorHex](dataTypes#colorhex) | [ColorInt](dataTypes#colorint) | [ColorName](dataTypes#colorname) } - 颜色参数
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

### argb(color)

**`[6.2.0]`** **`Overload 1/3`**

- **color** { [ColorHex](dataTypes#colorhex) | [ColorInt](dataTypes#colorint) | [ColorName](dataTypes#colorname) } - 颜色参数
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

获取 `color` 参数对应的 [颜色整数 (ColorInt)](dataTypes#colorint).

`color` 参数为颜色代码时, 支持情况如下:

| 格式        | 备注                 |
|-----------|--------------------|
| #RRGGBB   | A (alpha) 分量为 0xFF |
| #RGB      | A (alpha) 分量为 0xFF |
| #AARRGGBB | 正常                 |

```js
colors.argb('#663399'); /* 相当于 argb('#FF663399') . */
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

### rgba(color)

**`[6.2.0]`** **`Overload 1/3`**

- **color** { [ColorHex](dataTypes#colorhex) | [ColorInt](dataTypes#colorint) | [ColorName](dataTypes#colorname) } - 颜色参数
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) }

获取 `color` 参数对应的 [颜色整数 (ColorInt)](dataTypes#colorint).

`color` 参数为颜色代码时, 支持情况如下:

| 格式        | 备注                 |
|-----------|--------------------|
| #RRGGBB   | A (alpha) 分量为 0xFF |
| #RGB      | A (alpha) 分量为 0xFF |
| #RRGGBBAA | 正常                 |

```js
colors.rgba('#663399'); /* 相当于 rgba('#663399FF') . */
colors.rgba('#663399FF'); /* 结果同上. */
colors.rgba('#FF663399'); /* 结果不同上. */
```

注意区分 `colors.rgba` 与 `colors.argb`:

```js
colors.rgba('#11335577'); /* A (alpha) 分量为 0x77 . */
colors.argb('#11335577'); /* A (alpha) 分量为 0x11 . */
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

//// -=-= PENDING =-=- ////

## [m] hsl

//// -=-= PENDING =-=- ////

## [m] hsla

//// -=-= PENDING =-=- ////

## [m] toRgb

//// -=-= PENDING =-=- ////

## [m] toRgba

//// -=-= PENDING =-=- ////

## [m] toArgb

//// -=-= PENDING =-=- ////

## [m] toHsv

//// -=-= PENDING =-=- ////

## [m] toHsva

//// -=-= PENDING =-=- ////

## [m] toHsl

//// -=-= PENDING =-=- ////

## [m] toHsla

//// -=-= PENDING =-=- ////

## [m] isSimilar

//// -=-= PENDING =-=- ////

## [m] equals

//// -=-= PENDING =-=- ////

## [m] luminance

//// -=-= PENDING =-=- ////

## [p+] android

//// -=-= PENDING =-=- ////

## [p+] css

//// -=-= PENDING =-=- ////

## [p+] web

//// -=-= PENDING =-=- ////

## [p+] material

//// -=-= PENDING =-=- ////

## [p] BLACK

//// -=-= PENDING =-=- ////

## [p] BLUE

//// -=-= PENDING =-=- ////

## [p] CYAN

//// -=-= PENDING =-=- ////

## [p] AQUA

//// -=-= PENDING =-=- ////

## [p] DARK_GRAY

//// -=-= PENDING =-=- ////

## [p] DARK_GREY

//// -=-= PENDING =-=- ////

## [p] DKGRAY

//// -=-= PENDING =-=- ////

## [p] GRAY

//// -=-= PENDING =-=- ////

## [p] GREY

//// -=-= PENDING =-=- ////

## [p] GREEN

//// -=-= PENDING =-=- ////

## [p] LIME

//// -=-= PENDING =-=- ////

## [p] LIGHT_GRAY

//// -=-= PENDING =-=- ////

## [p] LIGHT_GREY

//// -=-= PENDING =-=- ////

## [p] LTGRAY

//// -=-= PENDING =-=- ////

## [p] MAGENTA

//// -=-= PENDING =-=- ////

## [p] FUCHSIA

//// -=-= PENDING =-=- ////

## [p] MAROON

//// -=-= PENDING =-=- ////

## [p] NAVY

//// -=-= PENDING =-=- ////

## [p] OLIVE

//// -=-= PENDING =-=- ////

## [p] PURPLE

//// -=-= PENDING =-=- ////

## [p] RED

//// -=-= PENDING =-=- ////

## [p] SILVER

//// -=-= PENDING =-=- ////

## [p] TEAL

//// -=-= PENDING =-=- ////

## [p] WHITE

//// -=-= PENDING =-=- ////

## [p] YELLOW

//// -=-= PENDING =-=- ////

## [p] TRANSPARENT

//// -=-= PENDING =-=- ////
