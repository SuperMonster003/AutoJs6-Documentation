# OpenCVSize

[org.opencv.core.Size](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Size.html) 别名.

Size 表示一个长宽尺寸, 作为控件信息时则表示控件矩形在屏幕的控件占用尺寸.

```js
let size = pickup(/.+/, 'size');
console.log(`${size.width}x${size.height}`);
```

常见相关方法或属性:

- [UiObject#size](uiobjectType#m-size)

> 注: 本章节仅列出部分属性或方法.

---

<p style="font: bold 2em sans-serif; color: #FF7043">org.opencv.core.Size</p>

---

## [C] org.opencv.core.Size

### [c] (width, height)

- **width** { [number](dataTypes#number) } - 宽度值
- **height** { [number](dataTypes#number) } - 高度值
- <ins>**returns**</ins> { [org.opencv.core.Size](#c-orgopencvcoresize) }

生成一个尺寸对象.

```js
console.log(new org.opencv.core.Size(100, 200)); // 100x200
```

坐标不会被化为整型:

```js
/* 打印时, 数值会转换为整数. */
console.log(new org.opencv.core.Size(1.8, 3.2)); // 1x3
/* 但获取宽高值时, 依然保留原始值, 不会被化为整型. */
console.log(new org.opencv.core.Size(1.8, 3.2).width); // 1.8
console.log(new org.opencv.core.Size(1.8, 3.2).height); // 3.2
```

### [c] ()

- <ins>**returns**</ins> { [org.opencv.core.Size](#c-orgopencvcoresize) }

生成一个尺寸对象, 并初始化为 `0x0` 宽高尺寸.

```js
console.log(new org.opencv.core.Size()); // 0x0
```

### [c] (point)

- **point** { [OpenCVPoint](opencvPointType) } - 用于表示尺寸的 "点"
- <ins>**returns**</ins> { [org.opencv.core.Size](#c-orgopencvcoresize) }

生成一个尺寸对象, 并按参数初始化宽高尺寸.

```js
const { Size, Point } = org.opencv.core;
console.log(new Size(new Point(5, 23))); // 5x23
```

### [c] (dimensions)

- **dimensions** { [number](dataTypes#number)[[]](dataTypes#array) } - 尺寸值数组
- <ins>**returns**</ins> { [org.opencv.core.Size](#c-orgopencvcoresize) }

生成一个尺寸对象, 并按指定参数初始化宽高尺寸.

两个尺寸值:

```js
console.log(new org.opencv.core.Size([ 5, 23 ])); // 5x23
```

一个尺寸值, 此尺寸值作为宽度值, 高度值初始化为 0:

```js
console.log(new org.opencv.core.Size([ 5 ])); // 5x0
```

空数组, 宽度尺寸值均为 0:

```js
console.log(new org.opencv.core.Size([])); // 0x0
```

超过两个尺寸值, 多余尺寸值将被忽略:

```js
console.log(new org.opencv.core.Size([ 5, 23, 7, 8, 9 ])); // 5x23
```

## [p#] width

- { [number](dataTypes#number) }

尺寸宽度值.

## [p#] height

- { [number](dataTypes#number) }

尺寸高度值.