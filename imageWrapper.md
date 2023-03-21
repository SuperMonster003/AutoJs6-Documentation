# 包装图像类 (ImageWrapper)

---

<p style="font: italic 1em sans-serif; color: #78909C">此章节待补充或完善...</p>
<p style="font: italic 1em sans-serif; color: #78909C">Marked by SuperMonster003 on Mar 2, 2023.</p>

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

## [m#] getMajor

### getMajor()

**`6.2.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) }

获取主版本号.

```js
console.log(new Version('5.2.3').getMajor()); // 5
console.log(new Version(11).getMajor()); // 11
```

## [m#] getMinor

### getMinor()

**`6.2.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) }

获取次版本号.

```js
console.log(new Version('5.2.3').getMinor()); // 2
console.log(new Version(11.9).getMinor()); // 9
```

## [m#] getPatch

### getPatch()

**`6.2.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) }

获取补丁版本号.

```js
console.log(new Version('5.2.3').getPatch()); // 3
console.log(new Version(11.9).getPatch()); // 0
```

## [m#] getSuffix

### getSuffix()

**`6.2.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) }

获取版本号后缀.

```js
console.log(new Version('5.2.3').getSuffix()); /* "" (空字符串) */

console.log(new Version('5.2.3-beta2').getSuffix()); // -beta2
console.log(new Version('5.2.3_beta2').getSuffix()); // _beta2

console.log(new Version('5.2.3 beta2').getSuffix()); /* beta2 */
console.log(new Version('5.2.3beta2').getSuffix()); /* 同上 (不推荐). */
console.log(new Version('5.2.3 beta 2').getSuffix()); /* 同上 (不推荐). */
```

即使在获取后缀时, 不同的符号会得到不同的结果, 但在比较版本大小时, 这些不同的符号不会影响比较结果:

```js
let verA = new Version('5.2.3-alpha11');
let verB = new Version('5.2.3 alpha11');

/* 两者后缀不等同. */
console.log(verA.getSuffix() === verB.getSuffix()); // false

/* 两者版本比较结果相同. */
console.log(verA.isEqual(verB)); // true
```

## [m#] isEqual

### isEqual(otherVersion)

**`6.2.0`**

- **otherVersion** { [string](dataTypes#string) | [Version](#c-version) } - 待比较版本参数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

比较版本号, 返回是否与参数对应的版本号等同.

```js
console.log(new Version('2.3').isEqual('2.3.0')); // true
console.log(new Version('2.3').isEqual(new Version('2.3.0'))); /* 同上. */
```

## [m#] isHigherThan

### isHigherThan(otherVersion)

**`6.2.0`**

- **otherVersion** { [string](dataTypes#string) | [Version](#c-version) } - 待比较版本参数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

比较版本号, 返回是否高于参数对应的版本号.

```js
console.log(new Version('2.3').isHigherThan('2.2')); // true
console.log(new Version('2.3').isHigherThan(new Version('2.2'))); /* 同上. */
```

## [m#] isLowerThan

### isLowerThan(otherVersion)

**`6.2.0`**

- **otherVersion** { [string](dataTypes#string) | [Version](#c-version) } - 待比较版本参数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

比较版本号, 返回是否低于参数对应的版本号.

```js
console.log(new Version('2.1').isLowerThan('2.2')); // true
console.log(new Version('2.1').isLowerThan(new Version('2.2'))); /* 同上. */
```

## [m#] isAtLeast

### isAtLeast(otherVersion)

**`6.2.0`** **`Overload 1/2`**

- **otherVersion** { [string](dataTypes#string) | [Version](#c-version) } - 待比较版本参数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

比较版本号, 返回是否不低于 (即大于等于) 参数对应的版本号.

```js
console.log(new Version('2.3').isAtLeast('2.2')); // true
console.log(new Version('2.3').isAtLeast(new Version('2.2'))); /* 同上. */

console.log(new Version('2.3').isAtLeast('2.3')); // true
console.log(new Version('2.3').isAtLeast(new Version('2.3'))); /* 同上. */
```

### isAtLeast(otherVersion, ignoreSuffix)

**`6.2.0`** **`Overload 2/2`**

- **otherVersion** { [string](dataTypes#string) | [Version](#c-version) } - 待比较版本参数
- **[ignoreSuffix = false]** { [boolean](dataTypes#boolean) } - 是否忽略版本后缀
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

比较版本号, 返回是否不低于 (即大于等于) 参数对应的版本号且根据 `ignoreSuffix` 参数决定是否忽略版本后缀.

```js
console.log(new Version('2.3-alpha2').isAtLeast('2.3')); // false
console.log(new Version('2.3-alpha2').isAtLeast('2.3', true)); // true
```

## [m#] getSubversionNumbers

### getSubversionNumbers()

**`6.2.0`**

- <ins>**returns**</ins> { [number](dataTypes#number)[[]](dataTypes#array) }

返回版本号所有数字部分组成的数组.

```js
console.log(new Version('2.3.5').getSubversionNumbers()); // [2, 3, 5]

/* 后缀将被忽略. */
console.log(new Version('2.3.5-alpha9').getSubversionNumbers()); // [2, 3, 5]

/* 
 * 注意虽然 '2' 与 '2.0.0' 版本比较等同,
 * 即 new Version('2').isEqual('2.0.0') 为 true,
 * 但两者 getSubversionNumbers() 不同. 
 */
console.log(new Version('2.0.0').getSubversionNumbers()); // [2, 0, 0]
console.log(new Version('2').getSubversionNumbers()); // [2]
```

## [m#] getOriginalString

### getOriginalString()

**`6.2.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) }

返回版本号原始字符串.

```js
console.log(new Version('2.3.5').getOriginalString()); // 2.3.5
console.log(new Version('2.3').getOriginalString()); // 2.3
console.log(new Version('2.3-alpha5').getOriginalString()); // 2.3-alpha5
console.log(new Version('2.0.0').getOriginalString()); // 2.0.0
console.log(new Version(2).getOriginalString()); /* 2 (字符串类型) */
```

## [m#] compareTo

### compareTo(otherVersion)

**`6.2.0`**

- **otherVersion** { [Version](#c-version) } - 待比较版本参数
- <ins>**returns**</ins> { [number](dataTypes#number) }

比较两个版本并返回比较结果数字 [ 1 / -1 / 0 ].

```js
let verA = new Version('2');
let verB = new Version('2.0.3');
let verC = new Version('2.0.5');

console.log(verA.compareTo(verB)); /* -1, 表示低于待比较版本. */
console.log(verA.compareTo(new Version('2.0.0'))); /* 0, 表示与待比较版本等同. */
console.log(verC.compareTo(verB)); /* 1, 表示高于待比较版本. */

/* 需留意 otherVersion 参数类型只能为 Version 类型. */
console.log(verA.compareTo(new Version('2.0.0'))); // 0
console.log(verA.compareTo('2.0.0')); /* 抛出异常. */
```

配合 [Array.prototype.sort](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) 可以方便地进行数组排序:

```js
let verList = [
    new Version('2.3.5'),
    new Version('2.3.5-alpha9'),
    new Version('2.3.5-beta2'),
    new Version('2.3.5-snapshot'),
    new Version('2.3.6'),
    new Version('2.3'),
];
// [ 2.3, 2.3.5-snapshot, 2.3.5-alpha9, 2.3.5-beta2, 2.3.5, 2.3.6 ]
console.log(verList.sort((a, b) => a.compareTo(b)));
```