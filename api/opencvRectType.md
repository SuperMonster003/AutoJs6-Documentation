# OpenCVRect

[org.opencv.core.Rect](https://docs.opencv.org/3.4/javadoc/org/opencv/core/Rect.html) 别名.

与 [AndroidRect](androidRectType) 类似, OpenCVRect 也可表示一个矩形, 通常用于图像的区域表示.

在 AutoJs6 中, 通常不会用到 `OpenCVRect`, 更常见的是使用 `number[]` 表示图像区域:

```js
/* 使用 OpenCVRect 表示区域. */
let regionA = new org.opencv.core.Rect(1, 2, 3, 4); /* 左, 上, 宽, 高. */

/* 使用 OpenCVRect 表示区域. */
let regionB = new android.graphics.Rect(1, 2, 4, 6); /* 左, 上, 右, 下. */

/* 使用 number[] 表示区域. */
let regionC = [ 1, 2, 3, 4 ]; /* 左, 上, 宽, 高. */

/* 三个种类的 region 均可用于 images.clip 方法. */

let img = images.read('./picture.jpg');
images.clip(img, regionA);
images.clip(img, regionB);
images.clip(img, regionC);
```

> 注: 本章节仅列出部分属性或方法.

---

<p style="font: bold 2em sans-serif; color: #FF7043">org.opencv.core.Rect</p>

---

## [C] org.opencv.core.Rect

因 `org.opencv.core.Rect` 在 AutoJs6 中使用频率很低, 此处仅通过示例展示 `org.opencv.core.Rect` 的构造方式:

```js
/* 空矩形. */
new org.opencv.core.Rect();

/* 起点为 {x: 1, y: 2}, 长宽分别为 3 和 4 的矩形. */
new org.opencv.core.Rect([ 1, 2, 3, 4 ]);

/* 起点为 {x: 1, y: 2}, 长宽分别为 3 和 4 的矩形. */
new org.opencv.core.Rect(1, 2, 3, 4);

/* 起点为 {x: 1, y: 2}, 终点为 {x: 3, y: 4} 的矩形. */
new org.opencv.core.Rect(
    new org.opencv.core.Point(1, 2),
    new org.opencv.core.Point(4, 6),
);

/* 起点为 {x: 1, y: 2}, 长宽分别为 3 和 4 的矩形. */
new org.opencv.core.Rect(
    new org.opencv.core.Point(1, 2),
    new org.opencv.core.Size(3, 4),
);
```

## [p#] x

- { [number](dataTypes#number) }

矩形起点 X 坐标.

```js
new org.opencv.core.Rect(1, 2, 3, 4).x; // 1
```

## [p#] y

- { [number](dataTypes#number) }

矩形起点 Y 坐标.

```js
new org.opencv.core.Rect(1, 2, 3, 4).y; // 2
```

## [p#] width

- { [number](dataTypes#number) }

矩形宽度.

```js
new org.opencv.core.Rect(1, 2, 3, 4).width; // 3
```

## [p#] height

- { [number](dataTypes#number) }

矩形高度.

```js
new org.opencv.core.Rect(1, 2, 3, 4).height; // 4
```