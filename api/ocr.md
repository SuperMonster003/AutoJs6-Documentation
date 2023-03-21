# 光学字符识别 (OCR)

ocr 模块用于识别图像中的文本.

AutoJs6 的 OCR 特性是基于 [Google ML Kit](https://developers.google.com/ml-kit?hl=zh-cn) 的 [文字识别 API](https://developers.google.com/ml-kit/vision/text-recognition/android?hl=zh-cn) 实现的.

## [@] ocr

ocr 可作为全局对象使用:

```js
typeof ocr; // "function"
typeof ocr.detect; // "function"
typeof ocr.recognizeText; // "function"
```

### ocr(img, options?)

**`6.2.1`** **`Overload [1-2]/4`**

- **img** { [ImageWrapper](imageWrapper) } - 包装图像对象
- **[options]** { [OcrOptions](dataTypes#ocroptions) } - OCR 识别选项
- <ins>**returns**</ins> { [string](dataTypes#string)[[]](dataTypes#array) }

识别图像包含的所有文本, 返回文本数组.

[ocr.recognizeText](#m-recognizetext) 的别名方法.

```js
images.requestScreenCapture(); /* 申请屏幕截图权限. */
let img = images.captureScreen(); /* 截屏并获取包装图像对象. */
ocr(img).filter(text => text.includes('app')); /* 过滤结果. */
```

### ocr(imgPath, options?)

**`6.2.1`** **`Overload [3-4]/4`**

- **imgPath** { [string](dataTypes#string) } - 图像路径
- **[options]** { [OcrOptions](dataTypes#ocroptions) } - OCR 识别选项
- <ins>**returns**</ins> { [string](dataTypes#string)[[]](dataTypes#array) }

识别指定路径对应图像包含的所有文本, 返回文本数组.

当指定路径无法解析为包装图像对象时, 将抛出 `TypeError` 异常.

[ocr.recognizeText](#m-recognizetext) 的别名方法.

```js
ocr('./picture.jpg'); /* 获取本地图像文件中的所有文本. */
```

## [m] recognizeText

### recognizeText(img, options?)

**`6.2.1`** **`Overload [1-2]/4`**

- **img** { [ImageWrapper](imageWrapper) } - 包装图像对象
- **[options]** { [OcrOptions](dataTypes#ocroptions) } - OCR 识别选项
- <ins>**returns**</ins> { [string](dataTypes#string)[[]](dataTypes#array) }

识别图像包含的所有文本, 返回文本数组.

`ocr.recognizeText(img, options?)` 与 `ocr(img, options?)` 等价.

```js
images.requestScreenCapture(); /* 申请屏幕截图权限. */
let img = images.captureScreen(); /* 截屏并获取包装图像对象. */
ocr.recognizeText(img).filter(text => text.includes('app')); /* 过滤结果. */
```

### recognizeText(imgPath, options?)

**`6.2.1`** **`Overload [3-4]/4`**

- **imgPath** { [string](dataTypes#string) } - 图像路径
- **[options]** { [OcrOptions](dataTypes#ocroptions) } - OCR 识别选项
- <ins>**returns**</ins> { [string](dataTypes#string)[[]](dataTypes#array) }

识别指定路径对应图像包含的所有文本, 返回文本数组.

当指定路径无法解析为包装图像对象时, 将抛出 `TypeError` 异常.

`ocr.recognizeText(imgPath, options?)` 与 `ocr(imgPath, options?)` 等价.

```js
ocr.recognizeText('./picture.jpg'); /* 获取本地图像文件中的所有文本. */
```

## [m] detect

### detect(img, options?)

**`6.2.1`** **`Overload [1-2]/4`**

- **img** { [ImageWrapper](imageWrapper) } - 包装图像对象
- **[options]** { [OcrOptions](dataTypes#ocroptions) } - OCR 识别选项
- <ins>**returns**</ins> { [OcrResult](dataTypes#ocrresult)[[]](dataTypes#array) }

识别图像包含的所有文本, 返回 [OcrResult](dataTypes#ocrresult) 数组.

```js
images.requestScreenCapture(); /* 申请屏幕截图权限. */
let img = images.captureScreen(); /* 截屏并获取包装图像对象. */
let result = ocr.detect(img); /* 获取本地图像文件中的所有识别结果. */
result.filter(o => o.confidence >= 0.8); /* 筛选置信度高于 0.8 的结果. */
```

### detect(imgPath, options?)

**`6.2.1`** **`Overload [3-4]/4`**

- **imgPath** { [string](dataTypes#string) } - 图像路径
- **[options]** { [OcrOptions](dataTypes#ocroptions) } - OCR 识别选项
- <ins>**returns**</ins> { [OcrResult](dataTypes#ocrresult)[[]](dataTypes#array) }

识别指定路径对应图像包含的所有文本, 返回 [OcrResult](dataTypes#ocrresult) 数组.

当指定路径无法解析为包装图像对象时, 将抛出 `TypeError` 异常.

```js
let result = ocr.detect('./picture.jpg'); /* 获取本地图像文件中的所有识别结果. */
result.filter(o => o.confidence >= 0.8); /* 筛选置信度高于 0.8 的结果. */
```