# 光学字符识别 (OCR)

ocr 模块用于识别图像中的文本.

AutoJs6 支持 ML Kit, Paddle 和 Rapid OCR 引擎.

从 AutoJs6 6.8.0 起, 普通应用中的 OCR 引擎由外部 OCR 插件提供. 调用前需在插件中心安装, 启用并授权兼容插件; 无可用引擎时识别方法会抛出插件加载异常. `engine`, `variant` 和 `profile` 选项可用于选择插件实现.

---

<p style="font: bold 2em sans-serif; color: #FF7043">ocr</p>

---

## [@] ocr

ocr 可作为全局对象使用:

```js
typeof ocr; // "function"
typeof ocr.detect; // "function"
typeof ocr.recognizeText; // "function"
```

### ocr(options?)

**`6.4.0`** **`Overload [1-2]/9`**

- **[ options ]** { [OcrOptions](ocrOptionsType) } - OCR 识别选项
- <ins>**returns**</ins> { [string](dataTypes#string)[[]](dataTypes#array) }

识别当前屏幕截图中包含的所有文本, 返回文本数组.

`ocr()` 相当于以下代码的整合:

```js
images.requestScreenCapture();
let img = images.captureScreen();
ocr(img);
```

同时也是 [ocr.recognizeText(options?)](#m-recognizetext) 的别名方法.

### ocr(region)

**`6.4.0`** **`Overload 3/9`**

- **region** { [OmniRegion](omniTypes#omniregion) } - OCR 识别区域
- <ins>**returns**</ins> { [string](dataTypes#string)[[]](dataTypes#array) }

识别当前屏幕截图指定区域内包含的所有文本, 返回文本数组.

`ocr(region)` 相当于以下代码的整合:

```js
images.requestScreenCapture();
let img = images.captureScreen();
ocr(img, region);
```

同时也是 [ocr({ region: region })](#-ocr) 的便捷方法,

以及 [ocr.recognizeText(region)](#m-recognizetext) 的别名方法.

关于 OCR 区域参数 `region` 的更多用法, 参阅 [OcrOptions#region](ocrOptionsType#p-region) 小节.

### ocr(img, options?)

**`6.3.0`** **`Overload [4-5]/9`**

- **img** { [ImageWrapper](imageWrapperType) } - 包装图像对象
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

**`6.3.0`** **`Overload 6/9`**

- **img** { [ImageWrapper](imageWrapperType) } - 包装图像对象
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

**`6.3.0`** **`Overload [7-8]/9`**

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

**`6.3.0`** **`Overload 9/9`**

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

## [p] mode

**`6.3.4`** **`[6.8.0]`** **`Getter/Setter`**

- **&lt;get&gt;** { [OcrModeName](dataTypes#ocrModeName) } - 当前引擎名称, 无可选引擎时为空字符串
- **&lt;set&gt;** { [OcrMode](dataTypes#ocrMode) } - 固定引擎或自动选择模式

获取当前 OCR 引擎名称, 或设置当前脚本的引擎选择方式.

AutoJs6 6.8.0 默认采用隐含的自动选择模式. 每次读取此属性时, 按 `mlkit`, `paddle`, `rapid` 的顺序检查当前已安装, 启用且已授权的 OCR 插件. 同一引擎的不同变体不影响此顺序; 具体插件变体仍按插件中心的优先级选择. 已知要求更高宿主版本的插件不会参与自动选择.

读取结果为 `"mlkit"`, `"paddle"`, `"rapid"` 或 `""`, 不会返回 `"auto"`. 插件被安装, 卸载, 启用或禁用后, 正在运行的脚本在下次读取属性时即可看到变化. 读取属性不会启动或绑定 OCR 插件服务.

显式设置 `"mlkit"`, `"paddle"`, `"rapid"` 或对应引擎对象后, 当前脚本固定使用该模式. 即使对应插件被禁用或卸载, 读取属性仍返回指定的名称, 识别调用会报告插件不可用, 不会自动切换引擎.

设置 `"auto"`, `""`, `null` 或 `undefined` 可恢复自动选择. 模式名称不区分大小写. 无效模式会抛出异常并保留原来的选择方式. [ocr.tap(mode)](#m-tap) 使用相同规则.

```js
/* 假设已安装并启用 Paddle v4 和 Rapid v6, 且未安装 ML Kit OCR. */
console.log(ocr.mode); // "paddle"

/* 在插件中心禁用 Paddle 后, 同一脚本下次读取将得到 "rapid". */
ocr.mode = 'paddle';
console.log(ocr.mode); // "paddle", 显式模式保持固定.

ocr.mode = 'auto';
console.log(ocr.mode); // "rapid", 恢复自动选择.

/* 以下写法也会恢复自动选择. */
ocr.mode = '';
ocr.mode = null;
ocr.mode = undefined;
```

```js
/* 持续观察插件中心的启用状态变化. */
while (true) {
    console.log(ocr.mode);
    sleep(300);
}
```

自动模式下没有可选插件时, 读取属性返回空字符串, 识别方法则抛出说明所需 OCR 插件的异常. 不会把插件不可用当作识别结果为空.

打包应用中的自动选择会检查实际包含的 Paddle/Rapid 模型和原生库, 并保留 ML Kit OCR 的外部插件调用路径. 模型检测不会初始化原生 OCR 引擎.

## [m] recognizeText

用于识别图像中的全部文本.

`recognizeText` 方法与工作模式有关. 例如工作模式为 `rapid` 时, `ocr.recognizeText(...)` 与 `ocr.rapid.recognizeText(...)` 等价.

`ocr.recognizeText(...)` 相关方法均可简写为 `ocr(...)`.

### recognizeText(options?)

**`6.4.0`** **`Overload [1-2]/9`**

- **[ options ]** { [OcrOptions](ocrOptionsType) } - OCR 识别选项
- <ins>**returns**</ins> { [string](dataTypes#string)[[]](dataTypes#array) }

识别当前屏幕截图中包含的所有文本, 返回文本数组.

`ocr.recognizeText()` 相当于以下代码的整合:

```js
images.requestScreenCapture();
let img = images.captureScreen();
ocr.recognizeText(img);
```

`ocr.recognizeText(options?)` 与 `ocr(options?)` 等价.

### recognizeText(region)

**`6.4.0`** **`Overload 3/9`**

- **region** { [OmniRegion](omniTypes#omniregion) } - OCR 识别区域
- <ins>**returns**</ins> { [string](dataTypes#string)[[]](dataTypes#array) }

识别当前屏幕截图指定区域内包含的所有文本, 返回文本数组.

`ocr.recognizeText(region)` 相当于以下代码的整合:

```js
images.requestScreenCapture();
let img = images.captureScreen();
ocr.recognizeText(img, region);
```

[ocr.recognizeText({ region: region })](#m-recognizeText) 的便捷方法.

`ocr.recognizeText(region)` 与 `ocr(region)` 等价.

关于 OCR 区域参数 `region` 的更多用法, 参阅 [OcrOptions#region](ocrOptionsType#p-region) 小节.

### recognizeText(img, options?)

**`6.3.0`** **`Overload [4-5]/9`**

- **img** { [ImageWrapper](imageWrapperType) } - 包装图像对象
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

**`6.3.0`** **`Overload 6/9`**

- **img** { [ImageWrapper](imageWrapperType) } - 包装图像对象
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

**`6.3.0`** **`Overload [7-8]/9`**

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

**`6.3.0`** **`Overload 9/9`**

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

用于识别图像中的全部文本.

`detect` 方法与工作模式有关. 例如工作模式为 `rapid` 时, `ocr.detect(...)` 与 `ocr.rapid.detect(...)` 等价.

与 [recognizeText](#m-recognizetext) 不同, `detect` 返回的结果包含更多信息, 包括 [ 文本标签, 置信度, 位置矩形 ] 等, `recognizeText` 精简了 `detect` 返回的结果, 仅包含文本标签数据.

### detect(options?)

**`6.4.0`** **`Overload [1-2]/9`**

- **[ options ]** { [OcrOptions](ocrOptionsType) } - OCR 识别选项
- <ins>**returns**</ins> { [OcrResult](dataTypes#ocrresult)[[]](dataTypes#array) }

识别当前屏幕截图中包含的所有文本, 返回 [OcrResult](dataTypes#ocrresult) 数组.

`ocr.detect()` 相当于以下代码的整合:

```js
images.requestScreenCapture();
let img = images.captureScreen();
ocr.detect(img);
```

### detect(region)

**`6.4.0`** **`Overload 3/9`**

- **region** { [OmniRegion](omniTypes#omniregion) } - OCR 识别区域
- <ins>**returns**</ins> { [OcrResult](dataTypes#ocrresult)[[]](dataTypes#array) }

识别当前屏幕截图指定区域内包含的所有文本, 返回 [OcrResult](dataTypes#ocrresult) 数组.

`ocr.detect(region)` 相当于以下代码的整合:

```js
images.requestScreenCapture();
let img = images.captureScreen();
ocr.detect(img, region);
```

同时也是 [ocr.detect({ region: region })](#m-detect) 的便捷方法.

关于 OCR 区域参数 `region` 的更多用法, 参阅 [OcrOptions#region](ocrOptionsType#p-region) 小节.

### detect(img, options?)

**`6.3.0`** **`Overload [4-5]/9`**

- **img** { [ImageWrapper](imageWrapperType) } - 包装图像对象
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

**`6.3.0`** **`Overload 6/9`**

- **img** { [ImageWrapper](imageWrapperType) } - 包装图像对象
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

**`6.3.0`** **`Overload [7-8]/9`**

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

**`6.3.0`** **`Overload 9/9`**

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

## [m+] rapid

### rapid(input?, optionsOrRegion?)

**`6.6.0`** **`[6.8.0]`**

- **[ input ]** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) | [OcrOptions](ocrOptionsType) | [OmniRegion](omniTypes#omniregion) }
- **[ optionsOrRegion ]** { [OcrOptions](ocrOptionsType) | [OmniRegion](omniTypes#omniregion) }
- <ins>**returns**</ins> { [string](dataTypes#string)[] }

固定使用 Rapid OCR 引擎识别文本, 不受 [ocr.mode](#p-mode) 影响. 参数重载与 [ocr.recognizeText](#m-recognizetext) 相同.

### rapid.recognizeText(input?, optionsOrRegion?)

**`6.6.0`** **`[6.8.0]`**

- <ins>**returns**</ins> { [string](dataTypes#string)[] }

[ocr.rapid](#m-rapid) 的显式方法形式.

### rapid.detect(input?, optionsOrRegion?)

**`6.6.0`** **`[6.8.0]`**

- <ins>**returns**</ins> { [OcrResult](dataTypes#ocrresult)[] }

固定使用 Rapid OCR 引擎并返回完整识别结果. 参数重载与 [ocr.detect](#m-detect) 相同.

## [m] tap

### tap(mode)

**`6.3.4`** **`[6.8.0]`**

- **mode** { [OcrMode](dataTypes#ocrMode) } - 固定引擎或自动选择模式
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置当前脚本的 OCR 引擎选择方式, 与 [ocr.mode](#p-mode) 的 setter 完全等价. 必须传入一个参数; `tap(undefined)` 恢复自动选择, 不带参数的 `tap()` 会抛出异常.

```js
ocr.tap('paddle'); // 固定为 Paddle OCR.
ocr.tap(ocr.rapid); // 固定为 Rapid OCR.
ocr.tap('auto'); // 恢复自动选择.
ocr.tap(''); // 同上.
ocr.tap(null); // 同上.
ocr.tap(undefined); // 同上.
```

## [m] summary

### summary()

**`6.4.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - OCR 工作模式摘要

获取 AutoJs6 OCR 功能的摘要.

摘要包含当前引擎名称, 选择方式 (`auto` 或显式模式), 以及当前可选的引擎列表.

```js
/* e.g. [ OCR summary ]
 * Current mode: mlkit
 * Mode selection: auto
 * Available modes: [ mlkit, paddle, rapid ]
 */
console.log(ocr.summary());
```

## [m] toString

### toString()

**`6.7.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - OCR 工作模式摘要

返回与 `ocr.summary()` 相同的文本.

## 工作模式与代码形式

AutoJs6 6.8.0 支持 `mlkit`, `paddle` 和 `rapid` 3 种 OCR 引擎, 默认按此顺序自动选择当前可用的插件. 可通过 [ocr.mode](#p-mode) 或 [ocr.tap](#m-tap) 固定引擎或恢复自动选择.

每个引擎对象均可直接调用, 也提供 `recognizeText` 和 `detect`:

```js
ocr.mlkit(image);
ocr.paddle.recognizeText(image);
ocr.rapid.detect(image);
```

直接调用 `ocr(...)`, `ocr.recognizeText(...)` 或 `ocr.detect(...)` 时使用当前工作模式. 使用 `ocr.mlkit`, `ocr.paddle` 或 `ocr.rapid` 时固定选择对应引擎, 更适合需要明确引擎的脚本.

自动模式下, `ocr(...)`, `ocr.recognizeText(...)` 和 `ocr.detect(...)` 每次调用都会重新选择插件, 并让 `engine`, `engineId`, `variant` 选项参与筛选. 因此单次调用可以选择不同于 `ocr.mode` 当前读值的引擎, 但不会改变脚本的选择方式. 选定的插件会用于本次调用, 已开始的识别不会因后续开关变化而主动迁移; 下一次调用会使用新的插件状态.

显式的 `options.mode` 仅作用于本次调用. 省略该属性时沿用脚本的选择方式; 显式设置 `auto`, 空字符串或 nullish 值时, 即使脚本处于固定模式, 本次调用也会自动选择. 引擎专用入口 `ocr.mlkit(...)`, `ocr.paddle(...)` 和 `ocr.rapid(...)` 的工作模式优先于 `options.mode`.
