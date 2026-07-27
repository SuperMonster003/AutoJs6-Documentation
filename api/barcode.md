# 条码 (Barcode)

`barcode` 模块用于从图片或当前屏幕中同步识别一维码和二维码.

从 AutoJs6 6.8.0 起, 条码识别由外置 ML Kit Barcode 插件提供. 调用前需在插件中心安装, 启用并授权与当前 AutoJs6 兼容的插件. 插件缺失, 被禁用, 未授权, 版本不兼容, 服务绑定失败或调用超时时, 方法会抛出异常.

识别方法会阻塞当前脚本线程, 直至插件返回结果或调用失败. 单次调用最多返回 128 个结果.

图片参数可为 [ImageWrapper](imageWrapperType) 或图片路径 [string](dataTypes#string). 路径无法读取为图片时抛出异常. 省略图片时使用 [`images.captureScreen()`](image#m-images-capturescreen) 获取当前屏幕; 后台脚本尚未取得截图权限时会同步请求权限, UI 线程则应提前取得权限.

通过路径读取或自动截图得到的临时图片会在识别后回收. 直接传入的普通 `ImageWrapper` 不会自动回收, 但已调用 `oneShot()` 的图片会在识别后回收.

---

<p style="font: bold 2em sans-serif; color: #FF7043">barcode</p>

---

## [@] barcode

### barcode(options?, isAll?)

**`6.4.0`** **`[6.8.0]`** **`Overload 1/4`**

- **[ options = `{}` ]** { [BarcodeSelectionOptions](#barcodeselectionoptions) } - 识别选项
- **[ isAll = false ]** { [boolean](dataTypes#boolean) } - 是否返回全部文本
- <ins>**returns**</ins> { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) } - 首个文本, 全部文本或 `null`

识别当前屏幕. `isAll` 为 `false` 时返回首个结果的原始文本, 没有结果或该值为 `null` 时返回 `null`; 为 `true` 时返回全部非空原始文本, 未识别到文本时返回空数组.

如果同时提供 `options.isAll` 和末尾的 `isAll`, 末尾参数优先.

### barcode(isAll)

**`6.4.0`** **`[6.8.0]`** **`Overload 2/4`**

- **isAll** { [boolean](dataTypes#boolean) } - 是否返回全部文本
- <ins>**returns**</ins> { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) }

使用默认选项识别当前屏幕.

### barcode(image, options?, isAll?)

**`6.4.0`** **`[6.8.0]`** **`Overload 3/4`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) } - 图片或图片路径
- **[ options = `{}` ]** { [BarcodeSelectionOptions](#barcodeselectionoptions) } - 识别选项
- **[ isAll = false ]** { [boolean](dataTypes#boolean) } - 是否返回全部文本
- <ins>**returns**</ins> { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) }

识别指定图片. 末尾的 `isAll` 会覆盖 `options.isAll`.

```js
let text = barcode("./barcode.png");
console.log(text);

let texts = barcode("./codes.png", {
    format: [ "CODE_128", "QR_CODE" ],
    isAll: true,
});
console.log(texts);
```

### barcode(image, isAll)

**`6.4.0`** **`[6.8.0]`** **`Overload 4/4`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) } - 图片或图片路径
- **isAll** { [boolean](dataTypes#boolean) } - 是否返回全部文本
- <ins>**returns**</ins> { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) }

使用默认选项识别指定图片.

直接调用 `barcode(...)` 等价于调用 [`barcode.recognizeText(...)`](#m-recognizetext).

## [m] detect

### detect(options?, isAll?)

**`6.4.0`** **`[6.8.0]`** **`Overload 1/4`**

- **[ options = `{}` ]** { [BarcodeSelectionOptions](#barcodeselectionoptions) } - 识别选项
- **[ isAll = false ]** { [boolean](dataTypes#boolean) } - 是否返回全部结果
- <ins>**returns**</ins> { [WrappedBarcode](#c-wrappedbarcode) | [WrappedBarcode](#c-wrappedbarcode)[[]](dataTypes#array) | [null](dataTypes#null) } - 首个结果, 全部结果或 `null`

识别当前屏幕. `isAll` 为 `false` 时返回首个结果, 没有结果时返回 `null`; 为 `true` 时返回全部结果数组.

### detect(isAll)

**`6.4.0`** **`[6.8.0]`** **`Overload 2/4`**

- **isAll** { [boolean](dataTypes#boolean) } - 是否返回全部结果
- <ins>**returns**</ins> { [WrappedBarcode](#c-wrappedbarcode) | [WrappedBarcode](#c-wrappedbarcode)[[]](dataTypes#array) | [null](dataTypes#null) }

使用默认选项识别当前屏幕.

### detect(image, options?, isAll?)

**`6.4.0`** **`[6.8.0]`** **`Overload 3/4`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) } - 图片或图片路径
- **[ options = `{}` ]** { [BarcodeSelectionOptions](#barcodeselectionoptions) } - 识别选项
- **[ isAll = false ]** { [boolean](dataTypes#boolean) } - 是否返回全部结果
- <ins>**returns**</ins> { [WrappedBarcode](#c-wrappedbarcode) | [WrappedBarcode](#c-wrappedbarcode)[[]](dataTypes#array) | [null](dataTypes#null) }

识别指定图片. 末尾的 `isAll` 会覆盖 `options.isAll`.

```js
let result = barcode.detect("./barcode.png", {
    format: "EAN_13",
});

if (result !== null) {
    console.log(result.getFormatName());
    console.log(result.getRawValue());
}
```

### detect(image, isAll)

**`6.4.0`** **`[6.8.0]`** **`Overload 4/4`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) } - 图片或图片路径
- **isAll** { [boolean](dataTypes#boolean) } - 是否返回全部结果
- <ins>**returns**</ins> { [WrappedBarcode](#c-wrappedbarcode) | [WrappedBarcode](#c-wrappedbarcode)[[]](dataTypes#array) | [null](dataTypes#null) }

使用默认选项识别指定图片.

## [m] detectAll

### detectAll(options?)

**`6.4.0`** **`[6.8.0]`** **`Overload 1/2`**

- **[ options = `{}` ]** { [BarcodeOptions](#barcodeoptions) } - 识别选项
- <ins>**returns**</ins> { [WrappedBarcode](#c-wrappedbarcode)[[]](dataTypes#array) } - 全部识别结果

识别当前屏幕并始终返回数组. 没有结果时返回空数组.

### detectAll(image, options?)

**`6.4.0`** **`[6.8.0]`** **`Overload 2/2`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) } - 图片或图片路径
- **[ options = `{}` ]** { [BarcodeOptions](#barcodeoptions) } - 识别选项
- <ins>**returns**</ins> { [WrappedBarcode](#c-wrappedbarcode)[[]](dataTypes#array) } - 全部识别结果

识别指定图片并始终返回数组.

```js
let results = barcode.detectAll("./codes.png", {
    format: [ "CODE_128", "EAN_13" ],
});

results.forEach((result) => {
    console.log(`${result.getFormatName()}: ${result.getRawValue()}`);
});
```

## [m] recognizeText

### recognizeText(options?, isAll?)

**`6.4.0`** **`[6.8.0]`** **`Overload 1/4`**

- **[ options = `{}` ]** { [BarcodeSelectionOptions](#barcodeselectionoptions) } - 识别选项
- **[ isAll = false ]** { [boolean](dataTypes#boolean) } - 是否返回全部文本
- <ins>**returns**</ins> { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) } - 首个文本, 全部文本或 `null`

识别当前屏幕并返回结果的原始文本. `isAll` 为 `false` 时, 没有结果或首个结果的原始文本为 `null` 均返回 `null`; 为 `true` 时会过滤原始文本为 `null` 的结果.

### recognizeText(isAll)

**`6.4.0`** **`[6.8.0]`** **`Overload 2/4`**

- **isAll** { [boolean](dataTypes#boolean) } - 是否返回全部文本
- <ins>**returns**</ins> { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) }

使用默认选项识别当前屏幕.

### recognizeText(image, options?, isAll?)

**`6.4.0`** **`[6.8.0]`** **`Overload 3/4`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) } - 图片或图片路径
- **[ options = `{}` ]** { [BarcodeSelectionOptions](#barcodeselectionoptions) } - 识别选项
- **[ isAll = false ]** { [boolean](dataTypes#boolean) } - 是否返回全部文本
- <ins>**returns**</ins> { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) }

识别指定图片并返回结果的原始文本. 末尾的 `isAll` 会覆盖 `options.isAll`.

### recognizeText(image, isAll)

**`6.4.0`** **`[6.8.0]`** **`Overload 4/4`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) } - 图片或图片路径
- **isAll** { [boolean](dataTypes#boolean) } - 是否返回全部文本
- <ins>**returns**</ins> { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) }

使用默认选项识别指定图片.

## [m] recognizeTexts

### recognizeTexts(options?)

**`6.4.0`** **`[6.8.0]`** **`Overload 1/2`**

- **[ options = `{}` ]** { [BarcodeOptions](#barcodeoptions) } - 识别选项
- <ins>**returns**</ins> { [string](dataTypes#string)[[]](dataTypes#array) } - 全部非空原始文本

识别当前屏幕并始终返回数组. 原始文本为 `null` 的结果会被过滤.

### recognizeTexts(image, options?)

**`6.4.0`** **`[6.8.0]`** **`Overload 2/2`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) } - 图片或图片路径
- **[ options = `{}` ]** { [BarcodeOptions](#barcodeoptions) } - 识别选项
- <ins>**returns**</ins> { [string](dataTypes#string)[[]](dataTypes#array) } - 全部非空原始文本

识别指定图片并始终返回数组.

## BarcodeOptions

- **[ format = [] ]** { [BarcodeFormat](#barcodeformat) | [BarcodeFormat](#barcodeformat)[[]](dataTypes#array) } - 要识别的条码格式, 空数组表示全部格式
- **[ enableAllPotentialBarcodes = false ]** { [boolean](dataTypes#boolean) } - 是否返回尚无可解码值的潜在条码

`enableAllPotentialBarcodes` 为 `true` 时, 结果的原始值和显示值可能为 `null`.

## BarcodeSelectionOptions

- <ins>**extends**</ins> { [BarcodeOptions](#barcodeoptions) }
- **[ isAll = false ]** { [boolean](dataTypes#boolean) } - 是否返回全部结果

`isAll` 只影响 `barcode(...)`, `detect(...)` 和 `recognizeText(...)`. `detectAll(...)` 和 `recognizeTexts(...)` 始终返回数组.

## BarcodeFormat

- { [number](dataTypes#number) | [string](dataTypes#string) }

条码格式可使用数值或名称. 名称不区分大小写, 非字母数字字符会转换为 `_`, `FORMAT_` 前缀可省略. `QRCODE` 会转换为 `QR_CODE`.

支持的格式:

| 名称 | 数值 |
| --- | ---: |
| `ALL`, `ALL_FORMATS` | `0` |
| `CODE_128` | `1` |
| `CODE_39` | `2` |
| `CODE_93` | `4` |
| `CODABAR` | `8` |
| `DATA_MATRIX` | `16` |
| `EAN_13` | `32` |
| `EAN_8` | `64` |
| `ITF` | `128` |
| `QR_CODE`, `QRCODE` | `256` |
| `UPC_A` | `512` |
| `UPC_E` | `1024` |
| `PDF417`, `PDF_417` | `2048` |
| `AZTEC` | `4096` |

未知的字符串格式会抛出异常. 数值格式会先转换为 32 位整数再传给插件, 非整数向 `0` 截断; 非有限值或超出 32 位整数范围的值会抛出异常. 应使用表中的受支持值.

## [C] WrappedBarcode

**`6.4.0`** **`[6.8.0]`**

`WrappedBarcode` 是 `detect()` 和 `detectAll()` 返回的条码结果包装类. 普通脚本不应直接构造该类.

从 AutoJs6 6.8.0 起, 底层结果来自外置插件的 AIDL `BarcodeResult`, 结构化数据由 JSON 载荷提供.

### [p#] WrappedBarcode#barcode

**`6.4.0`** **`[6.8.0]`** **`Getter`** **`READONLY`**

- { `org.autojs.plugin.mlkit.barcode.api.BarcodeResult` } - 插件返回的底层结果

底层结果包含 `rawValue`, `displayValue`, `rawBytes`, `format`, `formatName`, `valueType`, `valueTypeName`, `boundingBox`, `cornerPoints` 和 `extras`.

### [p#] WrappedBarcode#value

**`6.6.0`** **`Getter`** **`READONLY`**

- { [string](dataTypes#string) | [null](dataTypes#null) } - 显示值

[`getDisplayValue()`](#m-wrappedbarcodegetdisplayvalue) 的属性形式.

### [m#] WrappedBarcode#getFormat()

**`6.4.0`** **`[6.8.0]`**

- <ins>**returns**</ins> { [number](dataTypes#number) } - 条码格式数值

返回结果的格式数值, 对应 [BarcodeFormat](#barcodeformat) 表.

### [m#] WrappedBarcode#getFormatName()

**`6.4.0`** **`[6.8.0]`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 条码格式名称

返回带 `FORMAT_` 前缀的规范名称. 无法识别格式时返回 `"FORMAT_NAME_UNKNOWN"`.

### [m#] WrappedBarcode#getValueType()

**`6.4.0`** **`[6.8.0]`**

- <ins>**returns**</ins> { [number](dataTypes#number) } - 值类型数值

返回条码内容的值类型.

### [m#] WrappedBarcode#getType()

**`6.4.0`**

- <ins>**returns**</ins> { [number](dataTypes#number) } - 值类型数值

[`getValueType()`](#m-wrappedbarcodegetvaluetype) 的别名.

### [m#] WrappedBarcode#getValueTypeName()

**`6.4.0`** **`[6.8.0]`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 值类型名称

返回带 `TYPE_` 前缀的规范名称.

### [m#] WrappedBarcode#getTypeName()

**`6.4.0`** **`[6.8.0]`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 值类型名称

`getValueTypeName()` 的别名. 无法识别类型时返回 `"TYPE_NAME_UNKNOWN"`.

支持的值类型:

| 名称 | 数值 |
| --- | ---: |
| `TYPE_UNKNOWN` | `0` |
| `TYPE_CONTACT_INFO` | `1` |
| `TYPE_EMAIL` | `2` |
| `TYPE_ISBN` | `3` |
| `TYPE_PHONE` | `4` |
| `TYPE_PRODUCT` | `5` |
| `TYPE_SMS` | `6` |
| `TYPE_TEXT` | `7` |
| `TYPE_URL` | `8` |
| `TYPE_WIFI` | `9` |
| `TYPE_GEO` | `10` |
| `TYPE_CALENDAR_EVENT` | `11` |
| `TYPE_DRIVER_LICENSE` | `12` |

### [m#] WrappedBarcode#getBoundingBox()

**`6.4.0`** **`[6.8.0]`**

- <ins>**returns**</ins> { [AndroidRect](androidRectType) | [null](dataTypes#null) } - 条码外接矩形

### [m#] WrappedBarcode#getCornerPoints()

**`6.4.0`** **`[6.8.0]`**

- <ins>**returns**</ins> { [android.graphics.Point](https://developer.android.com/reference/android/graphics/Point)[[]](dataTypes#array) | [null](dataTypes#null) } - 条码角点数组

插件返回的扁平坐标会按 `(x, y)` 两个一组转换为 Android Point.

### [m#] WrappedBarcode#getDisplayValue()

**`6.4.0`** **`[6.8.0]`**

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - 便于显示的格式化值

### [m#] WrappedBarcode#getRawValue()

**`6.4.0`** **`[6.8.0]`**

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - 条码原始文本

`recognizeText()` 和 `recognizeTexts()` 使用此值.

### [m#] WrappedBarcode#getRawBytes()

**`6.4.0`** **`[6.8.0]`**

- <ins>**returns**</ins> { [ByteArray](dataTypes#bytearray) | [null](dataTypes#null) } - 条码原始字节

### [m#] WrappedBarcode#getCalendarEvent()

**`6.4.0`** **`[6.8.0]`**

- <ins>**returns**</ins> { [org.json.JSONObject](https://developer.android.com/reference/org/json/JSONObject) | [null](dataTypes#null) } - 日历事件结构化数据

### [m#] WrappedBarcode#getContactInfo()

**`6.4.0`** **`[6.8.0]`**

- <ins>**returns**</ins> { [org.json.JSONObject](https://developer.android.com/reference/org/json/JSONObject) | [null](dataTypes#null) } - 联系人结构化数据

### [m#] WrappedBarcode#getDriverLicense()

**`6.4.0`** **`[6.8.0]`**

- <ins>**returns**</ins> { [org.json.JSONObject](https://developer.android.com/reference/org/json/JSONObject) | [null](dataTypes#null) } - 驾照结构化数据

### [m#] WrappedBarcode#getEmail()

**`6.4.0`** **`[6.8.0]`**

- <ins>**returns**</ins> { [org.json.JSONObject](https://developer.android.com/reference/org/json/JSONObject) | [null](dataTypes#null) } - 邮件结构化数据

### [m#] WrappedBarcode#getGeoPoint()

**`6.4.0`** **`[6.8.0]`**

- <ins>**returns**</ins> { [org.json.JSONObject](https://developer.android.com/reference/org/json/JSONObject) | [null](dataTypes#null) } - 经纬度结构化数据

### [m#] WrappedBarcode#getPhone()

**`6.4.0`** **`[6.8.0]`**

- <ins>**returns**</ins> { [org.json.JSONObject](https://developer.android.com/reference/org/json/JSONObject) | [null](dataTypes#null) } - 电话结构化数据

### [m#] WrappedBarcode#getSms()

**`6.4.0`** **`[6.8.0]`**

- <ins>**returns**</ins> { [org.json.JSONObject](https://developer.android.com/reference/org/json/JSONObject) | [null](dataTypes#null) } - 短信结构化数据

### [m#] WrappedBarcode#getUrl()

**`6.4.0`** **`[6.8.0]`**

- <ins>**returns**</ins> { [org.json.JSONObject](https://developer.android.com/reference/org/json/JSONObject) | [null](dataTypes#null) } - URL 结构化数据

### [m#] WrappedBarcode#getWifi()

**`6.4.0`** **`[6.8.0]`**

- <ins>**returns**</ins> { [org.json.JSONObject](https://developer.android.com/reference/org/json/JSONObject) | [null](dataTypes#null) } - Wi-Fi 结构化数据

上述结构化方法只在条码类型与方法匹配且插件提供对应 JSON 对象时返回数据, 其他情况返回 `null`. 对象字段由当前插件结果决定.

### [m#] WrappedBarcode#toString()

**`6.6.0`** **`[6.8.0]`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 结果摘要

摘要格式为 `[FORMAT] <TYPE> displayValue`, 其中格式名和类型名会移除 `FORMAT_` 与 `TYPE_` 前缀.

```js
let result = barcode.detect("./qrcode.png");
if (result !== null) {
    console.log(result.toString()); // [QR_CODE] <TEXT> example
}
```
