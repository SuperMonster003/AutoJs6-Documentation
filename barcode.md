# 条码 (Barcode)

---

<p style="font: italic 1em sans-serif; color: #78909C">此章节待补充或完善...</p>
<p style="font: italic 1em sans-serif; color: #78909C">Marked by SuperMonster003 on Oct 30, 2023.</p>

---

barcode 模块用于识别图像中的条码.

---

<p style="font: bold 2em sans-serif; color: #FF7043">barcode</p>

---

[//]: # (## [@] barcode)

[//]: # ()
[//]: # (barcode 可作为全局对象使用:)

[//]: # ()
[//]: # (```js)

[//]: # (typeof barcode; // "function")

[//]: # (typeof barcode.detect; // "function")

[//]: # (typeof barcode.recognizeText; // "function")

[//]: # (```)

```ts
interface Barcode {

    (options?: DetectOptions): string | string[] | null;
    (isAll: boolean): string | string[] | null;
    (img: ImageWrapper | string, options?: DetectOptions): string | string[] | null;
    (img: ImageWrapper | string, isAll: boolean): string | string[] | null;

    detect(options?: DetectOptions): Barcode.Result | Barcode.Result[] | null;
    detect(isAll: boolean): Barcode.Result | Barcode.Result[] | null;
    detect(img: ImageWrapper | string, options?: DetectOptions): Barcode.Result | Barcode.Result[] | null;
    detect(img: ImageWrapper | string, isAll: boolean): Barcode.Result | Barcode.Result[] | null;

    detectAll(options?: DetectOptionsWithoutIsAll): Barcode.Result[];
    detectAll(img: ImageWrapper | string, options?: DetectOptionsWithoutIsAll): Barcode.Result[];

    recognizeText(options?: DetectOptions): string | string[] | null;
    recognizeText(isAll: boolean): string | string[] | null;
    recognizeText(img: ImageWrapper | string, options?: DetectOptions): string | string[] | null;
    recognizeText(img: ImageWrapper | string, isAll: boolean): string | string[] | null;

    recognizeTexts(options?: DetectOptionsWithoutIsAll): string[];
    recognizeTexts(img: ImageWrapper | string, options?: DetectOptionsWithoutIsAll): string[];

}
```