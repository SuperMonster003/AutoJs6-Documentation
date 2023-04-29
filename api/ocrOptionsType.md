## OcrOptions

OcrOptions 是一个代表 OCR 识别选项的接口.

---

<p style="font: bold 2em sans-serif; color: #FF7043">OcrOptions</p>

---

### [p?] region

- { [OmniRegion](omniTypes#omniregion) }

指定 OCR 识别的区域.

当 `region` 值为 `undefined` 时, 表示不指定区域限制.  
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