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

**`6.3.0`** **`Overload [1-2]/6`**

- **img** { [ImageWrapper](imageWrapper) } - 包装图像对象
- **[ options ]** { [OcrOptions](ocrOptionsType) } - OCR 识别选项
- <ins>**returns**</ins> { [string](dataTypes#string)[[]](dataTypes#array) }

识别图像包含的所有文本, 返回文本数组.

[ocr.recognizeText(img, options?)](#m-recognizetext) 的别名方法.

```js
/* 申请屏幕截图权限. */
images.requestScreenCapture();

/* 截屏并获取包装图像对象. */
let img = images.captureScreen();

/* OCR 识别并获取结果, 结果为字符串数组. */
let results = ocr(img);

/* 结果过滤, 筛选出文本中可部分匹配 "app" 的结果, 如 "apple", "disappear" 等. */
results.filter(text => text.includes('app')); 
```

### ocr(img, region)

**`6.3.0`** **`Overload 3/6`**

- **img** { [ImageWrapper](imageWrapper) } - 包装图像对象
- **region** { [OmniRegion](omniTypes#omniregion) } - OCR 识别区域
- <ins>**returns**</ins> { [string](dataTypes#string)[[]](dataTypes#array) }

识别指定区域内图像包含的所有文本, 返回文本数组.

[ocr(img, { region: region })](#-ocr) 的便捷方法.

[ocr.recognizeText(img, region)](#m-recognizetext) 的别名方法.

```js
/* 申请屏幕截图权限. */
images.requestScreenCapture();

/* 截屏并获取包装图像对象. */
let img = images.captureScreen();

/* 在区域 [ 0, 0, 100, 150 ] 内进行 OCR 识别并获取结果, 结果为字符串数组. */
let results = ocr(img, [ 0, 0, 100, 150 ]);

/* 结果过滤, 筛选出文本中可部分匹配 "app" 的结果, 如 "apple", "disappear" 等. */
results.filter(text => text.includes('app')); 
```

关于 OCR 区域参数 `region` 的更多用法, 参阅 [OcrOptions#region](ocrOptionsType#p-region) 小节.

### ocr(imgPath, options?)

**`6.3.0`** **`Overload [4-5]/6`**

- **imgPath** { [string](dataTypes#string) } - 图像路径
- **[ options ]** { [OcrOptions](ocrOptionsType) } - OCR 识别选项
- <ins>**returns**</ins> { [string](dataTypes#string)[[]](dataTypes#array) }

识别指定路径对应图像包含的所有文本, 返回文本数组.

当指定路径无法解析为包装图像对象时, 将抛出 `TypeError` 异常.

[ocr.recognizeText(imgPath, options?)](#m-recognizetext) 的别名方法.

```js
ocr('./picture.jpg'); /* 获取本地图像文件中的所有文本. */
```

### ocr(imgPath, region)

**`6.3.0`** **`Overload 6/6`**

- **imgPath** { [string](dataTypes#string) } - 图像路径
- **region** { [OmniRegion](omniTypes#omniregion) } - OCR 识别区域
- <ins>**returns**</ins> { [string](dataTypes#string)[[]](dataTypes#array) }

识别指定路径对应图像在指定区域内包含的所有文本, 返回文本数组.

当指定路径无法解析为包装图像对象时, 将抛出 `TypeError` 异常.

[ocr(imgPath, { region: region })](#-ocr) 的便捷方法.

[ocr.recognizeText(imgPath, region)](#m-recognizetext) 的别名方法.

```js
/* 获取本地图像文件在区域 [ 0, 0, 100, 150 ] 内的所有文本. */
ocr('./picture.jpg', [ 0, 0, 100, 150 ]);
```

关于 OCR 区域参数 `region` 的更多用法, 参阅 [OcrOptions#region](ocrOptionsType#p-region) 小节.

## [m] recognizeText

### recognizeText(img, options?)

**`6.3.0`** **`Overload [1-2]/6`**

- **img** { [ImageWrapper](imageWrapper) } - 包装图像对象
- **[ options ]** { [OcrOptions](ocrOptionsType) } - OCR 识别选项
- <ins>**returns**</ins> { [string](dataTypes#string)[[]](dataTypes#array) }

识别图像包含的所有文本, 返回文本数组.

`ocr.recognizeText(img, options?)` 与 `ocr(img, options?)` 等价.

```js
images.requestScreenCapture(); /* 申请屏幕截图权限. */
let img = images.captureScreen(); /* 截屏并获取包装图像对象. */
ocr.recognizeText(img).filter(text => text.includes('app')); /* 过滤结果. */
```

### recognizeText(img, region)

**`6.3.0`** **`Overload 3/6`**

- **img** { [ImageWrapper](imageWrapper) } - 包装图像对象
- **region** { [OmniRegion](omniTypes#omniregion) } - OCR 识别区域
- <ins>**returns**</ins> { [string](dataTypes#string)[[]](dataTypes#array) }

识别指定区域内图像包含的所有文本, 返回文本数组.

[ocr.recognizeText(img, { region: region })](#m-recognizeText) 的便捷方法.

`ocr.recognizeText(img, region)` 与 `ocr(img, region)` 等价.

```js
images.requestScreenCapture(); /* 申请屏幕截图权限. */
let img = images.captureScreen(); /* 截屏并获取包装图像对象. */
ocr.recognizeText(img, [ 0, 0, 100, 150 ]).filter(text => text.includes('app')); /* 过滤结果. */
```

关于 OCR 区域参数 `region` 的更多用法, 参阅 [OcrOptions#region](ocrOptionsType#p-region) 小节.

### recognizeText(imgPath, options?)

**`6.3.0`** **`Overload [4-5]/6`**

- **imgPath** { [string](dataTypes#string) } - 图像路径
- **[ options ]** { [OcrOptions](ocrOptionsType) } - OCR 识别选项
- <ins>**returns**</ins> { [string](dataTypes#string)[[]](dataTypes#array) }

识别指定路径对应图像包含的所有文本, 返回文本数组.

当指定路径无法解析为包装图像对象时, 将抛出 `TypeError` 异常.

`ocr.recognizeText(imgPath, options?)` 与 `ocr(imgPath, options?)` 等价.

```js
ocr.recognizeText('./picture.jpg'); /* 获取本地图像文件中的所有文本. */
```

### recognizeText(imgPath, region)

**`6.3.0`** **`Overload 6/6`**

- **imgPath** { [string](dataTypes#string) } - 图像路径
- **region** { [OmniRegion](omniTypes#omniregion) } - OCR 识别区域
- <ins>**returns**</ins> { [string](dataTypes#string)[[]](dataTypes#array) }

识别指定路径对应图像在指定区域内包含的所有文本, 返回文本数组.

当指定路径无法解析为包装图像对象时, 将抛出 `TypeError` 异常.

[ocr.recognizeText(imgPath, { region: region })](#m-recognizetext) 的便捷方法.

`ocr.recognizeText(imgPath, region)` 与 `ocr(imgPath, region)` 等价.

```js
/* 获取本地图像文件在区域 [ 0, 0, 100, 150 ] 内的所有文本. */
ocr.recognizeText('./picture.jpg', [ 0, 0, 100, 150 ]);
```

关于 OCR 区域参数 `region` 的更多用法, 参阅 [OcrOptions#region](ocrOptionsType#p-region) 小节.

## [m] detect

### detect(img, options?)

**`6.3.0`** **`Overload [1-2]/6`**

- **img** { [ImageWrapper](imageWrapper) } - 包装图像对象
- **[ options ]** { [OcrOptions](ocrOptionsType) } - OCR 识别选项
- <ins>**returns**</ins> { [OcrResult](dataTypes#ocrresult)[[]](dataTypes#array) }

识别图像包含的所有文本, 返回 [OcrResult](dataTypes#ocrresult) 数组.

```js
/* 申请屏幕截图权限. */
images.requestScreenCapture();

/* 截屏并获取包装图像对象. */
let img = images.captureScreen();

/* 获取本地图像文件中的所有识别结果. */
let result = ocr.detect(img);

/* 筛选置信度高于 0.8 的结果. */
result.filter(o => o.confidence >= 0.8);
```

### detect(img, region)

**`6.3.0`** **`Overload 3/6`**

- **img** { [ImageWrapper](imageWrapper) } - 包装图像对象
- **region** { [OmniRegion](omniTypes#omniregion) } - OCR 识别区域
- <ins>**returns**</ins> { [OcrResult](dataTypes#ocrresult)[[]](dataTypes#array) }

识别指定路径对应图像在指定区域内包含的所有文本, 返回 [OcrResult](dataTypes#ocrresult) 数组.

[ocr.detect(img, { region: region })](#m-detect) 的便捷方法.

```js
/* 申请屏幕截图权限. */
images.requestScreenCapture();

/* 截屏并获取包装图像对象. */
let img = images.captureScreen();

/* 获取本地图像文件在区域 [ 0, 0, 100, 150 ] 内的所有识别结果. */
let result = ocr.detect(img, [ 0, 0, 100, 150 ]);

/* 筛选置信度高于 0.8 的结果. */
result.filter(o => o.confidence >= 0.8);
```

关于 OCR 区域参数 `region` 的更多用法, 参阅 [OcrOptions#region](ocrOptionsType#p-region) 小节.

### detect(imgPath, options?)

**`6.3.0`** **`Overload [4-5]/6`**

- **imgPath** { [string](dataTypes#string) } - 图像路径
- **[ options ]** { [OcrOptions](ocrOptionsType) } - OCR 识别选项
- <ins>**returns**</ins> { [OcrResult](dataTypes#ocrresult)[[]](dataTypes#array) }

识别指定路径对应图像包含的所有文本, 返回 [OcrResult](dataTypes#ocrresult) 数组.

当指定路径无法解析为包装图像对象时, 将抛出 `TypeError` 异常.

```js
let result = ocr.detect('./picture.jpg'); /* 获取本地图像文件中的所有识别结果. */
result.filter(o => o.confidence >= 0.8); /* 筛选置信度高于 0.8 的结果. */
```

### detect(imgPath, region)

**`6.3.0`** **`Overload 6/6`**

- **imgPath** { [string](dataTypes#string) } - 图像路径
- **region** { [OmniRegion](omniTypes#omniregion) } - OCR 识别区域
- <ins>**returns**</ins> { [OcrResult](dataTypes#ocrresult)[[]](dataTypes#array) }

识别指定路径对应图像在指定区域内包含的所有文本, 返回 [OcrResult](dataTypes#ocrresult) 数组.

当指定路径无法解析为包装图像对象时, 将抛出 `TypeError` 异常.

[ocr.detect(imgPath, { region: region })](#m-detect) 的便捷方法.

```js
/* 获取本地图像文件在区域 [ 0, 0, 100, 150 ] 内的所有识别结果. */
let result = ocr.detect('./picture.jpg', [ 0, 0, 100, 150 ]);

/* 筛选置信度高于 0.8 的结果. */
result.filter(o => o.confidence >= 0.8);
```

关于 OCR 区域参数 `region` 的更多用法, 参阅 [OcrOptions#region](ocrOptionsType#p-region) 小节.