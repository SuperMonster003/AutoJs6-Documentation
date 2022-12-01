# 颜色 (Colors)

---

<p style="font: italic 1em sans-serif; color: #78909C">此章节待补充或完善...</p>
<p style="font: italic 1em sans-serif; color: #78909C">Marked by SuperMonster003 on Oct 22, 2022.</p>

---

在Auto.js有两种方式表示一个颜色.

一种是使用一个字符串"#AARRGGBB"或"#RRGGBB", 其中 AA 是Alpha通道(透明度)的值, RR 是R通道(红色)的值, GG 是G通道(绿色)的值, BB是B通道(蓝色)的值. 例如"#ffffff"表示白色, "#7F000000"表示半透明的黑色.

另一种是使用一个16进制的"32位整数" 0xAARRGGBB 来表示一个颜色, 例如 `0xFF112233`表示颜色"#112233", `0x11223344`表示颜色"#11223344".

可以通过`colors.toString()`把颜色整数转换为字符串, 通过`colors.parseColor()`把颜色字符串解析为颜色整数.

## colors.toString(color)

* `color` {number} 整数RGB颜色值
* 返回 {string}

返回颜色值的字符串, 格式为 "#AARRGGBB".

## colors.red(color)

* `color` {number} | {string} 颜色值
* 返回 {number}

返回颜色color的R通道的值, 范围0~255.

## colors.green(color)

* `color` {number} | {string} 颜色值
* 返回 {number}

返回颜色color的G通道的值, 范围0~255.

## colors.blue(color)

* `color` {number} | {string} 颜色值
* 返回 {number}

返回颜色color的B通道的值, 范围0~255.

## colors.alpha(color)

* `color` {number} | {string} 颜色值
* 返回 {number}

返回颜色color的Alpha通道的值, 范围0~255.

## colors.rgb(red, green, blue)

* red {number} 颜色的R通道的值
* blue {number} 颜色的G通道的值
* green {number} 颜色的B通道的值
* 返回 {number}

返回这些颜色通道构成的整数颜色值. Alpha通道将是255（不透明）.

## colors.argb(alpha, red, green, blue)

* `alpha` {number} 颜色的Alpha通道的值
* `red` {number} 颜色的R通道的值
* `green` {number} 颜色的G通道的值
* `blue` {number} 颜色的B通道的值
* 返回 {number}

返回这些颜色通道构成的整数颜色值.

## colors.parseColor(colorStr)

* `colorStr` {string} 表示颜色的字符串, 例如"#112233"
* 返回 {number}

返回颜色的整数值.

## colors.isSimilar(color2, color2[, threshold, algorithm])

* `color1` {number} | {string} 颜色值1
* `color1` {number} | {string} 颜色值2
* `threshold` {number} 颜色相似度临界值, 默认为4. 取值范围为0~255. 这个值越大表示允许的相似程度越小, 如果这个值为0, 则两个颜色相等时该函数才会返回true.
* `algorithm` {string} 颜色匹配算法, 默认为"diff", 包括:
    * "diff": 差值匹配. 与给定颜色的R、G、B差的绝对值之和小于threshold时匹配.
    * "rgb": rgb欧拉距离相似度. 与给定颜色color的rgb欧拉距离小于等于threshold时匹配.
    * "rgb+": 加权rgb欧拉距离匹配([LAB Delta E](https://en.wikipedia.org/wiki/Color_difference/)).
    * "hs": hs欧拉距离匹配. hs为HSV空间的色调值.
* 返回 {Boolean}

返回两个颜色是否相似.

## colors.equals(color1, color2)

* `color1` {number} | {string} 颜色值1
* `color1` {number} | {string} 颜色值2
* 返回 {Boolean}

返回两个颜色是否相等. **注意该函数会忽略Alpha通道的值进行比较*.

```
log(colors.equals("#112233", "#112234"));
log(colors.equals(0xFF112233, 0xFF223344));
```

# colors.BLACK

黑色, 颜色值 #FF000000

# colors.DKGRAY

深灰色, 颜色值 #FF444444

# colors.GRAY

灰色, 颜色值 #FF888888

# colors.LTGRAY

亮灰色, 颜色值 #FFCCCCCC

# colors.WHITE

白色, 颜色值 #FFFFFFFF

# colors.RED

红色, 颜色值 #FFFF0000

# colors.GREEN

绿色, 颜色值 #FF00FF00

# colors.BLUE

蓝色, 颜色值 #FF0000FF

# colors.YELLOW

黄色, 颜色值 #FFFFFF00

# colors.CYAN

青色, 颜色值 #FF00FFFF

# colors.MAGENTA

品红色, 颜色值 #FFFF00FF

# colors.TRANSPARENT

透明, 颜色值 #00000000