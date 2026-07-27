# 二维码 (QR Code)

`qrcode` 模块用于从图片或当前屏幕中同步识别二维码.

从 AutoJs6 6.8.0 起, 二维码识别由外置 ML Kit Barcode 插件提供. 调用前需在插件中心安装, 启用并授权与当前 AutoJs6 兼容的插件. 插件缺失, 被禁用, 未授权, 版本不兼容, 服务绑定失败或调用超时时, 方法会抛出异常.

识别方法会阻塞当前脚本线程, 直至插件返回结果或调用失败. 单次调用最多返回 128 个结果.

图片参数可为 [ImageWrapper](imageWrapperType) 或图片路径 [string](dataTypes#string). 路径无法读取为图片时抛出异常. 省略图片时使用 [`images.captureScreen()`](image#m-images-capturescreen) 获取当前屏幕; 后台脚本尚未取得截图权限时会同步请求权限, UI 线程则应提前取得权限.

通过路径读取或自动截图得到的临时图片会在识别后回收. 直接传入的普通 `ImageWrapper` 不会自动回收, 但已调用 `oneShot()` 的图片会在识别后回收.

`qrcode` 只启用 `QR_CODE` 格式. 如需同时识别其他条码格式, 使用 [`barcode`](barcode).

---

<p style="font: bold 2em sans-serif; color: #FF7043">qrcode</p>

---

## [@] qrcode

### qrcode(options?, isAll?)

**`6.4.0`** **`[6.8.0]`** **`Overload 1/4`**

- **[ options = `{}` ]** { [QrCodeSelectionOptions](#qrcodeselectionoptions) } - 识别选项
- **[ isAll = false ]** { [boolean](dataTypes#boolean) } - 是否返回全部文本
- <ins>**returns**</ins> { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) } - 首个文本, 全部文本或 `null`

识别当前屏幕. `isAll` 为 `false` 时返回首个结果的原始文本, 没有结果或该值为 `null` 时返回 `null`; 为 `true` 时返回全部非空原始文本, 未识别到文本时返回空数组.

如果同时提供 `options.isAll` 和末尾的 `isAll`, 末尾参数优先.

### qrcode(isAll)

**`6.4.0`** **`[6.8.0]`** **`Overload 2/4`**

- **isAll** { [boolean](dataTypes#boolean) } - 是否返回全部文本
- <ins>**returns**</ins> { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) }

使用默认选项识别当前屏幕.

### qrcode(image, options?, isAll?)

**`6.4.0`** **`[6.8.0]`** **`Overload 3/4`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) } - 图片或图片路径
- **[ options = `{}` ]** { [QrCodeSelectionOptions](#qrcodeselectionoptions) } - 识别选项
- **[ isAll = false ]** { [boolean](dataTypes#boolean) } - 是否返回全部文本
- <ins>**returns**</ins> { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) }

识别指定图片. 末尾的 `isAll` 会覆盖 `options.isAll`.

```js
let text = qrcode("./qrcode.png");
console.log(text);

let texts = qrcode("./qrcodes.png", {
    enableAllPotentialQrCodes: true,
    isAll: true,
});
console.log(texts);
```

### qrcode(image, isAll)

**`6.4.0`** **`[6.8.0]`** **`Overload 4/4`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) } - 图片或图片路径
- **isAll** { [boolean](dataTypes#boolean) } - 是否返回全部文本
- <ins>**returns**</ins> { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) | [null](dataTypes#null) }

使用默认选项识别指定图片.

直接调用 `qrcode(...)` 等价于调用 [`qrcode.recognizeText(...)`](#m-recognizetext).

## [m] detect

### detect(options?, isAll?)

**`6.4.0`** **`[6.8.0]`** **`Overload 1/4`**

- **[ options = `{}` ]** { [QrCodeSelectionOptions](#qrcodeselectionoptions) } - 识别选项
- **[ isAll = false ]** { [boolean](dataTypes#boolean) } - 是否返回全部结果
- <ins>**returns**</ins> { [WrappedBarcode](barcode#c-wrappedbarcode) | [WrappedBarcode](barcode#c-wrappedbarcode)[[]](dataTypes#array) | [null](dataTypes#null) } - 首个结果, 全部结果或 `null`

识别当前屏幕. `isAll` 为 `false` 时返回首个结果, 没有结果时返回 `null`; 为 `true` 时返回全部结果数组.

### detect(isAll)

**`6.4.0`** **`[6.8.0]`** **`Overload 2/4`**

- **isAll** { [boolean](dataTypes#boolean) } - 是否返回全部结果
- <ins>**returns**</ins> { [WrappedBarcode](barcode#c-wrappedbarcode) | [WrappedBarcode](barcode#c-wrappedbarcode)[[]](dataTypes#array) | [null](dataTypes#null) }

使用默认选项识别当前屏幕.

### detect(image, options?, isAll?)

**`6.4.0`** **`[6.8.0]`** **`Overload 3/4`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) } - 图片或图片路径
- **[ options = `{}` ]** { [QrCodeSelectionOptions](#qrcodeselectionoptions) } - 识别选项
- **[ isAll = false ]** { [boolean](dataTypes#boolean) } - 是否返回全部结果
- <ins>**returns**</ins> { [WrappedBarcode](barcode#c-wrappedbarcode) | [WrappedBarcode](barcode#c-wrappedbarcode)[[]](dataTypes#array) | [null](dataTypes#null) }

识别指定图片. 末尾的 `isAll` 会覆盖 `options.isAll`.

```js
let result = qrcode.detect("./qrcode.png");
if (result !== null) {
    console.log(result.getRawValue());
    console.log(result.getBoundingBox());
}
```

### detect(image, isAll)

**`6.4.0`** **`[6.8.0]`** **`Overload 4/4`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) } - 图片或图片路径
- **isAll** { [boolean](dataTypes#boolean) } - 是否返回全部结果
- <ins>**returns**</ins> { [WrappedBarcode](barcode#c-wrappedbarcode) | [WrappedBarcode](barcode#c-wrappedbarcode)[[]](dataTypes#array) | [null](dataTypes#null) }

使用默认选项识别指定图片.

## [m] detectAll

### detectAll(options?)

**`6.4.0`** **`[6.8.0]`** **`Overload 1/2`**

- **[ options = `{}` ]** { [QrCodeOptions](#qrcodeoptions) } - 识别选项
- <ins>**returns**</ins> { [WrappedBarcode](barcode#c-wrappedbarcode)[[]](dataTypes#array) } - 全部识别结果

识别当前屏幕并始终返回数组. 没有结果时返回空数组.

### detectAll(image, options?)

**`6.4.0`** **`[6.8.0]`** **`Overload 2/2`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) } - 图片或图片路径
- **[ options = `{}` ]** { [QrCodeOptions](#qrcodeoptions) } - 识别选项
- <ins>**returns**</ins> { [WrappedBarcode](barcode#c-wrappedbarcode)[[]](dataTypes#array) } - 全部识别结果

识别指定图片并始终返回数组.

```js
let results = qrcode.detectAll("./qrcodes.png");
results.forEach((result) => {
    console.log(result.getRawValue());
});
```

## [m] recognizeText

### recognizeText(options?, isAll?)

**`6.4.0`** **`[6.8.0]`** **`Overload 1/4`**

- **[ options = `{}` ]** { [QrCodeSelectionOptions](#qrcodeselectionoptions) } - 识别选项
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
- **[ options = `{}` ]** { [QrCodeSelectionOptions](#qrcodeselectionoptions) } - 识别选项
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

- **[ options = `{}` ]** { [QrCodeOptions](#qrcodeoptions) } - 识别选项
- <ins>**returns**</ins> { [string](dataTypes#string)[[]](dataTypes#array) } - 全部非空原始文本

识别当前屏幕并始终返回数组. 原始文本为 `null` 的结果会被过滤.

### recognizeTexts(image, options?)

**`6.4.0`** **`[6.8.0]`** **`Overload 2/2`**

- **image** { [ImageWrapper](imageWrapperType) | [string](dataTypes#string) } - 图片或图片路径
- **[ options = `{}` ]** { [QrCodeOptions](#qrcodeoptions) } - 识别选项
- <ins>**returns**</ins> { [string](dataTypes#string)[[]](dataTypes#array) } - 全部非空原始文本

识别指定图片并始终返回数组.

## QrCodeOptions

- **[ enableAllPotentialQrCodes = false ]** { [boolean](dataTypes#boolean) } - 是否返回尚无可解码值的潜在二维码
- **[ enableAllPotentialBarcodes = false ]** { [boolean](dataTypes#boolean) } - `enableAllPotentialQrCodes` 的兼容别名

`enableAllPotentialQrCodes` 从 AutoJs6 6.6.0 起可用. 仅当未提供该属性时才读取兼容别名 `enableAllPotentialBarcodes`. 启用后, 结果的原始值和显示值可能为 `null`.

`format` 选项在此模块中无效, 识别格式始终为 `QR_CODE`.

## QrCodeSelectionOptions

- <ins>**extends**</ins> { [QrCodeOptions](#qrcodeoptions) }
- **[ isAll = false ]** { [boolean](dataTypes#boolean) } - 是否返回全部结果

`isAll` 只影响 `qrcode(...)`, `detect(...)` 和 `recognizeText(...)`. `detectAll(...)` 和 `recognizeTexts(...)` 始终返回数组.

## 识别结果

`detect()` 和 `detectAll()` 返回 [`WrappedBarcode`](barcode#c-wrappedbarcode) 对象. 该类提供原始文本, 显示值, 外接矩形, 角点和值类型相关的结构化数据. `qrcode` 的识别请求固定使用 `FORMAT_QR_CODE`, 数值为 `256`.
