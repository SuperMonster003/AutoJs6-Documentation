# 图像 (Images)

`images` 模块提供图像读取, 编解码, 截图, 图像处理, 找色, 找图, 特征匹配和相似度计算等功能.

从 AutoJs6 6.8.0 起, 依赖 OpenCV 的方法需要外部 OpenCV 插件. 调用这些方法前, 需在插件中心安装, 启用并授权兼容插件. 插件不可用时, 方法将抛出插件加载异常.

本页多数名为 **image** 的参数同时接受 [ImageWrapper](imageWrapperType) 和图片路径 [string](dataTypes#string). 路径会按当前脚本的运行路径解析. 方法内部读取的临时图片会自动回收, 传入的普通 `ImageWrapper` 则不会自动回收, 除非它已通过 `oneShot()` 标记为一次性对象.

除 `captureScreen()` 返回的受截图模块管理的图片外, 不再使用的 `ImageWrapper` 应及时调用 [`recycle()`](imageWrapperType#m-recycle).

## OpenCV 与区域

### [m] images.initOpenCvIfNeeded()

**`6.8.0`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

按需初始化 OpenCV 运行环境. 依赖 OpenCV 的图像方法通常会自动调用此方法.

### [m] images.buildRegion(image, region)

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) } - 图片对象或图片路径
- **region** { [number](dataTypes#number)[] | [AndroidRect](androidRectType) | [OpenCVRect](opencvRectType) | [null](dataTypes#null) | [undefined](dataTypes#undefined) }
- <ins>**returns**</ins> { [OpenCVRect](opencvRectType) } - 规范化后的区域

将区域限制在图片范围内. 数组格式为 `[ x, y, width, height ]`. `x` 和 `y` 默认为 `0`, `width` 和 `height` 默认延伸到图片边缘. 坐标和尺寸也支持屏幕度量值, 详见 [ScreenMetricNumberX](dataTypes#screenmetricnumberx) 和 [ScreenMetricNumberY](dataTypes#screenmetricnumbery).

负数, 反向尺寸或越界区域会抛出异常.

### [m] images.__buildRegion(region?, imageWidth?, imageHeight?)

**`6.8.0`**

- **[ region ]** { [number](dataTypes#number)[] | [AndroidRect](androidRectType) | [OpenCVRect](opencvRectType) }
- **[ imageWidth ]** { [number](dataTypes#number) } - 图片宽度
- **[ imageHeight ]** { [number](dataTypes#number) } - 图片高度
- <ins>**returns**</ins> { [OpenCVRect](opencvRectType) | [null](dataTypes#null) } - 规范化后的区域, 或 `null`

> 注: `__buildRegion` 是供模块桥接层使用的内部兼容辅助成员, 不属于稳定公共 API. 普通脚本应使用 [images.buildRegion(image, region)](#m-images-buildregion-image-region).

按明确的图片尺寸规范化区域. `imageWidth` 或 `imageHeight` 缺失时返回 `null`. 此方法不解析屏幕度量比例值.

## 读取与编解码

### [m] images.read(path, isStrict?)

- **path** { [string](dataTypes#string) } - 图片路径
- **[ isStrict = false ]** { [boolean](dataTypes#boolean) } - 是否在读取失败时抛出异常
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) | [null](dataTypes#null) } - 解码后的图片, 或 `null`

读取本地图片. 当图片不存在或无法解码时, 默认返回 `null`; `isStrict` 为 `true` 时抛出异常.

### [m] images.imread(path)

**`6.6.0`**

- **path** { [string](dataTypes#string) } - 图片路径
- <ins>**returns**</ins> { [Mat](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Mat.html) } - OpenCV 矩阵

使用 OpenCV 读取本地图片. 读取失败时可能返回空矩阵, 可使用 `Mat#empty()` 检查.

### [m] images.load(src)

- **src** { [string](dataTypes#string) } - 图片 URL
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) | [null](dataTypes#null) } - 下载并解码的图片

同步加载网络图片. 网络失败时抛出异常, 无法取得有效位图时可能返回 `null`.

### [m] images.loadAsync(src)

**`6.7.0`** **`Async`**

- **src** { [string](dataTypes#string) } - 图片 URL
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [ImageWrapper](imageWrapperType) 或 [null](dataTypes#null)

异步加载网络图片. 网络或解码失败时 Promise 被拒绝.

```js
images.loadAsync("https://example.com/picture.png").then((image) => {
    try {
        console.log(image.size);
    } finally {
        image.recycle();
    }
});
```

<span id="m-images-copy-image"></span>

### [m] images.copy(image)

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) } - 深拷贝后的新图片

复制像素数据并返回具有独立生命周期的新图片.

### [m] images.fromBase64(base64)

- **base64** { [string](dataTypes#string) } - Base64 图片数据
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) } - 解码后的图片

输入无法解码为图片时抛出异常.

### [m] images.toBase64(image, format?, quality?)

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **[ format = "png" ]** { [string](dataTypes#string) } - 编码格式
- **[ quality = 100 ]** { [number](dataTypes#number) } - `0` 至 `100` 的编码质量
- <ins>**returns**</ins> { [string](dataTypes#string) } - 不含换行的 Base64 数据

### [m] images.fromBytes(bytes)

- **bytes** { [JsByteArray](dataTypes#jsbytearray) | [ByteArray](dataTypes#bytearray) }
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) } - 解码后的图片

<span id="m-images-tobytes-image-format-quality"></span>

### [m] images.toBytes(image, format?, quality?)

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **[ format = "png" ]** { [string](dataTypes#string) }
- **[ quality = 100 ]** { [number](dataTypes#number) } - `0` 至 `100` 的编码质量
- <ins>**returns**</ins> { [ByteArray](dataTypes#bytearray) } - 编码后的 Java 字节数组

`toBase64()` 和 `toBytes()` 支持 `png`, `jpg`, `jpeg`, `webp`, `webp_lossy`, `webp-lossy`, `webp_lossless` 和 `webp-lossless`. 后 4 种显式 WebP 模式要求 Android API 30 或更高.

### [m] images.readPixels(image)

**`[6.8.0]`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) } - 图片或图片路径
- <ins>**returns**</ins> {{
    - data: [JavaArray](dataTypes#javaarray)\<[number](dataTypes#number)\>;
    - width: [number](dataTypes#number);
    - height: [number](dataTypes#number);
- }}

读取图片的全部 ARGB 像素. `data` 按从左到右, 从上到下的顺序排列, 长度为 `width * height`.

传入路径时, 读取的临时图片在返回前自动回收; 传入 [ImageWrapper](imageWrapperType) 时, 图片保持可用, 由调用方负责回收.

```js
let img = images.captureScreen();
let { data, width, height } = images.readPixels(img);
console.log(colors.toHex(data[10 * width + 20])); /* 坐标 (20, 10) 处的像素. */
img.recycle();
```

### [m] images.matToImage(mat)

- **mat** { [Mat](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Mat.html) }
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) }

使用矩阵创建包装图片. 返回对象接管矩阵数据的生命周期, 不应再独立释放同一矩阵.

## 保存与压缩

从 AutoJs6 6.8.0 起, 本节方法可使用外置 Image Quantization 插件执行有损调色板量化. 调用前需在插件中心安装, 启用并授权兼容插件.

数字 `quality` 保持原有行为: `format` 为 `"png"` 且规范化后的 `quality` 不为 `100` 时使用插件; PNG 质量为 `100` 以及其他图片格式不使用插件. 也可将 [`PngQuantizationOptions`](#pngquantizationoptions) 对象作为最后一个参数, 显式控制颜色数, 速度, 质量区间, 抖动, posterize 和 alpha. 选项对象仅支持 PNG, 并且无论质量值为何都会执行量化.

插件未安装, 被禁用, 未授权, 与当前 AutoJs6 或设备 ABI 不兼容, 或原生运行时加载失败时, 方法会抛出插件加载异常. 使用选项对象要求插件声明 options API version 1 或更高; [`images.quantize()`](#m-images-quantize-image-options) 的结果指标要求 version 2 或更高; [`images.quantizeToFile()`](#m-images-quantizetofile-image-path-options) 和 `preserveAlpha=false` 要求 version 3 或更高; 资源预算与取消要求 version 4 或更高. 旧插件仍可继续使用其支持的数字或具名参数路径, 但调用更高版本能力时会抛出可捕获的能力不支持异常.

`images.compress(image)` 和 `images.compressToBytes(image)` 的默认参数为 `"png"` 和 `60`, 因而省略 `format` 与 `quality` 时也依赖 Image Quantization 插件. `images.save(image, path)` 默认使用 PNG 质量 `100`, 不依赖此插件.

### PngQuantizationOptions

**`6.8.0`**

- **[ quality ]** { [number](dataTypes#number) } - 兼容数字 `quality` 的严格模式快捷值; 显式提供时同时作为 `minQuality` 与 `maxQuality` 的默认值
- **[ maxColors = 256 ]** { [number](dataTypes#number) } - 最大调色板颜色数, 原生边界钳制到 `2..256`
- **[ speed = 8 ]** { [number](dataTypes#number) } - 量化速度等级, 原生边界钳制到 `1..10`; 数值越小通常质量越高但耗时越长
- **[ minQuality = 0 ]** { [number](dataTypes#number) } - 最低质量, 原生边界钳制到 `0..100`; 显式提供 `quality` 时默认改用该值
- **[ maxQuality = quality ]** { [number](dataTypes#number) } - 最高质量, 原生边界钳制到 `0..100`; `quality` 省略时使用调用方法的默认质量
- **[ ditheringLevel = 0 ]** { [number](dataTypes#number) } - 抖动强度, 有限值在原生边界钳制到 `0..1`
- **[ posterizeBits = 0 ]** { [number](dataTypes#number) } - 最小 posterization 位数, 原生边界钳制到 `0..4`; `0` 表示关闭
- **[ preserveAlpha = true ]** { [boolean](dataTypes#boolean) } - 是否保留 alpha 通道; `false` 生成完全不透明且不含 `tRNS` 块的 PNG, 并要求 options API version 3
- **[ maxPixels = 16000000 ]** { [number](dataTypes#number) } - 允许的最大输入像素数, 必须大于 `0`; 显式设置时要求 options API version 4
- **[ maxMemoryBytes = 268435456 ]** { [number](dataTypes#number) } - 允许量化过程使用的最大附加工作内存字节数, 必须大于 `0`; 显式设置时要求 options API version 4

省略 `quality` 和 `minQuality` 时采用尽力而为策略 (`minQuality = 0`), 因而无法达到目标上限时仍返回当前颜色预算下的结果. `maxQuality` 在 `images.save()` 和 `images.quantize()` 中默认为 `100`, 在 `images.compress()` 与 `images.compressToBytes()` 中默认为 `60`. 显式提供 `quality` 会恢复严格的 `minQuality == maxQuality == quality` 语义; 也可仅显式设置 `minQuality` 建立自定义下限.

求值后的 `minQuality` 大于 `maxQuality` 时抛出参数异常; `ditheringLevel` 为 `NaN` 或无穷大时也抛出参数异常. 颜色预算无法满足显式质量下限时抛出 `PngQuantBridge.QualityTooLowException`, 其 `code` 为 `"PNG_QUANTIZATION_QUALITY_TOO_LOW"`; 这与 I/O 或原生内部失败相互独立.

options API version 3 会通过 Android 平台将 `ARGB_8888`, `RGB_565`, `ALPHA_8`, `RGBA_F16`, 带色域和硬件 Bitmap 自动归一化为非预乘 sRGB RGBA, 调用方无需预先转换配置. libimagequant 使用 gamma `0.0` 所代表的 sRGB 默认传递值 `0.45455`, 输出 PNG 显式包含 `sRGB` 块. `preserveAlpha=true` 时按调色板透明度写入 `tRNS`; 设为 `false` 时所有像素强制不透明.

options API version 4 对数字质量和具名选项路径默认应用 `16000000` 像素与 `256 MiB` 附加工作内存上限. 内存预算覆盖量化调用新建的像素转换缓冲, libimagequant 数据, 索引行, libpng 编码状态及返回字节数组, 不包含调用前已经存在的输入 Bitmap 和宿主其他内存. 超过像素或内存预算时抛出 `PngQuantBridge.ResourceLimitException`, 其 `code` 为 `"PNG_QUANTIZATION_RESOURCE_LIMIT"`; `reason` 为 `"PIXEL_LIMIT"`, `"MEMORY_LIMIT"` 或 `"ALLOCATION_FAILED"`, 并可读取 `actualPixels`, `maxPixels`, `requiredMemoryBytes` 与 `maxMemoryBytes`. 停止脚本时, 宿主会取消该脚本仍在执行的 v4 量化并按脚本中断处理.

### PngQuantizationResult

**`6.8.0`**

- **bytes** { [ByteArray](dataTypes#bytearray) } - 编码后的索引色 PNG 字节
- **size** { [number](dataTypes#number) } - `bytes.length`
- **quality** { [number](dataTypes#number) } - libimagequant 测得的实际质量, 范围为 `0..100`, 数值越高表示质量越好
- **quantizationError** { [number](dataTypes#number) } - 标准化均方误差 (MSE), 数值越低表示调色板误差越小, `0` 表示无误差
- **peakWorkingMemoryBytes** { [number](dataTypes#number) } - v4 统计的峰值附加工作内存字节数; 旧版插件返回 `-1`

### PngQuantizationFileResult

**`6.8.0`**

- **path** { [string](dataTypes#string) } - 解析后的输出路径
- **size** { [number](dataTypes#number) } - 已写入的 PNG 字节数
- **quality** { [number](dataTypes#number) } - libimagequant 测得的实际质量, 范围为 `0..100`, 数值越高表示质量越好
- **quantizationError** { [number](dataTypes#number) } - 标准化均方误差 (MSE), 数值越低表示调色板误差越小, `0` 表示无误差
- **peakWorkingMemoryBytes** { [number](dataTypes#number) } - v4 统计的峰值附加工作内存字节数; 旧版插件返回 `-1`

<span id="m-images-quantize-image-options"></span>

### [m] images.quantize(image, options?)

**`[6.8.0]`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **[ options ]** { [PngQuantizationOptions](#pngquantizationoptions) }
- <ins>**returns**</ins> { [PngQuantizationResult](#pngquantizationresult) }

将图片量化为索引色 PNG, 同时返回编码字节, 实际质量和量化误差. 此方法要求插件声明 options API version 2 或更高. 其他保存与压缩方法保持原返回类型; 需要根据质量或输出体积决定是否替换原图时应使用本方法.

```js
let sourcePath = files.path("./source.png");
let outputPath = files.path("./quantized.png");
let result = images.quantize(images.read(sourcePath), {
    maxColors: 64,
    speed: 3,
    maxQuality: 90,
    ditheringLevel: 0.5,
});

console.log("quality=" + result.quality);
console.log("mse=" + result.quantizationError);
console.log("bytes=" + result.size);

if (result.quality >= 70 && result.size < new java.io.File(sourcePath).length()) {
    files.writeBytes(outputPath, result.bytes);
}
```

显式严格下限可用专用异常区分:

```js
try {
    images.quantize(image, {
        maxColors: 2,
        minQuality: 100,
        maxQuality: 100,
    });
} catch (e) {
    if (e.javaException instanceof org.autojs.autojs.runtime.api.PngQuantBridge.QualityTooLowException) {
        console.warn(e.javaException.code);
    } else {
        throw e;
    }
}
```

<span id="m-images-quantizetofile-image-path-options"></span>

### [m] images.quantizeToFile(image, path, options?)

**`[6.8.0]`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **path** { [string](dataTypes#string) } - 输出 PNG 路径
- **[ options ]** { [PngQuantizationOptions](#pngquantizationoptions) }
- <ins>**returns**</ins> { [PngQuantizationFileResult](#pngquantizationfileresult) }

将图片量化为索引色 PNG 并直接写入文件, 同时返回解析后的路径, 输出大小, 实际质量和量化误差. 此方法要求插件声明 options API version 3 或更高. 父目录不存在时会自动创建, 已有文件会被覆盖; 文件创建或写入失败时抛出 I/O 异常.

编码阶段由 libpng 直接写入文件描述符, 不构造完整 PNG `byte[]`, 因而适合不需要在脚本内持有编码字节的输出流程. 量化过程仍需要保存输入 RGBA 像素, 索引像素和调色板等工作数据, 此方法不等同于恒定内存编码.

```js
let result = images.quantizeToFile("./source.png", "./quantized.png", {
    maxColors: 64,
    speed: 3,
    maxQuality: 90,
    preserveAlpha: true,
});

console.log("path=" + result.path);
console.log("quality=" + result.quality);
console.log("mse=" + result.quantizationError);
console.log("bytes=" + result.size);
```

<span id="m-images-save-image-path-format-quality"></span>

### [m] images.save(image, path, format?, qualityOrOptions?)

**`[6.6.3]`** **`[6.8.0]`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **path** { [string](dataTypes#string) } - 保存路径
- **[ format = "png" ]** { [string](dataTypes#string) }
- **[ qualityOrOptions = 100 ]** { [number](dataTypes#number) | [PngQuantizationOptions](#pngquantizationoptions) } - 编码质量或 PNG 量化选项
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否保存成功

保存图片并按需创建父目录. 已有文件会被覆盖. 支持的格式与 [`toBytes()`](#m-images-tobytes-image-format-quality) 相同.

PNG 的数字 `quality` 不为 `100` 或最后一个参数为选项对象时, 会使用上述外置插件执行有损量化. Android API 30 或更高版本的 `webp_lossless` 只接受数字质量 `100`; 其他格式不接受量化选项对象. 文件写入或父目录创建失败时抛出 I/O 异常.

### [m] images.saveImage(image, path, format?, qualityOrOptions?)

**`[6.6.3]`** **`[6.8.0]`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **path** { [string](dataTypes#string) }
- **[ format = "png" ]** { [string](dataTypes#string) }
- **[ qualityOrOptions = 100 ]** { [number](dataTypes#number) | [PngQuantizationOptions](#pngquantizationoptions) }
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

`images.save()` 的别名.

### [m] images.compress(image, format?, qualityOrOptions?)

**`[6.6.3]`** **`[6.8.0]`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **[ format = "png" ]** { [string](dataTypes#string) }
- **[ qualityOrOptions = 60 ]** { [number](dataTypes#number) | [PngQuantizationOptions](#pngquantizationoptions) } - 编码质量或 PNG 量化选项
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) } - 重新编码并解码后的图片

压缩会改变编码体积或质量, 但不会按比例缩小图片尺寸. 默认 PNG 质量为 `60`, 因此仅传入 `image` 时会加载 Image Quantization 插件. 量化或编码后的数据无法解码为图片时抛出异常.

若要降低解码分辨率和内存占用, 使用 [`downsample()`](#m-images-downsample-src-reqwidth-reqheight-withalpha).

### [m] images.compressToBytes(image, format?, qualityOrOptions?)

**`6.6.3`** **`[6.8.0]`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **[ format = "png" ]** { [string](dataTypes#string) }
- **[ qualityOrOptions = 60 ]** { [number](dataTypes#number) | [PngQuantizationOptions](#pngquantizationoptions) } - 编码质量或 PNG 量化选项
- <ins>**returns**</ins> { [ByteArray](dataTypes#bytearray) } - 压缩后的 Java 字节数组

默认 PNG 质量为 `60`, 因此仅传入 `image` 时会加载 Image Quantization 插件.

```js
let bytes = images.compressToBytes(image, "png", {
    maxColors: 64,
    speed: 3,
    minQuality: 50,
    maxQuality: 90,
    ditheringLevel: 0.5,
    posterizeBits: 0,
});
```

<span id="m-images-downsample-src-reqwidth-reqheight-withalpha"></span>

### [m] images.downsample(src, reqWidth, reqHeight, withAlpha?)

**`6.6.3`**

- **src** { [ByteArray](dataTypes#bytearray) | [string](dataTypes#string) | [java.net.URL](https://docs.oracle.com/javase/8/docs/api/java/net/URL.html) | [android.net.Uri](https://developer.android.com/reference/android/net/Uri) | [android.graphics.Bitmap](https://developer.android.com/reference/android/graphics/Bitmap) | [ImageWrapper](imageWrapperType) } - 图片来源
- **reqWidth** { [number](dataTypes#number) } - 目标宽度
- **reqHeight** { [number](dataTypes#number) } - 目标高度
- **[ withAlpha = true ]** { [boolean](dataTypes#boolean) } - 是否保留透明通道
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) } - 降采样后的图片

字符串可为运行时文件路径或 URI. 此方法在解码阶段选择采样尺寸, 适合降低大图的解码内存.

### [m] images.getSize(src)

- **src** { [ImageWrapper](imageWrapperType) | [Mat](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Mat.html) | [android.graphics.Bitmap](https://developer.android.com/reference/android/graphics/Bitmap) | [string](dataTypes#string) }
- <ins>**returns**</ins> { [OpenCVSize](opencvSizeType) }

图片路径只读取边界信息, 不解码完整位图.

### [m] images.getWidth(src)

- **src** { [ImageWrapper](imageWrapperType) | [Mat](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Mat.html) | [android.graphics.Bitmap](https://developer.android.com/reference/android/graphics/Bitmap) | [string](dataTypes#string) }
- <ins>**returns**</ins> { [number](dataTypes#number) } - 图片宽度

### [m] images.getHeight(src)

- **src** { [ImageWrapper](imageWrapperType) | [Mat](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Mat.html) | [android.graphics.Bitmap](https://developer.android.com/reference/android/graphics/Bitmap) | [string](dataTypes#string) }
- <ins>**returns**</ins> { [number](dataTypes#number) } - 图片高度

## 图像处理

<span id="m-clip"></span>
<span id="image_m_clip"></span>

### [m] images.clip(image, region)

**`Overload 1/2`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **region** { [number](dataTypes#number)[] | [AndroidRect](androidRectType) | [OpenCVRect](opencvRectType) }
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) } - 剪切后的新图片

### [m] images.clip(image, x, y, width, height)

**`Overload 2/2`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **x** { [number](dataTypes#number) }
- **y** { [number](dataTypes#number) }
- **width** { [number](dataTypes#number) }
- **height** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) } - 剪切后的新图片

### [m] images.pixel(image, x, y)

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **x** { [number](dataTypes#number) } - 横坐标
- **y** { [number](dataTypes#number) } - 纵坐标
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) } - ARGB 颜色整数

坐标超出图片范围时抛出异常.

### [m] images.invert(image)

**`6.6.0`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) } - 反色后的新图片

反转 RGB 通道并保留原透明通道.

### [m] images.grayscale(image, dstCn?)

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **[ dstCn ]** { [number](dataTypes#number) } - 目标通道数
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) } - 灰度化后的新图片

等价于使用颜色转换代码 `BGR2GRAY` 调用 [`cvtColor()`](#m-images-cvtcolor-image-code-dstcn).

### [m] images.isGrayscale(image)

**`6.6.0`**

- **image** { [ImageWrapper](imageWrapperType) | [Mat](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Mat.html) | [string](dataTypes#string) }
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否为灰度图

单通道矩阵直接视为灰度图. 多通道矩阵仅当每个像素的各通道值均相同时返回 `true`.

### [m] images.threshold(image, threshold, maxVal, type?)

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **threshold** { [number](dataTypes#number) } - 阈值
- **maxVal** { [number](dataTypes#number) } - 最大值
- **[ type = "BINARY" ]** { [string](dataTypes#string) | [number](dataTypes#number) } - OpenCV 阈值类型
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) }

字符串类型可省略 `THRESH_` 前缀, 并忽略大小写.

### [m] images.inRange(image, lowerBound, upperBound)

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **lowerBound** { [ColorInt](dataTypes#colorint) | [ColorHex](dataTypes#colorhex) | [ColorName](dataTypes#colorname) }
- **upperBound** { [ColorInt](dataTypes#colorint) | [ColorHex](dataTypes#colorhex) | [ColorName](dataTypes#colorname) }
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) } - 二值化后的新图片

保留各通道均位于指定闭区间内的像素.

### [m] images.interval(image, color, threshold)

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **color** { [ColorInt](dataTypes#colorint) | [ColorHex](dataTypes#colorhex) | [ColorName](dataTypes#colorname) }
- **threshold** { [number](dataTypes#number) } - 每个颜色通道的容差, 限制在 `0` 至 `255`
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) } - 二值化后的新图片

### [m] images.adaptiveThreshold(image, maxValue, adaptiveMethod, thresholdType, blockSize, C)

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **maxValue** { [number](dataTypes#number) }
- **adaptiveMethod** { [string](dataTypes#string) } - `MEAN_C` 或 `GAUSSIAN_C`
- **thresholdType** { [string](dataTypes#string) } - `BINARY` 或 `BINARY_INV`
- **blockSize** { [number](dataTypes#number) } - 邻域尺寸
- **C** { [number](dataTypes#number) } - 从邻域结果中减去的常量
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) }

`adaptiveMethod` 和 `thresholdType` 不带 OpenCV 常量前缀.

### [m] images.blur(image, size, anchor?, type?)

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **size** { [number](dataTypes#number) | [number](dataTypes#number)[] } - 核尺寸
- **[ anchor ]** { [number](dataTypes#number)[] | [OpenCVPoint](opencvPointType) } - 锚点
- **[ type = "DEFAULT" ]** { [string](dataTypes#string) | [number](dataTypes#number) } - OpenCV 边界类型
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) }

### [m] images.medianBlur(image, size)

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **size** { [number](dataTypes#number) | [number](dataTypes#number)[] | [OpenCVSize](opencvSizeType) } - 正方形核尺寸
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) }

数组或 `OpenCVSize` 的宽度和高度必须相等. OpenCV 还要求核尺寸为大于 `1` 的奇数.

### [m] images.gaussianBlur(image, size, sigmaX?, sigmaY?, type?)

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **size** { [number](dataTypes#number) | [number](dataTypes#number)[] }
- **[ sigmaX = 0 ]** { [number](dataTypes#number) }
- **[ sigmaY = 0 ]** { [number](dataTypes#number) }
- **[ type = "DEFAULT" ]** { [string](dataTypes#string) | [number](dataTypes#number) }
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) }

### [m] images.bilateralFilter(image, d?, sigmaColor?, sigmaSpace?, borderType?)

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **[ d = 0 ]** { [number](dataTypes#number) } - 像素邻域直径
- **[ sigmaColor = 40 ]** { [number](dataTypes#number) } - 颜色空间标准差
- **[ sigmaSpace = 20 ]** { [number](dataTypes#number) } - 坐标空间标准差
- **[ borderType = "DEFAULT" ]** { [string](dataTypes#string) | [number](dataTypes#number) }
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) }

<span id="m-images-cvtcolor-image-code-dstcn"></span>

### [m] images.cvtColor(image, code, dstCn?)

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **code** { [string](dataTypes#string) } - OpenCV 颜色转换代码
- **[ dstCn ]** { [number](dataTypes#number) } - 目标通道数
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) }

`code` 不带 `COLOR_` 前缀, 例如 `BGR2GRAY` 或 `RGBA2BGR`.

<span id="m-images-resize-image-size-interpolation"></span>

### [m] images.resize(image, size, interpolation?)

**`[6.8.0]`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **size** { [number](dataTypes#number)[] } - 包含 1 个或 2 个尺寸的数组
- **[ interpolation = "LINEAR" ]** { [string](dataTypes#string) | [number](dataTypes#number) } - OpenCV 插值方式
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) }

`[ width ]` 同时指定宽度和高度, `[ width, height ]` 分别指定两个尺寸. 每个尺寸必须为 `1` 至 `2147483647` 范围内的有限正数.

插值名称支持 `NEAREST`, `LINEAR`, `CUBIC`, `AREA`, `LANCZOS4`, `LINEAR_EXACT` 和 `NEAREST_EXACT`. 名称可带 `INTER_` 前缀, 也可使用对应的 OpenCV 整数常量.

`images.resize(image, width, height)` 不是有效重载.

### [m] images.scale(image, fx, fy, interpolation?)

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **fx** { [number](dataTypes#number) } - 水平缩放系数
- **fy** { [number](dataTypes#number) } - 垂直缩放系数
- **[ interpolation = "LINEAR" ]** { [string](dataTypes#string) | [number](dataTypes#number) }
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) }

插值参数的可选值与 [`resize()`](#m-images-resize-image-size-interpolation) 相同.

### [m] images.rotate(image, degree, centerX?, centerY?)

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **degree** { [number](dataTypes#number) } - 旋转角度
- **[ centerX = image.width / 2 ]** { [number](dataTypes#number) }
- **[ centerY = image.height / 2 ]** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) }

### [m] images.flip(image)

**`6.6.2`** **`Overload 1/3`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) } - 水平翻转后的图片

### [m] images.flip(image, orientation)

**`6.6.2`** **`Overload 2/3`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **orientation** { [boolean](dataTypes#boolean) | [string](dataTypes#string) | [boolean](dataTypes#boolean)[] | [object](dataTypes#object) }
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) }

字符串支持 `horizontal`, `vertical`, `both` 及其缩写 `h`, `v`, `x`, `y`, `xy`. 数组格式为 `[ horizontal, vertical ]`. 对象可使用 `horizontal` 或 `h` 或 `x`, 以及 `vertical` 或 `v` 或 `y`.

### [m] images.flip(image, horizontal, vertical)

**`6.6.2`** **`Overload 3/3`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **horizontal** { [boolean](dataTypes#boolean) }
- **vertical** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) }

### [m] images.concat(imageA, imageB, direction?)

- **imageA** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **imageB** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **[ direction = "END" ]** { [string](dataTypes#string) | [number](dataTypes#number) } - 拼接方向
- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) }

方向支持 Android Gravity 常量 `START`, `END`, `TOP` 和 `BOTTOM`, 或对应整数. 水平拼接时图片垂直居中, 垂直拼接时图片水平居中.

## 截图

### [m] images.requestScreenCapture(options?)

**`Global`** **`Non-UI`** **`Overload 1/3`**

- **[ options ]** {{
    - orientation?: [string](dataTypes#string) | [number](dataTypes#number);
    - width?: [number](dataTypes#number);
    - height?: [number](dataTypes#number);
    - isAsync?: [boolean](dataTypes#boolean);
    - async?: [boolean](dataTypes#boolean);
- }}
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否获得截图权限

请求屏幕捕获权限并等待用户选择. 默认选项为 `orientation = "auto"`, `width = -1`, `height = -1`, `isAsync = false`.

`orientation` 支持 `auto`, `none`, `portrait`, `landscape` 或对应整数 `0`, `-1`, `1`, `2`. `isAsync` 控制截图器是否持续异步产生帧, `async` 是其兼容别名.

此同步方法不能在 UI 线程调用. UI 模式应使用 [`requestScreenCaptureAsync()`](#m-images-requestscreencaptureasync-options).

### [m] images.requestScreenCapture(landscape)

**`Global`** **`Non-UI`** **`Overload 2/3`**

- **landscape** { [boolean](dataTypes#boolean) } - `true` 为横屏, `false` 为竖屏
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

### [m] images.requestScreenCapture(width, height)

**`Global`** **`Non-UI`** **`Overload 3/3`**

- **width** { [number](dataTypes#number) } - 捕获宽度
- **height** { [number](dataTypes#number) } - 捕获高度
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

此重载使用 `orientation = "none"`, 即不根据设备方向交换指定尺寸.

<span id="m-images-requestscreencaptureasync-options"></span>

### [m] images.requestScreenCaptureAsync(options?)

**`Global`** **`Async`** **`6.6.0`** **`Overload 1/3`**

- **[ options ]** {{
    - orientation?: [string](dataTypes#string) | [number](dataTypes#number);
    - width?: [number](dataTypes#number);
    - height?: [number](dataTypes#number);
    - isAsync?: [boolean](dataTypes#boolean);
    - async?: [boolean](dataTypes#boolean);
- }}
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [boolean](dataTypes#boolean) 类型的授权结果

异步请求屏幕捕获权限. 参数和默认值与 `requestScreenCapture(options?)` 相同, 可在 UI 线程调用.

### [m] images.requestScreenCaptureAsync(landscape)

**`Global`** **`Async`** **`6.6.0`** **`Overload 2/3`**

- **landscape** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [boolean](dataTypes#boolean)

### [m] images.requestScreenCaptureAsync(width, height)

**`Global`** **`Async`** **`6.6.0`** **`Overload 3/3`**

- **width** { [number](dataTypes#number) }
- **height** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) } - 兑现值为 [boolean](dataTypes#boolean)

### [m] images.stopScreenCapture()

**`6.6.0`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

停止当前截图器, 释放屏幕捕获资源, 并将仍在等待的授权请求以 `false` 完成. 之后再次截图需要重新请求权限.

### [m] images.getScreenCaptureOptions()

**`6.6.0`**

- <ins>**returns**</ins> { [ScreenCapturer.Options](#screencapturer-options) | [null](dataTypes#null) } - 当前截图器选项

尚未获得截图权限或截图器已停止时返回 `null`.

<span id="m-capturescreen"></span>
<span id="image_m_capturescreen"></span>
<span id="m-images-capturescreen"></span>

### [m] images.captureScreen()

**`Global`** **`Overload 1/2`**

- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) } - 当前屏幕图片

在后台脚本线程中, 若尚未请求权限, 此方法会先同步调用 `requestScreenCapture()`. UI 线程不会自动请求权限.

截图模块会管理返回图片的缓存和更新, 通常不需要手动回收该对象. 若截图暂时失败且已有可用的上一帧, 方法会返回上一帧的副本; 无任何有效帧时抛出异常.

```js
requestScreenCapture();
let image = captureScreen();
console.log(`${image.width} x ${image.height}`);
```

### [m] images.captureScreen(path)

**`Global`** **`Overload 2/2`**

- **path** { [string](dataTypes#string) } - PNG 保存路径
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否保存成功

捕获当前屏幕并直接保存到指定路径.

### [m] images.on("screen_capture_available", listener)

**`Async`**

- **listener** { [Function](dataTypes#function) } - `(image: ImageWrapper) => void`
- <ins>**returns**</ins> { [object](dataTypes#object) } - 当前 `images` 对象

当截图请求使用 `isAsync = true` 时, 每个可用帧触发一次事件. 监听器收到的图片由调用方负责及时回收.

同一帧还会依次触发兼容事件 `capture_available` 和 `screen_capture`. 三个事件传入同一个 `ImageWrapper`.

```js
images.on("screen_capture_available", (image) => {
    try {
        console.log(images.pixel(image, 0, 0));
    } finally {
        image.recycle();
    }
});

requestScreenCapture({
    orientation: "auto",
    isAsync: true,
});
```

## 找色

找色选项中的 `threshold` 默认为 `4`, 表示颜色通道差异阈值. 也可使用 `similarity`, 此时阈值按 `round(255 * (1 - similarity))` 换算. 同一选项对象不能同时包含 `threshold` 和 `similarity`.

### [m] images.detectColor(image, color, x, y, threshold?, algorithm?)

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **color** { [ColorInt](dataTypes#colorint) | [ColorHex](dataTypes#colorhex) | [ColorName](dataTypes#colorname) }
- **x** { [number](dataTypes#number) }
- **y** { [number](dataTypes#number) }
- **[ threshold = 4 ]** { [number](dataTypes#number) }
- **[ algorithm = "diff" ]** { [ColorDetectionAlgorithm](dataTypes#colordetectionalgorithm) }
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 指定位置是否匹配颜色

### [m] images.detectsColor(image, color, x, y, threshold?, algorithm?)

**`DEPRECATED`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **color** { [ColorInt](dataTypes#colorint) | [ColorHex](dataTypes#colorhex) | [ColorName](dataTypes#colorname) }
- **x** { [number](dataTypes#number) }
- **y** { [number](dataTypes#number) }
- **[ threshold = 4 ]** { [number](dataTypes#number) }
- **[ algorithm = "diff" ]** { [ColorDetectionAlgorithm](dataTypes#colordetectionalgorithm) }
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

已弃用的 `detectColor()` 别名.

### [m] images.detectMultiColors(image, x, y, firstColor, paths, options?)

**`6.6.0`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **x** { [number](dataTypes#number) } - 基准点横坐标
- **y** { [number](dataTypes#number) } - 基准点纵坐标
- **firstColor** { [ColorInt](dataTypes#colorint) | [ColorHex](dataTypes#colorhex) | [ColorName](dataTypes#colorname) } - 基准颜色
- **paths** { [number](dataTypes#number)[][] } - 相对颜色路径
- **[ options ]** {{
    - region?: [number](dataTypes#number)[] | [AndroidRect](androidRectType) | [OpenCVRect](opencvRectType);
    - threshold?: [number](dataTypes#number);
    - similarity?: [number](dataTypes#number);
- }}
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 指定基准点是否匹配整组颜色

`paths` 的每一项为 `[ dx, dy, color ]`, 坐标相对于 `(x, y)`.

### [m] images.detectsMultiColors(image, x, y, firstColor, paths, options?)

**`DEPRECATED`** **`6.6.0`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **x** { [number](dataTypes#number) }
- **y** { [number](dataTypes#number) }
- **firstColor** { [ColorInt](dataTypes#colorint) | [ColorHex](dataTypes#colorhex) | [ColorName](dataTypes#colorname) }
- **paths** { [number](dataTypes#number)[][] }
- **[ options ]** { [object](dataTypes#object) }
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

已弃用的 `detectMultiColors()` 别名.

### [m] images.findPointByColor(image, color, options?)

**`Overload 1/2`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **color** { [ColorInt](dataTypes#colorint) | [ColorHex](dataTypes#colorhex) | [ColorName](dataTypes#colorname) }
- **[ options ]** {{
    - region?: [number](dataTypes#number)[] | [AndroidRect](androidRectType) | [OpenCVRect](opencvRectType);
    - threshold?: [number](dataTypes#number);
    - similarity?: [number](dataTypes#number);
- }}
- <ins>**returns**</ins> { [OpenCVPoint](opencvPointType) | [null](dataTypes#null) } - 首个匹配点

### [m] images.findPointByColor(image, color, x?, y?, width?, height?, threshold?)

**`Overload 2/2`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **color** { [ColorInt](dataTypes#colorint) | [ColorHex](dataTypes#colorhex) | [ColorName](dataTypes#colorname) }
- **[ x = 0 ]** { [number](dataTypes#number) }
- **[ y = 0 ]** { [number](dataTypes#number) }
- **[ width = image.width - x ]** { [number](dataTypes#number) }
- **[ height = image.height - y ]** { [number](dataTypes#number) }
- **[ threshold = 4 ]** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [OpenCVPoint](opencvPointType) | [null](dataTypes#null) }

### [m] images.findColor(image, color, options?)

**`Global`** **`DEPRECATED`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **color** { [ColorInt](dataTypes#colorint) | [ColorHex](dataTypes#colorhex) | [ColorName](dataTypes#colorname) }
- **[ options ]** { [object](dataTypes#object) }
- <ins>**returns**</ins> { [OpenCVPoint](opencvPointType) | [null](dataTypes#null) }

使用 `findPointByColor(image, color, options?)` 代替.

### [m] images.findColorInRegion(image, color, x?, y?, width?, height?, threshold?)

**`Global`** **`DEPRECATED`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **color** { [ColorInt](dataTypes#colorint) | [ColorHex](dataTypes#colorhex) | [ColorName](dataTypes#colorname) }
- **[ x = 0 ]** { [number](dataTypes#number) }
- **[ y = 0 ]** { [number](dataTypes#number) }
- **[ width = image.width - x ]** { [number](dataTypes#number) }
- **[ height = image.height - y ]** { [number](dataTypes#number) }
- **[ threshold = 4 ]** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [OpenCVPoint](opencvPointType) | [null](dataTypes#null) }

使用 `findPointByColor()` 的位置参数重载代替.

### [m] images.findPointByColorExactly(image, color, x?, y?, width?, height?)

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **color** { [ColorInt](dataTypes#colorint) | [ColorHex](dataTypes#colorhex) | [ColorName](dataTypes#colorname) }
- **[ x = 0 ]** { [number](dataTypes#number) }
- **[ y = 0 ]** { [number](dataTypes#number) }
- **[ width = image.width - x ]** { [number](dataTypes#number) }
- **[ height = image.height - y ]** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [OpenCVPoint](opencvPointType) | [null](dataTypes#null) }

以阈值 `0` 查找完全匹配的颜色.

### [m] images.findColorEquals(image, color, x?, y?, width?, height?)

**`Global`** **`DEPRECATED`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **color** { [ColorInt](dataTypes#colorint) | [ColorHex](dataTypes#colorhex) | [ColorName](dataTypes#colorname) }
- **[ x = 0 ]** { [number](dataTypes#number) }
- **[ y = 0 ]** { [number](dataTypes#number) }
- **[ width = image.width - x ]** { [number](dataTypes#number) }
- **[ height = image.height - y ]** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [OpenCVPoint](opencvPointType) | [null](dataTypes#null) }

使用 `findPointByColorExactly()` 代替.

### [m] images.findPointsByColor(image, color, options?)

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **color** { [ColorInt](dataTypes#colorint) | [ColorHex](dataTypes#colorhex) | [ColorName](dataTypes#colorname) }
- **[ options ]** {{
    - region?: [number](dataTypes#number)[] | [AndroidRect](androidRectType) | [OpenCVRect](opencvRectType);
    - threshold?: [number](dataTypes#number);
    - similarity?: [number](dataTypes#number);
- }}
- <ins>**returns**</ins> { [OpenCVPoint](opencvPointType)[] } - 全部匹配点

### [m] images.findAllPointsForColor(image, color, options?)

**`DEPRECATED`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **color** { [ColorInt](dataTypes#colorint) | [ColorHex](dataTypes#colorhex) | [ColorName](dataTypes#colorname) }
- **[ options ]** { [object](dataTypes#object) }
- <ins>**returns**</ins> { [OpenCVPoint](opencvPointType)[] }

使用 `findPointsByColor()` 代替.

### [m] images.findPointByColors(image, firstColor, paths, options?)

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **firstColor** { [ColorInt](dataTypes#colorint) | [ColorHex](dataTypes#colorhex) | [ColorName](dataTypes#colorname) }
- **paths** { [number](dataTypes#number)[][] } - 每项为 `[ dx, dy, color ]`
- **[ options ]** {{
    - region?: [number](dataTypes#number)[] | [AndroidRect](androidRectType) | [OpenCVRect](opencvRectType);
    - threshold?: [number](dataTypes#number);
    - similarity?: [number](dataTypes#number);
- }}
- <ins>**returns**</ins> { [OpenCVPoint](opencvPointType) | [null](dataTypes#null) } - 首个匹配模式的基准点

### [m] images.findMultiColors(image, firstColor, paths, options?)

**`Global`** **`DEPRECATED`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **firstColor** { [ColorInt](dataTypes#colorint) | [ColorHex](dataTypes#colorhex) | [ColorName](dataTypes#colorname) }
- **paths** { [number](dataTypes#number)[][] }
- **[ options ]** { [object](dataTypes#object) }
- <ins>**returns**</ins> { [OpenCVPoint](opencvPointType) | [null](dataTypes#null) }

使用 `findPointByColors()` 代替.

### [m] images.findPointsByColors(image, firstColor, paths, options?)

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **firstColor** { [ColorInt](dataTypes#colorint) | [ColorHex](dataTypes#colorhex) | [ColorName](dataTypes#colorname) }
- **paths** { [number](dataTypes#number)[][] }
- **[ options ]** {{
    - region?: [number](dataTypes#number)[] | [AndroidRect](androidRectType) | [OpenCVRect](opencvRectType);
    - threshold?: [number](dataTypes#number);
    - similarity?: [number](dataTypes#number);
- }}
- <ins>**returns**</ins> { [OpenCVPoint](opencvPointType)[] } - 全部匹配模式的基准点

### [m] images.countPointsByColor(image, color, options?)

**`6.8.0`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **color** { [ColorInt](dataTypes#colorint) | [ColorHex](dataTypes#colorhex) | [ColorName](dataTypes#colorname) }
- **[ options ]** {{
    - region?: [number](dataTypes#number)[] | [AndroidRect](androidRectType) | [OpenCVRect](opencvRectType);
    - threshold?: [number](dataTypes#number);
    - similarity?: [number](dataTypes#number);
- }}
- <ins>**returns**</ins> { [number](dataTypes#number) } - 匹配像素的数量

统计图片 (或 `region` 区域) 中与指定颜色匹配的像素数量, 匹配规则与 [findPointsByColor](#m-images-findpointsbycolor-image-color-options) 相同 (RGB 各分量差值均不超过阈值).

结果直接由 OpenCV 掩码统计得到, 不会生成点数组, 适合判断某个区域是否 "大部分" 为某种颜色:

```js
let img = images.captureScreen();
let region = [ 100, 200, 300, 40 ];
let total = region[2] * region[3];
let ratio = images.countPointsByColor(img, "#ffffff", { region, threshold: 8 }) / total;
console.log(ratio > 0.9 ? "区域几乎为白色" : "区域不是白色");
img.recycle();
```

### [m] images.getMeanColor(image, region?)

**`6.8.0`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **[ region ]** { [number](dataTypes#number)[] | [AndroidRect](androidRectType) | [OpenCVRect](opencvRectType) } - 统计区域, 默认为整张图片
- <ins>**returns**</ins> { [ColorInt](dataTypes#colorint) } - 平均颜色

计算图片 (或 `region` 区域) 各通道的平均值并合成为颜色整数. 灰度图返回不透明灰色, 无透明通道的图片 alpha 为 `255`.

```js
let img = images.captureScreen();
let mean = images.getMeanColor(img, [ 0, 0, 200, 100 ]);
console.log(colors.toHex(mean), colors.luminance(mean) > 0.5 ? "偏亮" : "偏暗");
img.recycle();
```

## 找图与特征匹配

### [m] images.findCircles(image, options?)

**`[6.8.0]`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) } - 灰度图或普通图片
- **[ options ]** {{
    - region?: [number](dataTypes#number)[] | [AndroidRect](androidRectType) | [OpenCVRect](opencvRectType);
    - dp?: [number](dataTypes#number);
    - minDst?: [number](dataTypes#number);
    - param1?: [number](dataTypes#number);
    - param2?: [number](dataTypes#number);
    - minRadius?: [number](dataTypes#number);
    - maxRadius?: [number](dataTypes#number);
- }}
- <ins>**returns**</ins> { [Circle](#circle)[] } - 检测到的圆

使用 OpenCV Hough 圆检测. 非灰度图片会先自动灰度化.

默认值为 `dp = 1`, `minDst = image.height / 8`, `param1 = 100`, `param2 = 100`, `minRadius = 0`, `maxRadius = 0`. 从 AutoJs6 6.8.0 起, 指定 `region` 时返回的 `x` 和 `y` 为原图坐标, 已包含区域偏移.

### [m] images.findPointByImage(image, template, options?)

**`Overload 1/2`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) } - 待搜索图片
- **template** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) } - 模板图片
- **[ options ]** {{
    - region?: [number](dataTypes#number)[] | [AndroidRect](androidRectType) | [OpenCVRect](opencvRectType);
    - weakThreshold?: [number](dataTypes#number);
    - threshold?: [number](dataTypes#number);
    - level?: [number](dataTypes#number);
- }}
- <ins>**returns**</ins> { [OpenCVPoint](opencvPointType) | [null](dataTypes#null) } - 最佳匹配的左上角坐标

默认值为 `weakThreshold = 0.6`, `threshold = 0.9`, `level = -1`. `level = -1` 表示自动选择图像金字塔层数.

### [m] images.findPointByImage(image, template, x?, y?, width?, height?, threshold?)

**`Overload 2/2`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **template** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **[ x = 0 ]** { [number](dataTypes#number) }
- **[ y = 0 ]** { [number](dataTypes#number) }
- **[ width = image.width - x ]** { [number](dataTypes#number) }
- **[ height = image.height - y ]** { [number](dataTypes#number) }
- **[ threshold = 0.9 ]** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [OpenCVPoint](opencvPointType) | [null](dataTypes#null) }

此重载仍使用 `weakThreshold = 0.6` 和 `level = -1`.

### [m] images.findImage(image, template, options?)

**`Global`** **`DEPRECATED`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **template** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **[ options ]** { [object](dataTypes#object) }
- <ins>**returns**</ins> { [OpenCVPoint](opencvPointType) | [null](dataTypes#null) }

使用 `findPointByImage(image, template, options?)` 代替.

### [m] images.findImageInRegion(image, template, x?, y?, width?, height?, threshold?)

**`Global`** **`DEPRECATED`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **template** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **[ x = 0 ]** { [number](dataTypes#number) }
- **[ y = 0 ]** { [number](dataTypes#number) }
- **[ width = image.width - x ]** { [number](dataTypes#number) }
- **[ height = image.height - y ]** { [number](dataTypes#number) }
- **[ threshold = 0.9 ]** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [OpenCVPoint](opencvPointType) | [null](dataTypes#null) }

使用 `findPointByImage()` 的位置参数重载代替.

### [m] images.matchTemplate(image, template, options?)

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) } - 待搜索图片
- **template** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) } - 模板图片
- **[ options ]** {{
    - region?: [number](dataTypes#number)[] | [AndroidRect](androidRectType) | [OpenCVRect](opencvRectType);
    - weakThreshold?: [number](dataTypes#number);
    - threshold?: [number](dataTypes#number);
    - level?: [number](dataTypes#number);
    - max?: [number](dataTypes#number);
    - useTransparentMask?: [boolean](dataTypes#boolean);
    - transparentMask?: [boolean](dataTypes#boolean);
- }}
- <ins>**returns**</ins> { [MatchingResult](#matchingresult) } - 匹配结果

默认值为 `weakThreshold = 0.6`, `threshold = 0.9`, `level = -1`, `max = 5`, `useTransparentMask = false`. `transparentMask` 是 `useTransparentMask` 的兼容别名, 仅在前者缺失时生效.

`max` 限制返回结果数量. 开启透明遮罩后, 模板的透明通道参与遮罩构造.

```js
let result = images.matchTemplate("./screen.png", "./button.png", {
    region: [ 0, 0, 1080, 1200 ],
    weakThreshold: 0.6,
    threshold: 0.9,
    level: -1,
    max: 5,
    useTransparentMask: false,
});
console.log(result.best());
```

### [m] images.detectAndComputeFeatures(image, options?)

**`6.6.0`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **[ options ]** {{
    - region?: [number](dataTypes#number)[] | [AndroidRect](androidRectType) | [OpenCVRect](opencvRectType);
    - scale?: [number](dataTypes#number);
    - grayscale?: [boolean](dataTypes#boolean);
    - method?: [string](dataTypes#string) | [number](dataTypes#number);
- }}
- <ins>**returns**</ins> { [ImageFeatures](#imagefeatures) } - 特征描述对象

默认使用 `method = "SIFT"` 和 `grayscale = false`. `method` 支持 `SIFT`, `ORB` 或对应内部整数常量.

`scale` 被限制在 `0` 至 `1`. 未指定时, 小于约 100 万像素的图片使用 `1`; 更大的图片按约 100 万像素且最长边不超过 `1600` 的规则自动缩放.

### [m] images.matchFeatures(sceneFeatures, objectFeatures, options?)

**`6.6.0`**

- **sceneFeatures** { [ImageFeatures](#imagefeatures) } - 场景图片特征
- **objectFeatures** { [ImageFeatures](#imagefeatures) } - 目标图片特征
- **[ options ]** {{
    - matcher?: [string](dataTypes#string);
    - drawMatches?: [string](dataTypes#string);
    - threshold?: [number](dataTypes#number);
- }}
- <ins>**returns**</ins> { [ObjectFrame](#c-images-objectframe) | [null](dataTypes#null) } - 目标四边形, 或 `null`

`matcher` 是 `org.opencv.features2d.DescriptorMatcher` 的静态常量名. 未指定时, ORB 一类的 `CV_8U` 描述符使用 `BRUTEFORCE_HAMMING`, 其他描述符使用 `FLANNBASED`.

默认阈值对 `CV_8U` 描述符为 `0.8`, 对其他描述符为 `0.7`. `drawMatches` 可指定调试匹配图的 JPG 保存路径.

## 相似度

除 `isEqual()` 外, 本节方法的图片参数接受 [ImageWrapper](imageWrapperType), 图片路径 [string](dataTypes#string) 或 [Mat](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Mat.html). 两张图片必须满足所选算法的尺寸和通道要求, 否则 OpenCV 或相似度实现会抛出异常.

### [m] images.psnr(imageA, imageB)

**`6.6.0`**

- **imageA** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) | [Mat](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Mat.html) }
- **imageB** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) | [Mat](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Mat.html) }
- <ins>**returns**</ins> { [number](dataTypes#number) } - 峰值信噪比

结果通常越大表示差异越小.

### [m] images.ssim(imageA, imageB)

- **imageA** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) | [Mat](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Mat.html) }
- **imageB** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) | [Mat](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Mat.html) }
- <ins>**returns**</ins> { [number](dataTypes#number) } - 结构相似性指数

结果通常越接近 `1` 表示结构越相似.

### [m] images.mssim(imageA, imageB)

**`6.6.0`**

- **imageA** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) | [Mat](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Mat.html) }
- **imageB** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) | [Mat](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Mat.html) }
- <ins>**returns**</ins> { [number](dataTypes#number) } - 平均结构相似性指数

结果通常越接近 `1` 表示结构越相似.

### [m] images.hist(imageA, imageB)

- **imageA** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) | [Mat](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Mat.html) }
- **imageB** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) | [Mat](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Mat.html) }
- <ins>**returns**</ins> { [number](dataTypes#number) } - 直方图相关性

### [m] images.mse(imageA, imageB)

- **imageA** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) | [Mat](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Mat.html) }
- **imageB** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) | [Mat](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Mat.html) }
- <ins>**returns**</ins> { [number](dataTypes#number) } - 均方误差

结果越小表示差异越小, 完全相同为 `0`. 8 位图像的最大值为 `65025` (即 `255 * 255`).

### [m] images.ncc(imageA, imageB)

- **imageA** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) | [Mat](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Mat.html) }
- **imageB** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) | [Mat](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Mat.html) }
- <ins>**returns**</ins> { [number](dataTypes#number) } - 归一化互相关结果

结果通常越接近 `1` 表示相关性越高.

### [m] images.isEqual(imageA, imageB)

**`[6.8.0]`**

- **imageA** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- **imageB** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) }
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 像素是否完全相同

尺寸或类型不同时返回 `false`. 从 AutoJs6 6.8.0 起逐通道精确比较, 任一通道 (含 alpha) 相差 `1` 也会返回 `false`.

### [m] images.getSimilarity(imageA, imageB, options?)

**`6.6.0`** **`[6.8.0]`**

- **imageA** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) | [Mat](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Mat.html) }
- **imageB** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) | [Mat](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Mat.html) }
- **[ options ]** {{
    - metric?: [string](dataTypes#string);
    - type?: [string](dataTypes#string);
- }}
- <ins>**returns**</ins> { [number](dataTypes#number) } - 所选算法的原始结果

`metric` 支持 `psnr`, `ssim`, `mssim`, `hist`, `mse` 和 `ncc`, 默认值为 `mssim`. `type` 是兼容别名, 仅在 `metric` 缺失时使用. 拼写 `pnsr` 会兼容为 `psnr`.

## 资源状态

### [m] images.isRecycled(...images)

- **...images** { ...([ImageWrapper](imageWrapperType))[] } - 待检查的图片
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否全部为已回收图片

无参数时返回 `true`. 任一参数不是 `ImageWrapper` 或尚未回收时返回 `false`.

### [m] images.recycle(...images)

- **...images** { ...([ImageWrapper](imageWrapperType))[] } - 待回收的图片
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否全部成功回收

已回收的图片视为成功. 无参数时返回 `true`. 任一参数不是 `ImageWrapper` 或回收时发生异常, 结果为 `false`.

单个图片也可直接调用 [`ImageWrapper#recycle()`](imageWrapperType#m-recycle).

## 类型

### Circle

圆检测结果.

- **x** { [number](dataTypes#number) } - 圆心横坐标
- **y** { [number](dataTypes#number) } - 圆心纵坐标
- **radius** { [number](dataTypes#number) } - 半径

<span id="screencapturer-options"></span>

### ScreenCapturer.Options

`images.getScreenCaptureOptions()` 返回的 Java 记录类型.

#### [m#] width()

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回捕获宽度选项.

#### [m#] height()

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回捕获高度选项.

#### [m#] orientation()

- <ins>**returns**</ins> { [number](dataTypes#number) } - `-1`, `0`, `1` 或 `2`

返回捕获方向选项.

#### [m#] density()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 屏幕密度

返回创建虚拟显示时使用的屏幕密度.

#### [m#] isAsync()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回截图器是否使用异步帧模式.

<span id="c-images-objectframe"></span>

### [C] images.ObjectFrame

**`6.8.0`**

由 4 个 [OpenCVPoint](opencvPointType) 表示的特征匹配边框类.

#### [c] images.ObjectFrame(topLeft, topRight, bottomLeft, bottomRight)

- **topLeft** { [OpenCVPoint](opencvPointType) }
- **topRight** { [OpenCVPoint](opencvPointType) }
- **bottomLeft** { [OpenCVPoint](opencvPointType) }
- **bottomRight** { [OpenCVPoint](opencvPointType) }
- <ins>**returns**</ins> { [ObjectFrame](#c-images-objectframe) }

创建一个对象边框.

#### [p#] ObjectFrame#topLeft

**`READONLY`**

- { [OpenCVPoint](opencvPointType) }

#### [p#] ObjectFrame#topRight

**`READONLY`**

- { [OpenCVPoint](opencvPointType) }

#### [p#] ObjectFrame#bottomLeft

**`READONLY`**

- { [OpenCVPoint](opencvPointType) }

#### [p#] ObjectFrame#bottomRight

**`READONLY`**

- { [OpenCVPoint](opencvPointType) }

#### [p#] ObjectFrame#centerX

**`READONLY`**

- { [number](dataTypes#number) }

#### [p#] ObjectFrame#centerY

**`READONLY`**

- { [number](dataTypes#number) }

#### [p#] ObjectFrame#center

**`READONLY`**

- { [OpenCVPoint](opencvPointType) }

#### [m#] ObjectFrame#summary()

- <ins>**returns**</ins> { [string](dataTypes#string) } - 四角点和中心点摘要

### MatchingResult

`images.matchTemplate()` 返回的匹配结果.

#### [p#] MatchingResult#matches

**`READONLY`**

- { [TemplateMatch](#templatematch)[] } - 匹配项数组

#### [p#] MatchingResult#points

**`READONLY`**

- { [OpenCVPoint](opencvPointType)[] } - 匹配点数组

#### [m#] MatchingResult#first()

- <ins>**returns**</ins> { [TemplateMatch](#templatematch) | [null](dataTypes#null) }

返回当前顺序中的第一项.

#### [m#] MatchingResult#last()

- <ins>**returns**</ins> { [TemplateMatch](#templatematch) | [null](dataTypes#null) }

返回当前顺序中的最后一项.

#### [m#] MatchingResult#leftmost()

**`[6.8.0]`**

- <ins>**returns**</ins> { [TemplateMatch](#templatematch) | [null](dataTypes#null) }

#### [m#] MatchingResult#rightmost()

**`[6.8.0]`**

- <ins>**returns**</ins> { [TemplateMatch](#templatematch) | [null](dataTypes#null) }

#### [m#] MatchingResult#topmost()

**`[6.8.0]`**

- <ins>**returns**</ins> { [TemplateMatch](#templatematch) | [null](dataTypes#null) }

#### [m#] MatchingResult#bottommost()

**`[6.8.0]`**

- <ins>**returns**</ins> { [TemplateMatch](#templatematch) | [null](dataTypes#null) }

#### [m#] MatchingResult#best()

**`[6.8.0]`**

- <ins>**returns**</ins> { [TemplateMatch](#templatematch) | [null](dataTypes#null) }

#### [m#] MatchingResult#worst()

**`[6.8.0]`**

- <ins>**returns**</ins> { [TemplateMatch](#templatematch) | [null](dataTypes#null) }

从 AutoJs6 6.8.0 起, 上述方向和相似度选择方法会按完整浮点值正确比较.

#### [m#] MatchingResult#sortBy(direction)

**`Overload 1/2`**

- **direction** { [string](dataTypes#string) } - 排序方向
- <ins>**returns**</ins> { [MatchingResult](#matchingresult) } - 新的排序结果

方向由 `left`, `right`, `top`, `bottom`, `best`, `worst` 组成. 可使用 `-` 连接多个排序条件, 例如 `left-top`.

#### [m#] MatchingResult#sortBy(compareFn)

**`Overload 2/2`**

- **compareFn** { [Function](dataTypes#function) } - `(a: TemplateMatch, b: TemplateMatch) => number`
- <ins>**returns**</ins> { [MatchingResult](#matchingresult) } - 新的排序结果

原 `MatchingResult` 不会被修改.

### TemplateMatch

- **point** { [OpenCVPoint](opencvPointType) } - 模板左上角坐标
- **similarity** { [number](dataTypes#number) } - 匹配相似度

### ImageFeatures

`images.detectAndComputeFeatures()` 返回的特征描述对象.

#### [p#] ImageFeatures#scale

- { [number](dataTypes#number) } - 特征计算时使用的缩放比例

#### [p#] ImageFeatures#region

- { [OpenCVRect](opencvRectType) } - 特征对应的原图区域

匹配结果会使用此区域还原到原图坐标.

#### [p#] ImageFeatures#recycled

- { [boolean](dataTypes#boolean) } - 是否已回收

该字段与 `isRecycled()` 返回相同的资源状态.

#### [m#] ImageFeatures#isRecycled()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回特征资源是否已回收.

#### [m#] ImageFeatures#recycle()

- <ins>**returns**</ins> { [void](dataTypes#void) }

释放特征点和描述符资源. 重复调用不会再次释放.

#### [m#] ImageFeatures#setOneShot(enabled)

- **enabled** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [ImageFeatures](#imagefeatures) }

设置一次性资源标记并返回当前对象.

#### [m#] ImageFeatures#oneShot()

- <ins>**returns**</ins> { [ImageFeatures](#imagefeatures) }

将对象标记为一次性对象. 它被 `matchFeatures()` 使用后会自动回收.

#### [m#] ImageFeatures#shoot()

- <ins>**returns**</ins> { [void](dataTypes#void) }

仅当对象已标记为一次性时执行回收.
