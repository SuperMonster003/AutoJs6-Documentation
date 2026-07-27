# OcrOptions

OcrOptions 是一个代表 OCR 识别选项的接口.

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

Rapid OCR 模式会将 `v3` 和 `v6` 分别规范化为 `pp-ocrv3` 和 `pp-ocrv6`.

---

### [p?] profile

**`6.8.0`**

- { [string](dataTypes#string) }

指定 OCR 插件配置档案. 空字符串不会传递给插件.

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

---

### [p?] useOpenCL

- [ `false` ] { [boolean](dataTypes#boolean) }

是否启用 OpenCL.

---

### [p?] mergeLine

- [ `false` ] { [boolean](dataTypes#boolean) }

是否将同一文本行的识别结果合并.

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
