# 包装图像类 (ImageWrapper)

---

<p style="font: italic 1em sans-serif; color: #78909C">此章节待补充或完善...</p>
<p style="font: italic 1em sans-serif; color: #78909C">Marked by SuperMonster003 on Mar 24, 2023.</p>

---

包装图像类用于 AutoJs6 的图像处理.

包装后的图像类隐藏了内部复杂的图像处理细节, 便于图像数据的 [ 生成 / 访问 / 传递 / 交互 ].

```js
util.getClassName(ImageWrapper); // org.autojs.autojs.core.image.ImageWrapper
images.read('./picture.jpg') instanceof ImageWrapper; /* ImageWrapper 实例判断. */
ImageWrapper.ofBitmap(bitmap); /* 将 Bitmap 包装为 ImageWrapper. */
```

在 [ [images](image) / [ocr](ocr) / [canvas](canvas) ] 等模块的方法中, 均或多或少地涉及 `ImageWrapper` 类型参数或返回值.

---

<p style="font: bold 2em sans-serif; color: #FF7043">ImageWrapper</p>

---

## [m#] oneShot

### oneShot()

**`6.2.0`**

- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) }

//// -=-= PENDING =-=- ////

