# 画布 (Canvas)

---

<p style="font: italic 1em sans-serif; color: #78909C">此章节待补充或完善...</p>
<p style="font: italic 1em sans-serif; color: #78909C">Marked by SuperMonster003 on Oct 22, 2022.</p>

---

canvas提供了使用画布进行2D画图的支持, 可用于简单的小游戏开发或者图片编辑. 使用canvas可以轻松地在一张图片或一个界面上绘制各种线与图形.

canvas的坐标系为平面直角坐标系, 以控件左上角为原点, 控件上边沿为x轴正方向, 控件左边沿为y轴正方向. 例如分辨率为1920*1080的屏幕上, canvas控件覆盖全屏, 画一条从屏幕左上角到屏幕右下角的线段为:

```
canvas.drawLine(0, 0, 1080, 1920, paint);
```

canvas的绘制依赖于画笔Paint, 通过设置画笔的粗细、颜色、填充等可以改变绘制出来的图形. 例如绘制一个红色实心正方形为：

```
var paint = new Paint();
//设置画笔为填充, 则绘制出来的图形都是实心的
paint.setStyle(Paint.STYLE.FILL);
//设置画笔颜色为红色
paint.setColor(colors.RED);
//绘制一个从坐标(0, 0)到坐标(100, 100)的正方形
canvas.drawRect(0, 0, 100, 100, paint);
```

如果要绘制正方形的边框, 则通过设置画笔的Style来实现：

```
var paint = new Paint();
//设置画笔为描边, 则绘制出来的图形都是轮廓
paint.setStyle(Paint.STYLE.STROKE);
//设置画笔颜色为红色
paint.setColor(colors.RED);
//绘制一个从坐标(0, 0)到坐标(100, 100)的正方形
canvas.drawRect(0, 0, 100, 100, paint);
```

结合画笔, canvas可以绘制基本图形、图片等.

## canvas.getWidth()

* 返回 {number}

返回画布当前图层的宽度.

## canvas.getHeight()

* 返回 {number}

返回画布当前图层的高度.

## canvas.drawRGB(r, int g, int b)

* `r` {number} 红色通道值
* `g` {number} 绿色通道值
* `b` {number} 蓝色通道值

将整个可绘制区域填充为r、g、b指定的颜色. 相当于 `canvas.drawColor(colors.rgb(r, g, b))`.

## canvas.drawARGB(a, r, g, b)

* `a` {number} 透明通道值
* `r` {number} 红色通道值
* `g` {number} 绿色通道值
* `b` {number} 蓝色通道值

将整个可绘制区域填充为a、r、g、b指定的颜色. 相当于 `canvas.drawColor(colors.argb(a, r, g, b))`.

## canvas.drawColor(color)

* `color` {number} 颜色值

将整个可绘制区域填充为color指定的颜色.

## canvas.drawColor(color, mode)

* `color` {number} 颜色值
* `mode` {PorterDuff.Mode} Porter-Duff操作

将整个可绘制区域填充为color指定的颜色.

## canvas.drawPaint(paint)

* `paint` {Paint} 画笔

将整个可绘制区域用paint指定的画笔填充. 相当于绘制一个无限大的矩形, 但是更快.
通过该方法可以绘制一个指定的着色器的图案.

## canvas.drawPoint(x, y, paint)

* `x` {number} x坐标
* `y` {number} y坐标
* `paint` {Paint} 画笔

在可绘制区域绘制由坐标(x, y)指定的点.
点的形状由画笔的线帽决定（参见paint.setStrokeCap(cap)）.
点的大小由画笔的宽度决定（参见paint.setStrokeWidth(width)）.
> 如果画笔宽度为0, 则也会绘制1个像素至4个（若抗锯齿启用）.

相当于 `canvas.drawPoints([x, y], paint)`.

## canvas.drawPoints(pts, paint)

* `pts` {Array<number>} 点坐标数组 [x0, y0, x1, y1, x2, y2, ...]
* `paint` {Paint} 画笔

在可绘制区域绘制由坐标数组指定的多个点.

## canvas.drawLine(startX, startY, stopX, stopY, paint)

* `startX` {number} 起点x坐标
* `startY` {number} 起点y坐标
* `endX` {number} 终点x坐标
* `endY` {number} 终点y坐标
* `paint` {Paint} 画笔

在可绘制区域绘制由起点坐标(startX, startY)和终点坐标(endX, endY)指定的线.
绘制时会忽略画笔的样式(Style). 也就是说, 即使样式设为“仅填充(FILL)”也会绘制.
退化为点的线（长度为0）不会被绘制.

## canvas.drawRect(r, paint)

* `r` {Rect} 矩形边界
* `paint` {Paint} 画笔

在可绘制区域绘制由矩形边界r指定的矩形.
绘制时画笔的样式(Style)决定了是否绘制矩形界线和填充矩形.

## canvas.drawRect(left, top, right, bottom, android.graphics.Paint paint)

* `left` {number} 矩形左边界x坐标
* `top` {number} 矩形上边界y坐标
* `right` {number} 矩形右边界x坐标
* `bottom` {number} 矩形下边界y坐标
* `paint` {Paint} 画笔

在可绘制区域绘制由矩形边界(left, top, right, bottom)指定的矩形.
绘制时画笔的样式(Style)决定了是否绘制矩形界线和填充矩形.

## canvas.drawOval(android.graphics.RectF oval, android.graphics.Paint paint)

## canvas.drawOval(float left, float top, float right, float bottom, android.graphics.Paint paint)

## canvas.drawCircle(float cx, float cy, float radius, android.graphics.Paint paint)

## canvas.drawArc(android.graphics.RectF oval, float startAngle, float sweepAngle, boolean useCenter, android.graphics.Paint paint)

## canvas.drawArc(float left, float top, float right, float bottom, float startAngle, float sweepAngle, boolean useCenter, android.graphics.Paint paint)

## canvas.drawRoundRect(android.graphics.RectF rect, float rx, float ry, android.graphics.Paint paint)

## canvas.drawRoundRect(float left, float top, float right, float bottom, float rx, float ry, android.graphics.Paint paint)

## canvas.drawPath(android.graphics.Path path, android.graphics.Paint paint)

## canvas.drawBitmap(android.graphics.Bitmap bitmap, float left, float top, android.graphics.Paint paint)

## canvas.drawText(java.lang.String text, float x, float y, android.graphics.Paint paint)

## canvas.drawTextOnPath(java.lang.String text, android.graphics.Path path, float hOffset, float vOffset, android.graphics.Paint paint)

## canvas.translate(dx, dy)

* `dx` {number} 向x轴正方向平移的距离, 负数表示反方向平移
* `dy` {number} 向y轴正方向平移的距离, 负数表示反方向平移

平移指定距离.

## canvas.scale(sx, sy)

* `sx` {number} 向x轴正方向平移的距离, 负数表示反方向平移
* `sy` {number} 向y轴正方向平移的距离, 负数表示反方向平移

以原点为中心, 将坐标系平移缩放指定倍数.

## canvas.scale(float sx, float sy, float px, float py)

## canvas.rotate(float degrees)

## canvas.rotate(float degrees, float px, float py)

## canvas.skew(float sx, float sy)

# 画笔

# 变换矩阵

# 路径

# Porter-Duff操作

# 着色器

# 遮罩过滤器

# 颜色过滤器

# 路径特效

# 区域

