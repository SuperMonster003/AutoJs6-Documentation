# 二维码 (QR Code)

---

<p style="font: italic 1em sans-serif; color: #78909C">此章节待补充或完善...</p>
<p style="font: italic 1em sans-serif; color: #78909C">Marked by SuperMonster003 on Oct 30, 2023.</p>

---

qrcode 模块用于识别图像中的二维码.

---

<p style="font: bold 2em sans-serif; color: #FF7043">qrcode</p>

---

[//]: # (## [@] qrcode)

[//]: # ()
[//]: # (qrcode 可作为全局对象使用:)

[//]: # ()
[//]: # (```js)

[//]: # (typeof qrcode; // "function")

[//]: # (typeof qrcode.detect; // "function")

[//]: # (typeof qrcode.recognizeText; // "function")

[//]: # (```)

```ts
interface QrCode {

    (options?: DetectOptions): string | string[] | null;
    (isAll: boolean): string | string[] | null;
    (img: ImageWrapper | string, options?: DetectOptions): string | string[] | null;
    (img: ImageWrapper | string, isAll: boolean): string | string[] | null;

    detect(options?: DetectOptions): QrCode.Result | QrCode.Result[] | null;
    detect(isAll: boolean): QrCode.Result | QrCode.Result[] | null;
    detect(img: ImageWrapper | string, options?: DetectOptions): QrCode.Result | QrCode.Result[] | null;
    detect(img: ImageWrapper | string, isAll: boolean): QrCode.Result | QrCode.Result[] | null;

    detectAll(options?: DetectOptionsWithoutIsAll): QrCode.Result[];
    detectAll(img: ImageWrapper | string, options?: DetectOptionsWithoutIsAll): QrCode.Result[];

    recognizeText(options?: DetectOptions): string | string[] | null;
    recognizeText(isAll: boolean): string | string[] | null;
    recognizeText(img: ImageWrapper | string, options?: DetectOptions): string | string[] | null;
    recognizeText(img: ImageWrapper | string, isAll: boolean): string | string[] | null;

    recognizeTexts(options?: DetectOptionsWithoutIsAll): string[];
    recognizeTexts(img: ImageWrapper | string, options?: DetectOptionsWithoutIsAll): string[];

}
```