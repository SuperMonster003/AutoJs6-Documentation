# OcrOptions

OcrOptions 是一个代表 OCR 识别选项的接口.

Node.js 与 Bun 的 OCR 方法接受相同的选项, 含义与默认值与 Rhino 一致. 宿主选定插件后按其引擎解析选项, 因此 Paddle OCR 选项不作用于其他引擎, 这一点也与 Rhino 相同.

---

<p style="font: bold 2em sans-serif; color: #FF7043">OcrOptions</p>

---

### [p?] region

- { [OmniRegion](omniTypes#omniregion) }

指定 OCR 识别的区域.

当 `region` 值为 `undefined` 时, 表示不指定区域限制.<br>
当 `region` 值为 `null` 时, 表示空区域, 此时 [ocr](ocr) 模块的相关方法将返回空结果 (如空数组).

#### number[]

可使用数组表示区域, 数组中包含 4 个数字:

```text
[ x, y, w, h ]

x - number - X 坐标 (像素值或百分比)
y - number - Y 坐标 (像素值或百分比)
w - number - 区域宽度 (像素值或百分比)
h - number - 区域高度 (像素值或百分比)
```

```js
/* 识别本地 testA.png 图像文件中的文本内容, 区域为 [ 0, 0, 150, 300 ]. */

let regionA = [ 0, 0, 150, 300 ];
ocr('testA.png', regionA);

/* 识别本地 testB.png 图像文件中的文本内容, */
/* 区域为 [ 0, 0, 0.5, 0.8 ], */
/* 即以 (0, 0) 为起点, 宽为 50% 屏幕宽度, 高为 80% 屏幕高度. */

let regionB = [ 0, 0, 0.5, 0.8 ];
ocr('testB.png', regionB);

/* 识别本地 testC.png 图像文件中的文本内容, */
/* 区域为 [ 0, 0.2, -1, 0.6 ], */
/* 即以 (0, 20% 屏幕高度) 为起点, 宽为 100% 屏幕宽度, 高为 60% 屏幕高度. */

let regionC = [ 0, 0.2, -1, 0.8 ];
ocr('testC.png', regionC);
```

#### AndroidRect

也可使用 [AndroidRect](androidRectType) 表示区域:

```js
/* 识别本地 test.png 图像文件中的文本内容, 区域为文本 "点击开始" 所在的控件矩形. */

let bounds = pickup('点击开始', 'bounds'); /* bounds 是一个 AndroidRect 实例. */
ocr('test.png', { region: bounds });
```

---

### [p?] mode

**`6.8.0`**

- { [OcrMode](dataTypes#ocrMode) }

指定本次调用的 OCR 选择方式, 不修改脚本的 [ocr.mode](ocr#p-mode).

省略此属性时使用脚本当前的选择方式. 显式传入 `"auto"`, `""`, `null` 或 `undefined` 时, 本次调用按 ML Kit OCR, Paddle OCR, Rapid OCR 的顺序选择当前可用且符合插件筛选条件的引擎.

`ocr.mlkit(...)`, `ocr.paddle(...)` 和 `ocr.rapid(...)` 使用各自固定的工作模式, 忽略本选项.

---

### [p?] engineId

**`6.8.0`**

- { [string](dataTypes#string) }

指定 OCR 插件引擎标识. 空字符串不会传递给插件.

---

### [p?] engine

**`6.8.0`**

- { [string](dataTypes#string) }

指定 OCR 插件引擎名称. 空字符串不会传递给插件.

---

### [p?] variant

**`6.8.0`**

- { [string](dataTypes#string) }

指定 OCR 引擎变体.

Paddle OCR 的 PP-OCRv3 有两个变体: `"v3"` 为 ONNX Runtime 版插件, `"v3-paddle-lite"` 为 Paddle Lite 版插件.

未指定 `engineId`, `variant` 和 [profile](#p-profile) 且插件中心未设置优先级时, 选择版本号最高的 Paddle OCR 插件; 版本号相同时优先选择声明为移动端默认的插件 (PP-OCRv3 为 ONNX Runtime 中文档), 仍然相同时按包名排序.

```js
ocr.paddle(img, { variant: 'v3-paddle-lite' }); // 使用 Paddle Lite 版.
```

Rapid OCR 模式会将 `v3` 和 `v6` 分别规范化为 `pp-ocrv3` 和 `pp-ocrv6`.

---

### [p?] profile

**`6.8.0`**

- { [string](dataTypes#string) }

指定 OCR 插件配置档案. 空字符串不会传递给插件.

此选项参与插件匹配: 只选择声明了相同配置档案的插件, 未声明配置档案的插件不匹配. 没有匹配的插件时, 调用会报告插件不可用.

PP-OCRv3 的配置档案对应语种包: `"zh"`, `"en"`, `"zh-hant"`, `"ja"`, `"ko"`, `"latin"`, `"arabic"`, `"cyrillic"`, `"devanagari"`, `"te"`, `"ka"`, `"ta"`, 使用前需安装对应的语种包插件. Paddle OCR 的其他版本也可使用此选项, 如 PP-OCRv4 的 `"mobile"`, `"server"`, `"mobile-en"`.

`"arabic"` 的结果按从右到左的阅读顺序返回, 打包应用的内置引擎与 [mergeLine](#p-mergeline) 同样如此. `"devanagari"`, `"te"`, `"ka"`, `"ta"` 的模型对连字和写在辅音前面的元音符号识别较弱, 这类文字可能读错或漏读.

```js
ocr.paddle(img, { profile: 'ja' }); // 使用 PP-OCRv3 日语语种包.
ocr.detect(img, { engine: 'paddle', profile: 'en' }); // 通用入口走同一条路径.
```

---

### [p?] useRaw

**`6.8.0`**

- [ `true` ] { [boolean](dataTypes#boolean) }

是否将原始图像直接传递给 OCR 插件.

此选项仅在 Android API 27 及以上生效.

---

### [p?] raw

**`6.8.0`**

- [ `false` ] { [boolean](dataTypes#boolean) }

[useRaw](#p-useraw) 的兼容别名. `raw` 与 `useRaw` 任一为 `true` 时启用原始图像传递.

---

### [p?] imageQuality

**`6.8.0`**

- [ `-1` ] { [number](dataTypes#number) }

指定传递给 OCR 插件的图像质量. 仅当值大于 `0` 时传递.

---

### [p?] imageFormat

**`6.8.0`**

- [ `""` ] { [string](dataTypes#string) }

指定传递给 OCR 插件的图像格式. 空字符串不会传递给插件.

---

## Paddle 与 Rapid OCR 选项

以下选项同时适用于 `paddle` 和 `rapid` 模式.

### [p?] detLongSize

- { [number](dataTypes#number) }

指定文本检测输入图像的长边尺寸.

Paddle OCR 模式的默认值为 `0`. Rapid OCR 模式将此值作为 [maxSideLen](#p-maxsidelen) 的后备值, 最终值小于等于 `0` 时采用 `1024`.

---

### [p?] scoreThreshold

- { [number](dataTypes#number) }

指定识别结果的置信度阈值.

Paddle OCR 模式的默认值为 `-1`. Rapid OCR 模式未指定此选项时采用 [boxScoreThresh](#p-boxscorethresh) 的值.

---

## Paddle OCR 选项

以下选项适用于 `paddle` 模式.

### [p?] cpuThreadNum

- [ `4` ] { [number](dataTypes#number) }

指定 OCR 使用的 CPU 线程数.

---

### [p?] useSlim

- [ `true` ] { [boolean](dataTypes#boolean) }

是否使用精简模型.

PP-OCRv3 的 ONNX Runtime 版使用 int8 量化模型作为精简模型, Paddle Lite 版使用官方 slim 模型.

---

### [p?] useCls

**`6.8.0`**

- [ `false` ] { [boolean](dataTypes#boolean) }

是否在识别前运行文字方向分类.

开启后可纠正倒置 (旋转 180 度) 的文字, 耗时增加约 5-10%. 仅支持方向分类的插件使用此选项; 未设置时不传递给插件, 由插件保持自身的默认行为. PP-OCRv3 的 ONNX Runtime 版缺省不运行分类.

---

### [p?] useOpenCL

- [ `false` ] { [boolean](dataTypes#boolean) }

是否启用 OpenCL.

PP-OCRv3 的 ONNX Runtime 版没有 OpenCL 后端, 此选项映射为 NNAPI 执行提供器; Android API 低于 27 或 NNAPI 不可用时回退到 CPU. 实际使用的执行提供器可通过识别结果的 [extras](dataTypes#p-extras) 读取:

```js
let [result] = ocr.paddle.detect(img, { useOpenCL: true });
console.log(result.extras.executionProvider); // "nnapi" 或 "cpu".
```

---

### [p?] mergeLine

- [ `false` ] { [boolean](dataTypes#boolean) }

是否将同一文本行的识别结果合并. 片段按阅读顺序拼接, 从右到左的文字 (如 [profile](#p-profile) 为 `"arabic"`) 从最右边的片段开始.

合并后的 [extras](dataTypes#p-extras) 只保留各片段取值相同的键.

此选项只作用于返回 [OcrResult](dataTypes#ocrresult) 的方法, 如 [ocr.detect](ocr#m-detect). [recognizeText](ocr#m-recognizetext) 不合并.

当 [splitWords](#p-splitwords) 或 [useWordSegmentation](#p-usewordsegmentation) 为 `true` 时, 此选项强制按 `false` 处理.

---

### [p?] splitWords

- [ `false` ] { [boolean](dataTypes#boolean) }

是否保留按词拆分的结果. 当前实现使用此选项关闭 [mergeLine](#p-mergeline).

---

### [p?] useWordSegmentation

- [ `false` ] { [boolean](dataTypes#boolean) }

是否保留分词结果. 当前实现使用此选项关闭 [mergeLine](#p-mergeline).

---

### [p?] detLimitSideLen

- [ `0` ] { [number](dataTypes#number) }

指定传递给 Paddle OCR 插件的文本检测边长限制. 仅当值大于 `0` 时传递.

---

## Rapid OCR 选项

以下选项适用于 `rapid` 模式.

### [p?] maxSideLen

- [ `1024` ] { [number](dataTypes#number) }

指定文本检测输入图像的最大边长.

未指定时先采用 [detLongSize](#p-detlongsize) 的值. 最终值小于等于 `0` 时采用 `1024`.

---

### [p?] boxScoreThresh

- [ `0.5` ] { [number](dataTypes#number) }

指定文本框置信度阈值.
