# 包装图像类 (ImageWrapper)

`ImageWrapper` 是 AutoJs6 图像数据的包装类. [`images`](image), [`ocr`](ocr) 和 [`canvas`](canvas) 等模块使用它传递位图, OpenCV 矩阵或屏幕捕获数据.

通常应通过 `images.read()`, `images.captureScreen()` 或其他模块方法取得实例. `ImageWrapper` 的公开构造方法和 `ofBitmap()` 等工厂方法需要内部 `ScriptRuntime`, 不属于普通脚本的便捷构造接口.

```js
let image = images.read("./picture.jpg");
if (image !== null) {
    try {
        console.log(`${image.width} x ${image.height}`);
    } finally {
        image.recycle();
    }
}
```

除 [`images.captureScreen()`](image#m-images-capturescreen) 返回的受截图模块管理的图片外, 不再使用的实例应及时调用 [`recycle()`](#m-recycle). 回收后访问像素数据, 尺寸或内部载体会抛出异常.

---

<p style="font: bold 2em sans-serif; color: #FF7043">ImageWrapper</p>

---

## 属性

### [p#] width

**`Getter`** **`READONLY`**

- { [number](dataTypes#number) } - 图片宽度

也可通过 JVM getter `getWidth()` 读取.

### [p#] height

**`Getter`** **`READONLY`**

- { [number](dataTypes#number) } - 图片高度

也可通过 JVM getter `getHeight()` 读取.

### [p#] size

**`Getter`** **`READONLY`**

- { [OpenCVSize](opencvSizeType) } - 图片尺寸

也可通过 JVM getter `getSize()` 读取.

### [p#] bitmap

**`Getter`** **`READONLY`**

- { [android.graphics.Bitmap](https://developer.android.com/reference/android/graphics/Bitmap) } - Android 位图

也可通过 `getBitmap()` 读取. 若实例当前仅持有 OpenCV 矩阵, 首次访问会按需初始化 OpenCV, 转换位图并缓存结果.

### [p#] mat

**`Getter`** **`READONLY`**

- { [Mat](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Mat.html) } - AutoJs6 OpenCV 矩阵

也可通过 `getMat()` 读取. 若实例当前仅持有位图, 首次访问会按需初始化 OpenCV, 转换矩阵并缓存结果.

返回的矩阵由当前 `ImageWrapper` 管理. 回收图片时矩阵也会释放, 不应独立释放或在图片回收后继续使用.

### [p#] bgrMat

**`Getter`** **`READONLY`**

- { [Mat](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Mat.html) } - 去除透明通道的矩阵

也可通过 `getBgrMat()` 读取. 首次访问会去除 `mat` 的透明通道 (4 通道转为 3 通道) 并缓存结果, 灰度图和 3 通道图直接返回 `mat` 本身. 该矩阵与图片一起回收.

### [p#] plane

**`Getter`** **`READONLY`**

- { [android.media.Image.Plane](https://developer.android.com/reference/android/media/Image.Plane) | [null](dataTypes#null) }

也可通过 `getPlane()` 读取. 当前屏幕捕获路径会立即复制像素并关闭原始 `android.media.Image`, 因此此属性通常为 `null`.

## 保存与像素

### [m#] saveTo(path)

- **path** { [string](dataTypes#string) } - 保存路径
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否保存成功

按当前脚本运行路径解析相对路径, 并按需创建父目录. 已有文件会被覆盖.

若实例只有 OpenCV 矩阵, 使用 OpenCV `imwrite` 保存, 编码格式由文件扩展名决定, 3 通道和 4 通道矩阵按 RGB(A) 顺序写入 (与位图一致). 否则以 PNG, 质量 `100` 保存位图数据, 即使路径使用其他扩展名.

无法创建父目录时抛出异常. 位图写入失败通常返回 `false`; OpenCV 写入结果直接作为返回值.

```js
let image = images.read("./picture.jpg");
if (image !== null) {
    try {
        image.saveTo("./output/picture.png");
    } finally {
        image.recycle();
    }
}
```

需要明确指定格式和质量时, 使用 [`images.save()`](image#m-images-save-image-path-format-qualityoroptions).

### [m#] pixel(x, y)

- **x** { [number](dataTypes#number) } - 横坐标
- **y** { [number](dataTypes#number) } - 纵坐标
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) } - ARGB 颜色整数

坐标原点位于左上角. 坐标越界时抛出异常.

单通道矩阵会返回不透明灰度色, 3 通道矩阵会返回不透明 RGB 色, 4 个或更多通道按 RGBA 的前 4 个通道转换为 ARGB.

## 生命周期

### [m#] recycle()

- <ins>**returns**</ins> { [void](dataTypes#void) }

立即回收位图, OpenCV 矩阵和屏幕捕获资源. 重复调用是安全的.

回收后, `isRecycled()` 返回 `true`. 除资源状态方法外, 再次访问图片会抛出 "image has been recycled" 异常.

### [m#] isRecycled()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否已回收

返回当前资源状态, 不会访问已释放的像素数据.

### [m#] ensureNotRecycled()

- <ins>**returns**</ins> { [void](dataTypes#void) }

检查对象是否仍可使用. 已回收时抛出异常.

### [m#] setOneShot(enabled)

- **enabled** { [boolean](dataTypes#boolean) } - 是否标记为一次性对象
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) } - 当前对象

一次性对象被支持 `Shootable` 语义的图像方法使用后会自动回收. 普通脚本通常无需直接使用此机制.

### [m#] oneShot()

**`6.2.0`**

- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) } - 当前对象

等价于 `setOneShot(true)`.

```js
let color = images.pixel(images.read("./picture.png").oneShot(), 0, 0);
```

上述临时图片会在 `images.pixel()` 完成后自动回收.

### [m#] shoot()

- <ins>**returns**</ins> { [void](dataTypes#void) }

若对象已标记为一次性对象, 则调用 `recycle()`. 否则不执行操作. 此方法主要供图像模块内部使用.

## 复制

### [m#] clone()

- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) } - 独立的新图片

深拷贝当前图片. 新图片具有独立的像素存储和生命周期, 回收任一对象不会回收另一个对象.

也可使用 [`images.copy()`](image#m-images-copy-image).
