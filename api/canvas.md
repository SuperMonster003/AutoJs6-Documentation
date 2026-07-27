# 画布 (Canvas)

`Canvas` 是 AutoJs6 提供的全局构造函数. 它创建一个对
[`android.graphics.Canvas`](https://developer.android.com/reference/android/graphics/Canvas)
进行委托的画布对象, 可用于修改图片, 生成新图片, 或处理 UI 模式中 `<canvas>`
控件的逐帧绘制.

画布使用以像素为单位的二维坐标系. 默认原点位于左上角, X 轴向右, Y 轴向下.
绘制坐标会先经过画布的当前变换矩阵, 再受当前裁剪区域限制.

绘制通常需要 [`android.graphics.Paint`](https://developer.android.com/reference/android/graphics/Paint)
画笔. `Paint` 也是 AutoJs6 预先暴露的全局 Android 类:

```js
let canvas = new Canvas(400, 240);
let paint = new Paint(Paint.ANTI_ALIAS_FLAG);

paint.setColor(colors.RED);
paint.setStyle(Paint.Style.FILL);
canvas.drawRoundRect(20, 20, 380, 220, 24, 24, paint);

let image = canvas.toImage();
try {
    images.save(image, "./canvas.png");
} finally {
    image.recycle();
}
```

> 注: `Paint.Style.FILL` 是正确的 Android 枚举访问形式. 历史文档中的
> `Paint.STYLE.FILL` 并不存在.

## UI 模式中的画布

UI 布局中的 `<canvas>` 会创建 `JsCanvasView`. 控件在独立绘制线程中反复触发
`draw` 事件, 并向监听器传入已经绑定当前 Surface 的 Canvas 对象:

```js
"ui";

ui.layout(
    <frame>
        <canvas id="board" w="*" h="*"/>
    </frame>,
);

let paint = new Paint(Paint.ANTI_ALIAS_FLAG);
paint.setColor(colors.BLUE);
ui.board.setMaxFps(30);

ui.board.on("draw", (canvas) => {
    canvas.drawColor(colors.WHITE);
    canvas.drawCircle(
        canvas.getWidth() / 2,
        canvas.getHeight() / 2,
        80,
        paint,
    );
});
```

事件回调返回后, 底层 Android Canvas 会被提交并解锁. 不应保存回调中的 Canvas
对象并在其他线程或后续异步任务中继续使用. 绘制监听器中的未捕获异常会结束当前
脚本运行环境.

## Android 图形类型

Canvas 的多数方法直接接受 Android 图形对象. 下表列出本页使用的主要类型及访问方式:

| 类型 | AutoJs6 中的访问方式 | 用途 |
| --- | --- | --- |
| [`android.graphics.Bitmap`](https://developer.android.com/reference/android/graphics/Bitmap) | 全局 `Bitmap` 或 `android.graphics.Bitmap` | 位图 |
| [`android.graphics.Paint`](https://developer.android.com/reference/android/graphics/Paint) | 全局 `Paint` 或 `android.graphics.Paint` | 画笔 |
| [`android.graphics.PorterDuff`](https://developer.android.com/reference/android/graphics/PorterDuff) | 全局 `PorterDuff` 或 `android.graphics.PorterDuff` | Porter-Duff 合成模式 |
| [`android.graphics.Rect`](https://developer.android.com/reference/android/graphics/Rect) | `android.graphics.Rect` | 整数矩形 |
| [`android.graphics.RectF`](https://developer.android.com/reference/android/graphics/RectF) | `android.graphics.RectF` | 浮点矩形 |
| [`android.graphics.Matrix`](https://developer.android.com/reference/android/graphics/Matrix) | `android.graphics.Matrix` | 3 x 3 变换矩阵 |
| [`android.graphics.Path`](https://developer.android.com/reference/android/graphics/Path) | `android.graphics.Path` | 几何路径 |
| [`android.graphics.Picture`](https://developer.android.com/reference/android/graphics/Picture) | `android.graphics.Picture` | 录制的绘制指令 |

除表中明确标为全局的类外, Android 类型应通过完整类名访问, 或先使用
[`importClass`](global#m-importclass) 导入. Canvas 方法不会把 Java 原生类型
自动替换为同名 JavaScript 对象.

---

<p style="font: bold 2em sans-serif; color: #FF7043">Canvas</p>

---

## [C] Canvas

### [c] ()

**`[6.7.0]`** **`Overload 1/4`**

- <ins>**returns**</ins> { [Canvas](#c-canvas) } - 尚未绑定绘制目标的画布

创建一个没有底层 Android Canvas 和位图的画布. 在调用
[`setCanvas()`](#m-setcanvas) 绑定目标前, 调用依赖绘制目标的方法会抛出异常.

此重载主要用于 AutoJs6 内部为 UI `<canvas>` 控件准备包装对象. 普通脚本应优先
使用其他构造重载; UI 脚本则直接使用 `draw` 事件传入的 Canvas.

### [c] (bitmap)

**`[6.7.0]`** **`Overload 2/4`**

- **bitmap** { [android.graphics.Bitmap](https://developer.android.com/reference/android/graphics/Bitmap) } - 可变位图
- <ins>**returns**</ins> { [Canvas](#c-canvas) } - 以 `bitmap` 为绘制目标的画布

画布直接绘制到传入的 Bitmap. Bitmap 必须可变; 不可变 Bitmap 会导致构造失败.
后续绘制会立即修改同一个 Bitmap.

### [c] (image)

**`[6.7.0]`** **`Overload 3/4`**

- **image** { [ImageWrapper](imageWrapperType) } - 源图片
- <ins>**returns**</ins> { [Canvas](#c-canvas) } - 以源图片副本为绘制目标的画布

复制 `image` 的 Bitmap 并创建独立的可变绘制目标. 绘制不会修改源
ImageWrapper. 此构造过程不会回收源图片.

以下示例要求脚本目录中存在 `source.png`:

```js
let source = images.read("./source.png");
let canvas = new Canvas(source);
let paint = new Paint();
paint.setColor(colors.RED);
canvas.drawCircle(50, 50, 30, paint);

let result = canvas.toImage();
try {
    images.save(result, "./result.png");
} finally {
    result.recycle();
    source.recycle();
}
```

### [c] (width, height)

**`[6.7.0]`** **`Overload 4/4`**

- **width** { [number](dataTypes#number) } - 画布宽度
- **height** { [number](dataTypes#number) } - 画布高度
- <ins>**returns**</ins> { [Canvas](#c-canvas) } - 使用 ARGB_8888 位图的画布

创建指定尺寸的透明位图并将其设为绘制目标. `width` 和 `height` 必须是可转换为
Java `int` 的有限正数; 小数部分向 0 截断. 尺寸为 0, 负数或超出 `int` 范围时
构造失败.

> 注: 从 AutoJs6 6.7.0 起, Canvas 构造函数由专用包装层校验上述 4 种调用方式.
> 其他参数类型及超过 2 个参数的调用会抛出参数异常.

## 绘制目标与属性

## [m#] getAndroidCanvas

### getAndroidCanvas()

- <ins>**returns**</ins> { [android.graphics.Canvas](https://developer.android.com/reference/android/graphics/Canvas) | [null](dataTypes#null) } - 当前底层 Android Canvas, 或 `null`

返回当前委托的 Android Canvas. 无参构造且尚未调用 `setCanvas()` 时返回 `null`.
直接操作返回对象会绕过 AutoJs6 的 Canvas 包装层.

## [m#] setCanvas

### setCanvas(canvas)

- **canvas** { [android.graphics.Canvas](https://developer.android.com/reference/android/graphics/Canvas) | [null](dataTypes#null) } - 新绘制目标, 或用于解除目标的 `null`
- <ins>**returns**</ins> { [void](dataTypes#void) }

替换当前委托的 Android Canvas. `null` 会解除当前目标, 此后依赖绘制目标的方法
会抛出异常. 此方法供 UI Canvas 桥接使用.

`setCanvas()` 只替换委托目标, 不会更新 Canvas 包装对象内部记录的位图. 因此不要在
调用此方法后依赖 [`toImage()`](#m-toimage) 获取新目标的内容.

## [m#] toImage

### toImage()

- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) } - 当前内部位图的独立副本

复制构造 Canvas 时创建或传入的内部 Bitmap, 并将副本包装为 ImageWrapper.
返回图片不再使用时必须调用 `recycle()`.

此方法仅适用于通过 `Canvas(bitmap)`, `Canvas(image)` 或
`Canvas(width, height)` 创建且未替换目标的画布. 无参构造的 Canvas 没有内部
位图; `setCanvas()` 和 `setBitmap()` 也不会更新该内部引用.

## [m#] isHardwareAccelerated

### isHardwareAccelerated()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前画布是否使用硬件加速

返回底层 Android Canvas 的硬件加速状态. Bitmap 支持的离屏 Canvas 通常不是
硬件加速画布; 实际结果以当前绘制目标为准.

## [m#] setBitmap

### setBitmap(bitmap)

- **bitmap** { [android.graphics.Bitmap](https://developer.android.com/reference/android/graphics/Bitmap) | [null](dataTypes#null) } - 新的可变位图, 或用于解除目标的 `null`
- <ins>**returns**</ins> { [void](dataTypes#void) }

调用底层 Android Canvas 的 `setBitmap()` 更换绘制位图. 新 Bitmap 必须可变.
硬件加速画布不支持此操作. 更换目标会重置底层画布的状态栈, 图层和过滤器;
在 Android API 26 及以上系统中也会重置矩阵和裁剪.

此方法不会更新 AutoJs6 Canvas 包装对象供 `toImage()` 使用的内部位图引用.

## [m#] isOpaque

### isOpaque()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前绘制图层是否不支持逐像素透明度

## [m#] getWidth

### getWidth()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前绘制图层宽度

## [m#] getHeight

### getHeight()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前绘制图层高度

## [m#] getDensity

### getDensity()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前目标密度

目标密度用于决定绘制不同密度 Bitmap 时的自动缩放比例. 没有位图目标时通常为
`Bitmap.DENSITY_NONE`.

## [m#] setDensity

### setDensity(density)

- **density** { [number](dataTypes#number) } - 新目标密度
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置画布目标密度. 若底层 Android Canvas 当前持有 Bitmap, 还会同时设置该
Bitmap 的密度. 使用 `Bitmap.DENSITY_NONE` 可关闭基于密度的位图缩放.

## [m#] getMaximumBitmapWidth

### getMaximumBitmapWidth()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前画布允许绘制的最大 Bitmap 宽度

尝试绘制超过此宽度的 Bitmap 会失败. 限制值取决于当前 Android Canvas 实现.

## [m#] getMaximumBitmapHeight

### getMaximumBitmapHeight()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前画布允许绘制的最大 Bitmap 高度

尝试绘制超过此高度的 Bitmap 会失败. 限制值取决于当前 Android Canvas 实现.

## 状态栈与图层

Canvas 的当前变换矩阵和裁剪区域属于画布状态. `save()` 将状态压入栈,
`restore()` 或 `restoreToCount()` 将状态恢复. 绘制内容本身不会因恢复状态而撤销.

## [m#] save

### save()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 可传给 `restoreToCount()` 的保存计数

保存当前变换矩阵和裁剪区域.

```js
let checkpoint = canvas.save();
canvas.translate(100, 0);
canvas.drawCircle(0, 0, 20, paint);
canvas.restoreToCount(checkpoint);
```

## [m#] saveLayer

### saveLayer(bounds, paint, saveFlags)

**`DEPRECATED`** **`Overload 1/4`**

- **bounds** { [android.graphics.RectF](https://developer.android.com/reference/android/graphics/RectF) | [null](dataTypes#null) } - 离屏图层最大边界, `null` 表示当前裁剪边界
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) | [null](dataTypes#null) } - 恢复图层时使用的画笔
- **saveFlags** { [number](dataTypes#number) } - Android Canvas 保存标志
- <ins>**returns**</ins> { [number](dataTypes#number) } - 可传给 `restoreToCount()` 的保存计数

保存状态并把后续绘制重定向到离屏图层. 调用 `restore()` 时, 离屏内容使用
`paint` 的 alpha, ColorFilter 和 Xfermode 等配置合成回原目标.

带 `saveFlags` 的 Android 重载已弃用. 在 Android API 28 及以上系统中,
仅 `android.graphics.Canvas.ALL_SAVE_FLAG` 有效, 其他值会抛出异常.
应使用不带此参数的重载.

### saveLayer(bounds, paint)

**`Overload 2/4`**

- **bounds** { [android.graphics.RectF](https://developer.android.com/reference/android/graphics/RectF) | [null](dataTypes#null) } - 离屏图层最大边界
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) | [null](dataTypes#null) } - 恢复图层时使用的画笔
- <ins>**returns**</ins> { [number](dataTypes#number) } - 可传给 `restoreToCount()` 的保存计数

### saveLayer(left, top, right, bottom, paint, saveFlags)

**`DEPRECATED`** **`Overload 3/4`**

- **left** { [number](dataTypes#number) } - 图层左边界 X 坐标
- **top** { [number](dataTypes#number) } - 图层上边界 Y 坐标
- **right** { [number](dataTypes#number) } - 图层右边界 X 坐标
- **bottom** { [number](dataTypes#number) } - 图层下边界 Y 坐标
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) | [null](dataTypes#null) } - 恢复图层时使用的画笔
- **saveFlags** { [number](dataTypes#number) } - Android Canvas 保存标志
- <ins>**returns**</ins> { [number](dataTypes#number) } - 可传给 `restoreToCount()` 的保存计数

此重载等价于使用 RectF 边界的已弃用重载.

### saveLayer(left, top, right, bottom, paint)

**`Overload 4/4`**

- **left** { [number](dataTypes#number) } - 图层左边界 X 坐标
- **top** { [number](dataTypes#number) } - 图层上边界 Y 坐标
- **right** { [number](dataTypes#number) } - 图层右边界 X 坐标
- **bottom** { [number](dataTypes#number) } - 图层下边界 Y 坐标
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) | [null](dataTypes#null) } - 恢复图层时使用的画笔
- <ins>**returns**</ins> { [number](dataTypes#number) } - 可传给 `restoreToCount()` 的保存计数

`saveLayer()` 会分配额外离屏绘制目标, 开销明显高于 `save()`. 应限制图层边界,
并在无需离屏合成时使用 `save()`.

## [m#] saveLayerAlpha

### saveLayerAlpha(bounds, alpha, saveFlags)

**`DEPRECATED`** **`Overload 1/4`**

- **bounds** { [android.graphics.RectF](https://developer.android.com/reference/android/graphics/RectF) | [null](dataTypes#null) } - 离屏图层最大边界
- **alpha** { [number](dataTypes#number) } - 恢复图层时应用的 alpha, 取值按 `[0..255]` 限制
- **saveFlags** { [number](dataTypes#number) } - Android Canvas 保存标志
- <ins>**returns**</ins> { [number](dataTypes#number) } - 可传给 `restoreToCount()` 的保存计数

保存状态并创建带整体透明度的离屏图层. 带 `saveFlags` 的 Android 重载已弃用,
并受与 `saveLayer(bounds, paint, saveFlags)` 相同的 Android API 28 限制.

### saveLayerAlpha(bounds, alpha)

**`Overload 2/4`**

- **bounds** { [android.graphics.RectF](https://developer.android.com/reference/android/graphics/RectF) | [null](dataTypes#null) } - 离屏图层最大边界
- **alpha** { [number](dataTypes#number) } - 恢复图层时应用的 alpha, 取值按 `[0..255]` 限制
- <ins>**returns**</ins> { [number](dataTypes#number) } - 可传给 `restoreToCount()` 的保存计数

### saveLayerAlpha(left, top, right, bottom, alpha, saveFlags)

**`DEPRECATED`** **`Overload 3/4`**

- **left** { [number](dataTypes#number) } - 图层左边界 X 坐标
- **top** { [number](dataTypes#number) } - 图层上边界 Y 坐标
- **right** { [number](dataTypes#number) } - 图层右边界 X 坐标
- **bottom** { [number](dataTypes#number) } - 图层下边界 Y 坐标
- **alpha** { [number](dataTypes#number) } - 恢复图层时应用的 alpha, 取值按 `[0..255]` 限制
- **saveFlags** { [number](dataTypes#number) } - Android Canvas 保存标志
- <ins>**returns**</ins> { [number](dataTypes#number) } - 可传给 `restoreToCount()` 的保存计数

### saveLayerAlpha(left, top, right, bottom, alpha)

**`Overload 4/4`**

- **left** { [number](dataTypes#number) } - 图层左边界 X 坐标
- **top** { [number](dataTypes#number) } - 图层上边界 Y 坐标
- **right** { [number](dataTypes#number) } - 图层右边界 X 坐标
- **bottom** { [number](dataTypes#number) } - 图层下边界 Y 坐标
- **alpha** { [number](dataTypes#number) } - 恢复图层时应用的 alpha, 取值按 `[0..255]` 限制
- <ins>**returns**</ins> { [number](dataTypes#number) } - 可传给 `restoreToCount()` 的保存计数

## [m#] restore

### restore()

- <ins>**returns**</ins> { [void](dataTypes#void) }

恢复最近一次 `save()`, `saveLayer()` 或 `saveLayerAlpha()` 前的状态. 恢复次数超过
保存次数时抛出异常.

## [m#] getSaveCount

### getSaveCount()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前状态栈保存计数

返回值至少为 1. 初始状态本身占用一个栈层级.

## [m#] restoreToCount

### restoreToCount(saveCount)

- **saveCount** { [number](dataTypes#number) } - 目标保存计数
- <ins>**returns**</ins> { [void](dataTypes#void) }

连续恢复状态, 直至状态栈达到 `saveCount`. 通常传入 `save()`,
`saveLayer()` 或 `saveLayerAlpha()` 的返回值.

## 坐标变换

变换方法修改当前变换矩阵, 不会改写已经绘制的像素. 需要局部变换时, 应使用
`save()` 和 `restore()` 包围相关操作.

## [m#] translate

### translate(dx, dy)

- **dx** { [number](dataTypes#number) } - X 轴平移量
- **dy** { [number](dataTypes#number) } - Y 轴平移量
- <ins>**returns**</ins> { [void](dataTypes#void) }

将当前坐标系平移指定距离.

## [m#] scale

### scale(sx, sy)

**`Overload 1/2`**

- **sx** { [number](dataTypes#number) } - X 轴缩放系数
- **sy** { [number](dataTypes#number) } - Y 轴缩放系数
- <ins>**returns**</ins> { [void](dataTypes#void) }

以当前原点为中心缩放坐标系. 负系数会同时产生镜像效果.

### scale(sx, sy, px, py)

**`Overload 2/2`**

- **sx** { [number](dataTypes#number) } - X 轴缩放系数
- **sy** { [number](dataTypes#number) } - Y 轴缩放系数
- **px** { [number](dataTypes#number) } - 缩放中心 X 坐标
- **py** { [number](dataTypes#number) } - 缩放中心 Y 坐标
- <ins>**returns**</ins> { [void](dataTypes#void) }

## [m#] rotate

### rotate(degrees)

**`Overload 1/2`**

- **degrees** { [number](dataTypes#number) } - 顺时针旋转角度
- <ins>**returns**</ins> { [void](dataTypes#void) }

以当前原点为中心旋转坐标系.

### rotate(degrees, px, py)

**`Overload 2/2`**

- **degrees** { [number](dataTypes#number) } - 顺时针旋转角度
- **px** { [number](dataTypes#number) } - 旋转中心 X 坐标
- **py** { [number](dataTypes#number) } - 旋转中心 Y 坐标
- <ins>**returns**</ins> { [void](dataTypes#void) }

## [m#] skew

### skew(sx, sy)

- **sx** { [number](dataTypes#number) } - X 轴错切系数
- **sy** { [number](dataTypes#number) } - Y 轴错切系数
- <ins>**returns**</ins> { [void](dataTypes#void) }

## [m#] concat

### concat(matrix)

- **matrix** { [android.graphics.Matrix](https://developer.android.com/reference/android/graphics/Matrix) | [null](dataTypes#null) } - 要前乘到当前矩阵的变换矩阵
- <ins>**returns**</ins> { [void](dataTypes#void) }

将 `matrix` 前乘到当前变换矩阵. `matrix` 为 `null` 时不执行操作.

## [m#] setMatrix

### setMatrix(matrix)

- **matrix** { [android.graphics.Matrix](https://developer.android.com/reference/android/graphics/Matrix) | [null](dataTypes#null) } - 新变换矩阵
- <ins>**returns**</ins> { [void](dataTypes#void) }

完全替换当前变换矩阵. `matrix` 为 `null` 时重置为单位矩阵. 通常应优先使用
`concat()`, `translate()`, `scale()` 和 `rotate()` 进行相对变换.

## [m#] getMatrix

### getMatrix(ctm)

**`DEPRECATED`** **`Overload 1/2`**

- **ctm** { [android.graphics.Matrix](https://developer.android.com/reference/android/graphics/Matrix) } - 接收当前矩阵副本的对象
- <ins>**returns**</ins> { [void](dataTypes#void) }

把当前变换矩阵复制到 `ctm`.

### getMatrix()

**`DEPRECATED`** **`Overload 2/2`**

- <ins>**returns**</ins> { [android.graphics.Matrix](https://developer.android.com/reference/android/graphics/Matrix) } - 当前矩阵的副本

Android 已弃用读取 Canvas 当前矩阵的接口. 硬件加速画布的矩阵可能由调用环境决定,
不适合据此推断屏幕坐标. 脚本应自行保存传入 Canvas 的变换矩阵.

## 裁剪与快速排除

裁剪区域属于 Canvas 状态, 并受当前变换矩阵影响. 不带 `op` 的裁剪方法使用
`Region.Op.INTERSECT`, 即只保留当前裁剪与新几何区域的交集.

## [m#] clipRect

### clipRect(rect, op)

**`DEPRECATED`** **`Overload 1/7`**

- **rect** { [android.graphics.RectF](https://developer.android.com/reference/android/graphics/RectF) } - 浮点裁剪矩形
- **op** { [android.graphics.Region.Op](https://developer.android.com/reference/android/graphics/Region.Op) } - 裁剪运算
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 运算后的裁剪区域是否非空

### clipRect(rect, op)

**`DEPRECATED`** **`Overload 2/7`**

- **rect** { [AndroidRect](androidRectType) } - 整数裁剪矩形
- **op** { [android.graphics.Region.Op](https://developer.android.com/reference/android/graphics/Region.Op) } - 裁剪运算
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 运算后的裁剪区域是否非空

带 `op` 的 Android 裁剪重载已弃用. 在 Android API 28 及以上系统中,
`op` 仅允许 `Region.Op.INTERSECT` 或 `Region.Op.DIFFERENCE`; 其他值会抛出异常.

### clipRect(rect)

**`Overload 3/7`**

- **rect** { [android.graphics.RectF](https://developer.android.com/reference/android/graphics/RectF) } - 浮点裁剪矩形
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 相交后的裁剪区域是否非空

### clipRect(rect)

**`Overload 4/7`**

- **rect** { [AndroidRect](androidRectType) } - 整数裁剪矩形
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 相交后的裁剪区域是否非空

### clipRect(left, top, right, bottom, op)

**`DEPRECATED`** **`Overload 5/7`**

- **left** { [number](dataTypes#number) } - 裁剪矩形左边界 X 坐标
- **top** { [number](dataTypes#number) } - 裁剪矩形上边界 Y 坐标
- **right** { [number](dataTypes#number) } - 裁剪矩形右边界 X 坐标
- **bottom** { [number](dataTypes#number) } - 裁剪矩形下边界 Y 坐标
- **op** { [android.graphics.Region.Op](https://developer.android.com/reference/android/graphics/Region.Op) } - 裁剪运算
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 运算后的裁剪区域是否非空

### clipRect(left, top, right, bottom)

**`Overload [6-7]/7`**

- **left** { [number](dataTypes#number) } - 裁剪矩形左边界 X 坐标
- **top** { [number](dataTypes#number) } - 裁剪矩形上边界 Y 坐标
- **right** { [number](dataTypes#number) } - 裁剪矩形右边界 X 坐标
- **bottom** { [number](dataTypes#number) } - 裁剪矩形下边界 Y 坐标
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 相交后的裁剪区域是否非空

此 JavaScript 签名覆盖底层的浮点和整数坐标重载.

## [m#] clipPath

### clipPath(path, op)

**`DEPRECATED`** **`Overload 1/2`**

- **path** { [android.graphics.Path](https://developer.android.com/reference/android/graphics/Path) } - 裁剪路径
- **op** { [android.graphics.Region.Op](https://developer.android.com/reference/android/graphics/Region.Op) } - 裁剪运算
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 运算后的裁剪区域是否非空

带 `op` 的 Android 裁剪重载已弃用, 并受与 `clipRect(rect, op)` 相同的
Android API 28 运算限制.

### clipPath(path)

**`Overload 2/2`**

- **path** { [android.graphics.Path](https://developer.android.com/reference/android/graphics/Path) } - 要与当前裁剪区域求交集的路径
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 相交后的裁剪区域是否非空

## [m#] getDrawFilter

### getDrawFilter()

- <ins>**returns**</ins> { [android.graphics.DrawFilter](https://developer.android.com/reference/android/graphics/DrawFilter) | [null](dataTypes#null) } - 当前绘制过滤器

## [m#] setDrawFilter

### setDrawFilter(filter)

- **filter** { [android.graphics.DrawFilter](https://developer.android.com/reference/android/graphics/DrawFilter) | [null](dataTypes#null) } - 新绘制过滤器, 或用于清除过滤器的 `null`
- <ins>**returns**</ins> { [void](dataTypes#void) }

绘制过滤器可在绘制时修改 Paint 标志. Android 提供的常用实现为
[`PaintFlagsDrawFilter`](https://developer.android.com/reference/android/graphics/PaintFlagsDrawFilter).

## [m#] quickReject

### quickReject(rect, type)

**`DEPRECATED`** **`Overload 1/3`**

- **rect** { [android.graphics.RectF](https://developer.android.com/reference/android/graphics/RectF) } - 待检测矩形
- **type** { [android.graphics.Canvas.EdgeType](https://developer.android.com/reference/android/graphics/Canvas.EdgeType) } - 历史边缘类型参数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 矩形是否完全位于当前裁剪区域之外

### quickReject(path, type)

**`DEPRECATED`** **`Overload 2/3`**

- **path** { [android.graphics.Path](https://developer.android.com/reference/android/graphics/Path) } - 待检测路径
- **type** { [android.graphics.Canvas.EdgeType](https://developer.android.com/reference/android/graphics/Canvas.EdgeType) } - 历史边缘类型参数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 路径是否可确定完全位于当前裁剪区域之外

### quickReject(left, top, right, bottom, type)

**`DEPRECATED`** **`Overload 3/3`**

- **left** { [number](dataTypes#number) } - 待检测矩形左边界 X 坐标
- **top** { [number](dataTypes#number) } - 待检测矩形上边界 Y 坐标
- **right** { [number](dataTypes#number) } - 待检测矩形右边界 X 坐标
- **bottom** { [number](dataTypes#number) } - 待检测矩形下边界 Y 坐标
- **type** { [android.graphics.Canvas.EdgeType](https://developer.android.com/reference/android/graphics/Canvas.EdgeType) } - 历史边缘类型参数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 矩形是否完全位于当前裁剪区域之外

`quickReject()` 用于跳过必然不可见的绘制. 返回 `true` 表示可以安全跳过;
返回 `false` 只表示无法快速排除, 不保证几何对象一定与裁剪区域相交.

这些由 ScriptCanvas 暴露的重载均包含已被 Android 弃用的 `EdgeType` 参数.
较新 Android 系统会忽略该参数.

## [m#] getClipBounds

### getClipBounds(bounds)

**`Overload 1/2`**

- **bounds** { [AndroidRect](androidRectType) } - 接收当前裁剪边界的非空矩形
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前裁剪区域是否非空

将当前局部坐标系中的裁剪边界写入 `bounds`. 虽然 ScriptCanvas 源码保留了可空
注解, 底层 Android Canvas 要求此参数非空.

### getClipBounds()

**`Overload 2/2`**

- <ins>**returns**</ins> { [AndroidRect](androidRectType) } - 当前裁剪边界

裁剪区域为空时返回 `Rect(0, 0 - 0, 0)`.

## 颜色与基本图形

## [m#] drawRGB

### drawRGB(r, g, b)

- **r** { [number](dataTypes#number) } - 红色通道, 期望范围 `[0..255]`
- **g** { [number](dataTypes#number) } - 绿色通道, 期望范围 `[0..255]`
- **b** { [number](dataTypes#number) } - 蓝色通道, 期望范围 `[0..255]`
- <ins>**returns**</ins> { [void](dataTypes#void) }

使用完全不透明的 RGB 颜色和 `PorterDuff.Mode.SRC_OVER` 填充当前裁剪区域.
等价于 `drawColor(colors.rgb(r, g, b))`.

## [m#] drawARGB

### drawARGB(a, r, g, b)

- **a** { [number](dataTypes#number) } - Alpha 通道, 期望范围 `[0..255]`
- **r** { [number](dataTypes#number) } - 红色通道, 期望范围 `[0..255]`
- **g** { [number](dataTypes#number) } - 绿色通道, 期望范围 `[0..255]`
- **b** { [number](dataTypes#number) } - 蓝色通道, 期望范围 `[0..255]`
- <ins>**returns**</ins> { [void](dataTypes#void) }

使用 ARGB 颜色和 `PorterDuff.Mode.SRC_OVER` 填充当前裁剪区域.
等价于 `drawColor(colors.argb(a, r, g, b))`.

## [m#] drawColor

### drawColor(color)

**`Overload 1/2`**

- **color** { [ColorInt](dataTypes#colorint) } - 填充颜色
- <ins>**returns**</ins> { [void](dataTypes#void) }

使用 `PorterDuff.Mode.SRC_OVER` 填充当前裁剪区域.

### drawColor(color, mode)

**`Overload 2/2`**

- **color** { [ColorInt](dataTypes#colorint) } - 填充颜色
- **mode** { [android.graphics.PorterDuff.Mode](https://developer.android.com/reference/android/graphics/PorterDuff.Mode) } - Porter-Duff 合成模式
- <ins>**returns**</ins> { [void](dataTypes#void) }

使用指定合成模式填充当前裁剪区域. 例如 `PorterDuff.Mode.CLEAR` 可清除
Bitmap 支持的离屏画布区域:

```js
canvas.drawColor(colors.TRANSPARENT, PorterDuff.Mode.CLEAR);
```

## [m#] drawPaint

### drawPaint(paint)

- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 填充画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

使用 `paint` 填充当前裁剪区域. 此方法相当于绘制一个无限大的矩形, 但效率更高.
画笔可包含 Shader, ColorFilter 和其他绘制效果.

## [m#] drawPoint

### drawPoint(x, y, paint)

- **x** { [number](dataTypes#number) } - 点的 X 坐标
- **y** { [number](dataTypes#number) } - 点的 Y 坐标
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

绘制一个点. 点的尺寸由 `paint.getStrokeWidth()` 决定, 形状由
`paint.getStrokeCap()` 决定. 线宽为 0 时至少绘制 1 个像素.

## [m#] drawPoints

### drawPoints(pts, offset, count, paint)

**`Overload 1/2`**

- **pts** { [number](dataTypes#number)[] } - 坐标数组, 格式为 `[x0, y0, x1, y1, ...]`
- **offset** { [number](dataTypes#number) } - 跳过的数组元素数
- **count** { [number](dataTypes#number) } - 从 `offset` 起处理的数组元素数
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

每 2 个连续数值表示一个点. `count / 2` 的整数部分为实际处理的点数.

### drawPoints(pts, paint)

**`Overload 2/2`**

- **pts** { [number](dataTypes#number)[] } - 坐标数组, 格式为 `[x0, y0, x1, y1, ...]`
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

绘制数组中的全部点.

## [m#] drawLine

### drawLine(startX, startY, stopX, stopY, paint)

- **startX** { [number](dataTypes#number) } - 起点 X 坐标
- **startY** { [number](dataTypes#number) } - 起点 Y 坐标
- **stopX** { [number](dataTypes#number) } - 终点 X 坐标
- **stopY** { [number](dataTypes#number) } - 终点 Y 坐标
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

绘制线段. 线段始终按描边处理, 因此忽略 `Paint.Style`. 长度为 0 的线段不绘制.

## [m#] drawLines

### drawLines(pts, offset, count, paint)

**`Overload 1/2`**

- **pts** { [number](dataTypes#number)[] } - 线段坐标数组, 格式为 `[x0, y0, x1, y1, ...]`
- **offset** { [number](dataTypes#number) } - 跳过的数组元素数
- **count** { [number](dataTypes#number) } - 从 `offset` 起处理的数组元素数
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

每 4 个连续数值表示一条独立线段. `count / 4` 的整数部分为实际绘制的线段数.

### drawLines(pts, paint)

**`Overload 2/2`**

- **pts** { [number](dataTypes#number)[] } - 线段坐标数组, 格式为 `[x0, y0, x1, y1, ...]`
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

绘制数组中的全部完整线段.

## [m#] drawRect

### drawRect(rect, paint)

**`Overload 1/3`**

- **rect** { [android.graphics.RectF](https://developer.android.com/reference/android/graphics/RectF) } - 浮点矩形
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

### drawRect(rect, paint)

**`Overload 2/3`**

- **rect** { [AndroidRect](androidRectType) } - 整数矩形
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

### drawRect(left, top, right, bottom, paint)

**`Overload 3/3`**

- **left** { [number](dataTypes#number) } - 矩形左边界 X 坐标
- **top** { [number](dataTypes#number) } - 矩形上边界 Y 坐标
- **right** { [number](dataTypes#number) } - 矩形右边界 X 坐标
- **bottom** { [number](dataTypes#number) } - 矩形下边界 Y 坐标
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

矩形按 `paint.getStyle()` 填充, 描边, 或同时填充并描边.

## [m#] drawOval

### drawOval(oval, paint)

**`Overload 1/2`**

- **oval** { [android.graphics.RectF](https://developer.android.com/reference/android/graphics/RectF) } - 椭圆外接矩形
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

### drawOval(left, top, right, bottom, paint)

**`Overload 2/2`**

- **left** { [number](dataTypes#number) } - 外接矩形左边界 X 坐标
- **top** { [number](dataTypes#number) } - 外接矩形上边界 Y 坐标
- **right** { [number](dataTypes#number) } - 外接矩形右边界 X 坐标
- **bottom** { [number](dataTypes#number) } - 外接矩形下边界 Y 坐标
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

绘制适配外接矩形的椭圆.

## [m#] drawCircle

### drawCircle(cx, cy, radius, paint)

- **cx** { [number](dataTypes#number) } - 圆心 X 坐标
- **cy** { [number](dataTypes#number) } - 圆心 Y 坐标
- **radius** { [number](dataTypes#number) } - 半径
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

半径小于或等于 0 时不绘制.

## [m#] drawArc

### drawArc(oval, startAngle, sweepAngle, useCenter, paint)

**`Overload 1/2`**

- **oval** { [android.graphics.RectF](https://developer.android.com/reference/android/graphics/RectF) } - 圆弧外接椭圆
- **startAngle** { [number](dataTypes#number) } - 起始角度
- **sweepAngle** { [number](dataTypes#number) } - 顺时针扫过角度
- **useCenter** { [boolean](dataTypes#boolean) } - 是否连接椭圆中心并形成扇形
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

### drawArc(left, top, right, bottom, startAngle, sweepAngle, useCenter, paint)

**`Overload 2/2`**

- **left** { [number](dataTypes#number) } - 外接矩形左边界 X 坐标
- **top** { [number](dataTypes#number) } - 外接矩形上边界 Y 坐标
- **right** { [number](dataTypes#number) } - 外接矩形右边界 X 坐标
- **bottom** { [number](dataTypes#number) } - 外接矩形下边界 Y 坐标
- **startAngle** { [number](dataTypes#number) } - 起始角度
- **sweepAngle** { [number](dataTypes#number) } - 顺时针扫过角度
- **useCenter** { [boolean](dataTypes#boolean) } - 是否连接椭圆中心并形成扇形
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

角度 0 位于椭圆右侧的 3 点钟方向, 正角度按顺时针方向增加.
`sweepAngle >= 360` 时绘制完整椭圆. `useCenter` 为 `true` 时绘制扇形,
否则绘制弧段.

## [m#] drawRoundRect

### drawRoundRect(rect, rx, ry, paint)

**`Overload 1/2`**

- **rect** { [android.graphics.RectF](https://developer.android.com/reference/android/graphics/RectF) } - 圆角矩形边界
- **rx** { [number](dataTypes#number) } - 圆角椭圆 X 半径
- **ry** { [number](dataTypes#number) } - 圆角椭圆 Y 半径
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

### drawRoundRect(left, top, right, bottom, rx, ry, paint)

**`Overload 2/2`**

- **left** { [number](dataTypes#number) } - 矩形左边界 X 坐标
- **top** { [number](dataTypes#number) } - 矩形上边界 Y 坐标
- **right** { [number](dataTypes#number) } - 矩形右边界 X 坐标
- **bottom** { [number](dataTypes#number) } - 矩形下边界 Y 坐标
- **rx** { [number](dataTypes#number) } - 圆角椭圆 X 半径
- **ry** { [number](dataTypes#number) } - 圆角椭圆 Y 半径
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

## [m#] drawPath

### drawPath(path, paint)

- **path** { [android.graphics.Path](https://developer.android.com/reference/android/graphics/Path) } - 待绘制路径
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

路径按 `paint.getStyle()` 填充, 描边, 或同时填充并描边.

## Bitmap 与 ImageWrapper

Bitmap 方法接受 Android 原生 Bitmap; `drawImage()` 是 AutoJs6 为
[ImageWrapper](imageWrapperType) 增加的对应接口. 绘制操作不会回收传入的
Bitmap 或 ImageWrapper.

## [m#] drawBitmap

### drawBitmap(bitmap, left, top, paint)

**`Overload 1/6`**

- **bitmap** { [android.graphics.Bitmap](https://developer.android.com/reference/android/graphics/Bitmap) } - 待绘制位图
- **left** { [number](dataTypes#number) } - 位图左边界 X 坐标
- **top** { [number](dataTypes#number) } - 位图上边界 Y 坐标
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) | [null](dataTypes#null) } - 画笔, `null` 表示使用默认绘制配置
- <ins>**returns**</ins> { [void](dataTypes#void) }

在指定左上角绘制整张 Bitmap. 此重载会根据 Bitmap 与 Canvas 的密度差异自动缩放.

### drawBitmap(bitmap, src, dst, paint)

**`Overload 2/6`**

- **bitmap** { [android.graphics.Bitmap](https://developer.android.com/reference/android/graphics/Bitmap) } - 待绘制位图
- **src** { [AndroidRect](androidRectType) | [null](dataTypes#null) } - 源像素区域, `null` 表示整张位图
- **dst** { [android.graphics.RectF](https://developer.android.com/reference/android/graphics/RectF) } - 浮点目标区域
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) | [null](dataTypes#null) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

把源区域缩放并平移到目标区域. 此类显式源和目标矩形重载忽略 Bitmap 密度.

### drawBitmap(bitmap, src, dst, paint)

**`Overload 3/6`**

- **bitmap** { [android.graphics.Bitmap](https://developer.android.com/reference/android/graphics/Bitmap) } - 待绘制位图
- **src** { [AndroidRect](androidRectType) | [null](dataTypes#null) } - 源像素区域, `null` 表示整张位图
- **dst** { [AndroidRect](androidRectType) } - 整数目标区域
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) | [null](dataTypes#null) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

### drawBitmap(colors, offset, stride, x, y, width, height, hasAlpha, paint)

**`DEPRECATED`** **`Overload [4-5]/6`**

- **colors** { [ColorInt](dataTypes#colorint)[] } - 按行存储的像素颜色
- **offset** { [number](dataTypes#number) } - 第一个像素在数组中的偏移
- **stride** { [number](dataTypes#number) } - 相邻行起点之间的数组元素数
- **x** { [number](dataTypes#number) } - 绘制起点 X 坐标
- **y** { [number](dataTypes#number) } - 绘制起点 Y 坐标
- **width** { [number](dataTypes#number) } - 像素区域宽度
- **height** { [number](dataTypes#number) } - 像素区域高度
- **hasAlpha** { [boolean](dataTypes#boolean) } - 是否使用颜色数组中的 Alpha 通道
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) | [null](dataTypes#null) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

把 ColorInt 数组直接视为 Bitmap 像素并绘制. 此 JavaScript 签名覆盖底层使用
浮点或整数 `x` 和 `y` 的两个重载. `stride` 的绝对值必须不小于 `width`,
数组范围必须足以容纳请求的全部像素.

这些重载在硬件加速画布上需要复制像素缓冲区, Android 已将其弃用.
应先创建 Bitmap, 再使用其他 `drawBitmap()` 重载.

### drawBitmap(bitmap, matrix, paint)

**`Overload 6/6`**

- **bitmap** { [android.graphics.Bitmap](https://developer.android.com/reference/android/graphics/Bitmap) } - 待绘制位图
- **matrix** { [android.graphics.Matrix](https://developer.android.com/reference/android/graphics/Matrix) } - 位图局部变换矩阵
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) | [null](dataTypes#null) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

使用 `matrix` 变换 Bitmap 后进行绘制. 结果仍会继续经过 Canvas 的当前变换矩阵.

## [m#] drawBitmapMesh

### drawBitmapMesh(bitmap, meshWidth, meshHeight, verts, vertOffset, colors, colorOffset, paint)

- **bitmap** { [android.graphics.Bitmap](https://developer.android.com/reference/android/graphics/Bitmap) } - 待变形位图
- **meshWidth** { [number](dataTypes#number) } - 网格横向单元数
- **meshHeight** { [number](dataTypes#number) } - 网格纵向单元数
- **verts** { [number](dataTypes#number)[] } - 网格顶点坐标数组
- **vertOffset** { [number](dataTypes#number) } - 顶点数组偏移
- **colors** { [ColorInt](dataTypes#colorint)[] | [null](dataTypes#null) } - 可选顶点颜色数组
- **colorOffset** { [number](dataTypes#number) } - 颜色数组偏移
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) | [null](dataTypes#null) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

按均匀分布在源 Bitmap 上的网格变形并绘制. `verts` 至少需要
`(meshWidth + 1) * (meshHeight + 1) * 2 + vertOffset` 个数值.
非空 `colors` 至少需要
`(meshWidth + 1) * (meshHeight + 1) + colorOffset` 个颜色.
顶点颜色会与对应的 Bitmap 颜色相乘. 此方法不支持抗锯齿.

## [m#] drawVertices

### drawVertices(mode, vertexCount, verts, vertOffset, texs, texOffset, colors, colorOffset, indices, indexOffset, indexCount, paint)

- **mode** { [android.graphics.Canvas.VertexMode](https://developer.android.com/reference/android/graphics/Canvas.VertexMode) } - 三角形解释模式
- **vertexCount** { [number](dataTypes#number) } - 从 `verts` 处理的数值数量
- **verts** { [number](dataTypes#number)[] } - 顶点坐标数组
- **vertOffset** { [number](dataTypes#number) } - 顶点数组偏移
- **texs** { [number](dataTypes#number)[] | [null](dataTypes#null) } - Shader 纹理坐标数组
- **texOffset** { [number](dataTypes#number) } - 纹理坐标数组偏移
- **colors** { [ColorInt](dataTypes#colorint)[] | [null](dataTypes#null) } - 顶点颜色数组
- **colorOffset** { [number](dataTypes#number) } - 颜色数组偏移
- **indices** { [number](dataTypes#number)[] | [null](dataTypes#null) } - 顶点索引数组
- **indexOffset** { [number](dataTypes#number) } - 索引数组偏移
- **indexCount** { [number](dataTypes#number) } - 使用的索引数量
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

把 `verts` 解释为三角形并绘制. `texs` 非空时, Paint 必须配置 Shader;
`colors` 非空时, 颜色会在三角形内插值. `indices` 可用于复用顶点.
此方法不支持抗锯齿.

## [m#] drawImage

### drawImage(image, left, top, paint)

**`Overload 1/6`**

- **image** { [ImageWrapper](imageWrapperType) } - 待绘制图片
- **left** { [number](dataTypes#number) } - 图片左边界 X 坐标
- **top** { [number](dataTypes#number) } - 图片上边界 Y 坐标
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) | [null](dataTypes#null) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

在指定左上角绘制整张 ImageWrapper.

### drawImage(image, left, top, width, height, paint)

**`Overload 2/6`**

- **image** { [ImageWrapper](imageWrapperType) } - 待绘制图片
- **left** { [number](dataTypes#number) } - 目标左边界 X 坐标
- **top** { [number](dataTypes#number) } - 目标上边界 Y 坐标
- **width** { [number](dataTypes#number) } - 目标宽度
- **height** { [number](dataTypes#number) } - 目标高度
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) | [null](dataTypes#null) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

缩放整张图片以填充指定目标区域.

### drawImage(image, sx, sy, swidth, sheight, left, top, width, height, paint)

**`Overload 3/6`**

- **image** { [ImageWrapper](imageWrapperType) } - 待绘制图片
- **sx** { [number](dataTypes#number) } - 源区域左边界 X 坐标
- **sy** { [number](dataTypes#number) } - 源区域上边界 Y 坐标
- **swidth** { [number](dataTypes#number) } - 源区域宽度
- **sheight** { [number](dataTypes#number) } - 源区域高度
- **left** { [number](dataTypes#number) } - 目标左边界 X 坐标
- **top** { [number](dataTypes#number) } - 目标上边界 Y 坐标
- **width** { [number](dataTypes#number) } - 目标宽度
- **height** { [number](dataTypes#number) } - 目标高度
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) | [null](dataTypes#null) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

把源图片的指定像素区域缩放并平移到目标区域.

### drawImage(image, src, dst, paint)

**`Overload 4/6`**

- **image** { [ImageWrapper](imageWrapperType) } - 待绘制图片
- **src** { [AndroidRect](androidRectType) | [null](dataTypes#null) } - 源像素区域, `null` 表示整张图片
- **dst** { [android.graphics.RectF](https://developer.android.com/reference/android/graphics/RectF) } - 浮点目标区域
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) | [null](dataTypes#null) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

### drawImage(image, src, dst, paint)

**`Overload 5/6`**

- **image** { [ImageWrapper](imageWrapperType) } - 待绘制图片
- **src** { [AndroidRect](androidRectType) | [null](dataTypes#null) } - 源像素区域, `null` 表示整张图片
- **dst** { [AndroidRect](androidRectType) } - 整数目标区域
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) | [null](dataTypes#null) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

### drawImage(image, matrix, paint)

**`Overload 6/6`**

- **image** { [ImageWrapper](imageWrapperType) } - 待绘制图片
- **matrix** { [android.graphics.Matrix](https://developer.android.com/reference/android/graphics/Matrix) } - 图片局部变换矩阵
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) | [null](dataTypes#null) } - 画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

使用 `matrix` 变换 ImageWrapper 的 Bitmap 后进行绘制.

## 文本

文本的 `x` 坐标会按 `paint.getTextAlign()` 解释, `y` 坐标表示文本基线,
不是字符外接矩形的顶部. 字号, 字体, 字距和抗锯齿等行为由 Paint 决定.

## [m#] drawText

### drawText(text, index, count, x, y, paint)

**`Overload 1/4`**

- **text** { [JavaArray](dataTypes#javaarray) } - Java `char[]` 字符数组
- **index** { [number](dataTypes#number) } - 首个字符索引
- **count** { [number](dataTypes#number) } - 字符数量
- **x** { [number](dataTypes#number) } - 文本原点 X 坐标
- **y** { [number](dataTypes#number) } - 文本基线 Y 坐标
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 文本画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

### drawText(text, x, y, paint)

**`Overload 2/4`**

- **text** { [string](dataTypes#string) } - 文本
- **x** { [number](dataTypes#number) } - 文本原点 X 坐标
- **y** { [number](dataTypes#number) } - 文本基线 Y 坐标
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 文本画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

绘制完整字符串.

### drawText(text, start, end, x, y, paint)

**`Overload 3/4`**

- **text** { [string](dataTypes#string) } - 文本
- **start** { [number](dataTypes#number) } - 首个字符索引
- **end** { [number](dataTypes#number) } - 结束索引, 不包含此位置
- **x** { [number](dataTypes#number) } - 文本原点 X 坐标
- **y** { [number](dataTypes#number) } - 文本基线 Y 坐标
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 文本画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

### drawText(text, start, end, x, y, paint)

**`Overload 4/4`**

- **text** { [java.lang.CharSequence](https://developer.android.com/reference/java/lang/CharSequence) } - Java 字符序列
- **start** { [number](dataTypes#number) } - 首个字符索引
- **end** { [number](dataTypes#number) } - 结束索引, 不包含此位置
- **x** { [number](dataTypes#number) } - 文本原点 X 坐标
- **y** { [number](dataTypes#number) } - 文本基线 Y 坐标
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 文本画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

## [m#] drawTextRun

### drawTextRun(text, index, count, contextIndex, contextCount, x, y, isRtl, paint)

**`Overload 1/2`**

- **text** { [JavaArray](dataTypes#javaarray) } - Java `char[]` 字符数组
- **index** { [number](dataTypes#number) } - 待绘制文本起始索引
- **count** { [number](dataTypes#number) } - 待绘制字符数量
- **contextIndex** { [number](dataTypes#number) } - 文本塑形上下文起始索引
- **contextCount** { [number](dataTypes#number) } - 上下文字符数量
- **x** { [number](dataTypes#number) } - 文本原点 X 坐标
- **y** { [number](dataTypes#number) } - 文本基线 Y 坐标
- **isRtl** { [boolean](dataTypes#boolean) } - 文本运行方向是否从右向左
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 文本画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

### drawTextRun(text, start, end, contextStart, contextEnd, x, y, isRtl, paint)

**`Overload 2/2`**

- **text** { [java.lang.CharSequence](https://developer.android.com/reference/java/lang/CharSequence) } - Java 字符序列
- **start** { [number](dataTypes#number) } - 待绘制文本起始索引
- **end** { [number](dataTypes#number) } - 待绘制文本结束索引, 不包含此位置
- **contextStart** { [number](dataTypes#number) } - 文本塑形上下文起始索引
- **contextEnd** { [number](dataTypes#number) } - 上下文结束索引, 不包含此位置
- **x** { [number](dataTypes#number) } - 文本原点 X 坐标
- **y** { [number](dataTypes#number) } - 文本基线 Y 坐标
- **isRtl** { [boolean](dataTypes#boolean) } - 文本运行方向是否从右向左
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 文本画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

绘制单一方向的文本运行, 并使用更大范围的文本作为复杂文字塑形上下文.
绘制范围必须完全位于上下文范围内.

## [m#] drawPosText

### drawPosText(text, index, count, pos, paint)

**`DEPRECATED`** **`Overload 1/2`**

- **text** { [JavaArray](dataTypes#javaarray) } - Java `char[]` 字符数组
- **index** { [number](dataTypes#number) } - 首个字符索引
- **count** { [number](dataTypes#number) } - 字符数量
- **pos** { [number](dataTypes#number)[] } - 每个字符的 `[x, y]` 原点数组
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 文本画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

### drawPosText(text, pos, paint)

**`DEPRECATED`** **`Overload 2/2`**

- **text** { [string](dataTypes#string) } - 文本
- **pos** { [number](dataTypes#number)[] } - 每个字符的 `[x, y]` 原点数组
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 文本画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

Android 已弃用逐字符定位文本. 此方法不支持字形组合, 分解, 补充字符或复杂文字.
应使用 `drawText()` 或先构造 Path 再使用 `drawTextOnPath()`.

## [m#] drawTextOnPath

### drawTextOnPath(text, index, count, path, hOffset, vOffset, paint)

**`Overload 1/2`**

- **text** { [JavaArray](dataTypes#javaarray) } - Java `char[]` 字符数组
- **index** { [number](dataTypes#number) } - 首个字符索引
- **count** { [number](dataTypes#number) } - 字符数量
- **path** { [android.graphics.Path](https://developer.android.com/reference/android/graphics/Path) } - 文本基线路径
- **hOffset** { [number](dataTypes#number) } - 沿路径方向的起始偏移
- **vOffset** { [number](dataTypes#number) } - 相对路径的垂直偏移, 负数位于路径上方
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 文本画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

### drawTextOnPath(text, path, hOffset, vOffset, paint)

**`Overload 2/2`**

- **text** { [string](dataTypes#string) } - 文本
- **path** { [android.graphics.Path](https://developer.android.com/reference/android/graphics/Path) } - 文本基线路径
- **hOffset** { [number](dataTypes#number) } - 沿路径方向的起始偏移
- **vOffset** { [number](dataTypes#number) } - 相对路径的垂直偏移, 负数位于路径上方
- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 文本画笔
- <ins>**returns**</ins> { [void](dataTypes#void) }

文本沿 `path` 绘制. Paint 的文本对齐方式决定文本起点相对路径的位置.

## Picture

## [m#] drawPicture

### drawPicture(picture)

**`Overload 1/3`**

- **picture** { [android.graphics.Picture](https://developer.android.com/reference/android/graphics/Picture) } - 待回放的绘制指令
- <ins>**returns**</ins> { [void](dataTypes#void) }

结束 Picture 的录制并回放其内容. 此方法会自行保存和恢复 Canvas 状态.

### drawPicture(picture, dst)

**`Overload 2/3`**

- **picture** { [android.graphics.Picture](https://developer.android.com/reference/android/graphics/Picture) } - 待回放的绘制指令
- **dst** { [android.graphics.RectF](https://developer.android.com/reference/android/graphics/RectF) } - 浮点目标区域
- <ins>**returns**</ins> { [void](dataTypes#void) }

缩放 Picture 以填充目标区域, 并自动保存和恢复 Canvas 状态.

### drawPicture(picture, dst)

**`Overload 3/3`**

- **picture** { [android.graphics.Picture](https://developer.android.com/reference/android/graphics/Picture) } - 待回放的绘制指令
- **dst** { [AndroidRect](androidRectType) } - 整数目标区域
- <ins>**returns**</ins> { [void](dataTypes#void) }

> 参阅:
> [`android.graphics.Canvas`](https://developer.android.com/reference/android/graphics/Canvas)

---

<p style="font: bold 2em sans-serif; color: #FF7043">Paint</p>

---

`Paint` 是 AutoJs6 预先暴露的
[`android.graphics.Paint`](https://developer.android.com/reference/android/graphics/Paint)
类, 不是独立实现的 JavaScript 画笔. 除下述 AutoJs6 适配外, 构造函数,
方法, 属性和常量遵循当前设备 Android Framework 的 Paint API.

## [C] Paint

### [c] ()

**`Overload 1/3`**

- <ins>**returns**</ins> { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 默认画笔

创建使用 Android 默认标志和默认绘制属性的画笔. 默认不会启用抗锯齿.

### [c] (flags)

**`Overload 2/3`**

- **flags** { [number](dataTypes#number) } - Paint 标志位组合
- <ins>**returns**</ins> { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 新画笔

常用标志包括 `Paint.ANTI_ALIAS_FLAG`, `Paint.DITHER_FLAG` 和
`Paint.FILTER_BITMAP_FLAG`. 多个标志使用按位或组合:

```js
let flags = Paint.ANTI_ALIAS_FLAG | Paint.FILTER_BITMAP_FLAG;
let paint = new Paint(flags);
```

### [c] (paint)

**`Overload 3/3`**

- **paint** { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 源画笔
- <ins>**returns**</ins> { [android.graphics.Paint](https://developer.android.com/reference/android/graphics/Paint) } - 配置副本

复制源 Paint 的全部原生配置.

## [p#] color

**`Getter/Setter`** **`[6.7.0]`**

- { [ColorInt](dataTypes#colorint) } - 画笔颜色

属性写入等价于 [`setColor()`](#m-setcolor). Android API 29 及以上系统中的
写入会经过 AutoJs6 Paint 代理, 以消除 Java `int` 与 `long` 重载歧义.

```js
let paint = new Paint();
paint.color = colors.toInt("#2196F3");
console.log(colors.toHex(paint.color)); // #2196F3
```

## [m#] setColor

### setColor(color)

**`[6.7.0]`**

- **color** { [ColorInt](dataTypes#colorint) } - 画笔颜色
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置 Paint 颜色.

Android API 29 增加了 `setColor(long)` ColorLong 重载. Rhino 的 JavaScript
数值没有 `int` 与 `long` 类型区分, 原本可能把 ColorInt 错误分派到 ColorLong
重载. AutoJs6 6.7.0 及以上版本在 Android API 29 及以上系统中使用
`PaintProxyObject` 拦截此方法:

- 可表示为有符号 32 位整数的数值按 ColorInt 处理.
- 具有 ColorLong 高位信息的数值保留 ColorLong 语义.
- 非数值参数在代理路径中通过 AutoJs6 颜色转换器处理.
- 代理只适配 `setColor` 和 `color` 属性写入, 其他 Paint 成员仍委托原对象.

为保证 Android API 24 至 28 与更高版本行为一致, 跨版本脚本应传入
`colors.toInt(color)` 的结果:

```js
paint.setColor(colors.toInt("deep-orange"));
```

直接使用大于 `0x7FFFFFFF` 的无符号颜色字面量可能被识别为 ColorLong.
需要 ColorInt 时应先调用 `colors.toInt()`.

## [m#] setARGB

### setARGB(a, r, g, b)

- **a** { [number](dataTypes#number) } - Alpha 通道, 期望范围 `[0..255]`
- **r** { [number](dataTypes#number) } - 红色通道, 期望范围 `[0..255]`
- **g** { [number](dataTypes#number) } - 绿色通道, 期望范围 `[0..255]`
- **b** { [number](dataTypes#number) } - 蓝色通道, 期望范围 `[0..255]`
- <ins>**returns**</ins> { [void](dataTypes#void) }

使用 4 个颜色通道设置 Paint 颜色. 此原生 Android 方法不存在 ColorInt 与
ColorLong 重载歧义. Android 不检查通道范围; 超出 `[0..255]` 时结果未定义.

## 常用 Paint 配置

下列成员均来自 Android Paint, 并非 Canvas 包装层额外实现:

| 成员 | 作用 |
| --- | --- |
| `setStyle(Paint.Style)` | 设置 `FILL`, `STROKE` 或 `FILL_AND_STROKE` |
| `setStrokeWidth(number)` | 设置描边宽度 |
| `setStrokeCap(Paint.Cap)` | 设置线端样式 |
| `setStrokeJoin(Paint.Join)` | 设置线段连接样式 |
| `setAntiAlias(boolean)` | 设置抗锯齿 |
| `setAlpha(number)` | 设置画笔整体 Alpha |
| `setTextSize(number)` | 设置文字大小 |
| `setTextAlign(Paint.Align)` | 设置文字原点对齐方式 |
| `setTypeface(Typeface)` | 设置字体 |
| `setShader(Shader)` | 设置着色器 |
| `setColorFilter(ColorFilter)` | 设置颜色过滤器 |
| `setMaskFilter(MaskFilter)` | 设置遮罩过滤器 |
| `setPathEffect(PathEffect)` | 设置路径效果 |
| `setXfermode(Xfermode)` | 设置旧式像素合成对象 |

> 参阅:
> [`android.graphics.Paint`](https://developer.android.com/reference/android/graphics/Paint)

## 矩阵, 路径与绘制效果

历史页面把变换矩阵, 路径, Porter-Duff, 着色器及多类过滤器列为空标题.
这些对象实际来自 Android Framework, 不由 AutoJs6 Canvas 模块重新定义.

- [Matrix](https://developer.android.com/reference/android/graphics/Matrix) 用于平移,
  缩放, 旋转, 错切和透视变换. 使用 `new android.graphics.Matrix()` 创建.
- [Path](https://developer.android.com/reference/android/graphics/Path) 用于组合直线,
  曲线, 圆弧和闭合轮廓. 使用 `new android.graphics.Path()` 创建.
- [PorterDuff.Mode](https://developer.android.com/reference/android/graphics/PorterDuff.Mode)
  用于 `drawColor(color, mode)`. 旧式 Paint 合成可使用
  [PorterDuffXfermode](https://developer.android.com/reference/android/graphics/PorterDuffXfermode).
- [Shader](https://developer.android.com/reference/android/graphics/Shader) 的常见实现包括
  `LinearGradient`, `RadialGradient`, `SweepGradient`, `BitmapShader` 和
  `ComposeShader`.
- [MaskFilter](https://developer.android.com/reference/android/graphics/MaskFilter) 的实现包括
  `BlurMaskFilter` 和 `EmbossMaskFilter`.
- [ColorFilter](https://developer.android.com/reference/android/graphics/ColorFilter) 的实现包括
  `ColorMatrixColorFilter`, `LightingColorFilter` 和 `PorterDuffColorFilter`.
- [PathEffect](https://developer.android.com/reference/android/graphics/PathEffect) 的实现包括
  `CornerPathEffect`, `DashPathEffect`, `DiscretePathEffect`,
  `PathDashPathEffect`, `ComposePathEffect` 和 `SumPathEffect`.
- [Region](https://developer.android.com/reference/android/graphics/Region) 及其 `Op`
  枚举用于旧式裁剪重载. Android API 28 及以上仅允许裁剪收缩操作.

这些类未全部注册为全局类. 例如:

```js
let path = new android.graphics.Path();
path.moveTo(20, 180);
path.quadTo(200, 20, 380, 180);

let effect = new android.graphics.DashPathEffect([20, 10], 0);
paint.setStyle(Paint.Style.STROKE);
paint.setStrokeWidth(6);
paint.setPathEffect(effect);
canvas.drawPath(path, paint);
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">JsCanvasView</p>

---

本节只记录 UI `<canvas>` 相对普通 `TextureView` 增加的绘制接口.
通用 UI 属性和 View 方法由 [UI](ui) 章节说明.

## [m#] on

### on("draw", listener)

**`UI`**

- **listener** { [Function](dataTypes#function) } - 绘制监听器, 形式为 `(canvas, view) => void`
- <ins>**returns**</ins> { [EventEmitter](eventEmitterType) } - 控件内部事件发射器

注册每帧绘制监听器. `listener` 接收以下参数:

- **canvas** { [Canvas](#c-canvas) } - 已绑定当前 Surface 的画布
- **view** { [android.view.TextureView](https://developer.android.com/reference/android/view/TextureView) } - 当前 JsCanvasView

Canvas 控件还直接委托 `once`, `addListener`, `prependListener`,
`prependOnceListener`, `removeListener`, `removeAllListeners`, `eventNames`,
`listenerCount`, `listeners`, `emit`, `setMaxListeners` 和 `maxListeners`
等 EventEmitter 成员. 绘制循环应使用 `on("draw", listener)`.

## [m#] setMaxFps

### setMaxFps(maxFps)

**`UI`** **`[6.7.0]`**

- **maxFps** { [number](dataTypes#number) } - 期望的最大每秒绘制次数
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置绘制循环的最短帧间隔. 默认值为 30 FPS. 正整数使用
`1000 / maxFps` 的整数毫秒结果作为目标间隔; 实际帧率还受监听器耗时,
线程调度和 Surface 状态影响.

`maxFps <= 0` 时不主动等待下一帧, 并不表示暂停绘制. 要停止可见区域的绘制,
应通过 UI 生命周期隐藏或移除控件.

AutoJs6 6.7.0 修正了此方法的帧间隔计算.
