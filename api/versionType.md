# 版本工具类 (Version)

版本工具类用于版本信息提取 (主版本号 / 次版本号 / 补丁版本号) 及版本号比较.

```js
/* 生成一个 Version 实例. */
let ver = new Version('6.1.3');

/* 获取主版本号. */
console.log(ver.getMajor()); // 6

/* 获取次版本号. */
console.log(ver.getMinor()); // 1

/* 获取补丁版本号. */
console.log(ver.getPatch()); // 3

/* 版本号比较. */
console.log(ver.isHigherThan('6.1.2')); // true
console.log(ver.isLowerThan('6.1.5')); // true
console.log(ver.isEqual('6.1.3')); // true
console.log(ver.isAtLeast('6.1.1')); // true
```

> 注: 此工具类源于 GitHub 开源项目 [G00fY2/version-compare](https://github.com/G00fY2/version-compare).

---

<p style="font: bold 2em sans-serif; color: #FF7043">Version</p>

---

## [C] Version

### [c] (versionString)

**`6.2.0`** **`Global`** **`Overload 1/2`**

- **versionString** { [string](dataTypes#string) | [number](dataTypes#number) } - 版本号参数
- <ins>**returns**</ins> { [Version](#c-version) }

使用版本号参数生成一个 Version 实例.

```js
let verA = new Version('3.0.2');
let verB = new Version('5.2.3');
```

注意版本号参数的格式要求, 只能以数字开头, 不支持 `v5.2.3` 这样的以 `v` 开头的参数形式.

版本号格式:

```text
%主版本号%[.%次版本号%[.%补丁版本号%[.%版本后缀%]]]
```

补丁版本号和次版本号及版本后缀全部是可选的, 以下构造器均是合法的:

```js
let verA = new Version('5'); /* 相当于 '5.0.0' . */
let verB = new Version('5.2'); /* 相当于 '5.2.0' . */
let verC = new Version('5.2.3');
let verD = new Version('5.2.3-alpha11'); /* alpha11 为后缀. */
```

特别地, 数字 (包含正整数及正小数) 也支持作为版本号参数使用, 它将被隐式转换为字符串类型:

```js
let verA = new Version(5); /* 相当于 '5.0.0' . */
let verB = new Version(5.2); /* 相当于 '5.2.0' . */
```

版本号结构样例:

```text
Version 1.7.3-rc2.xyz
            +-------+   +-------+   +-------+   +-------+
  String    |   1   | . |   7   | . | 3-rc2 | . |  xyz  |
            +-------+   +-------+   +-------+   +-------+
                |           |         |  |          |
  major  [1] <--            |         |   ----      |
  minor  [7] <--------------          |       | ----
  patch  [3] <------------------------        ||
         ...                            +------------+
                                suffix  |  -rc2.xyz  |
                                        +------------+
-------------------------------------------------------------------------
suffix compare logic                          ||
                                         -----  -----
                                        |            |
                                    +-------+    +-------+
              detected pre-release  |  rc2  |    | .xyz  |  ignored part
                                    +-------+    +-------+
                                       ||
                                    ---  ---
                                   |        |
                                +----+    +---+
                                | rc |    | 2 |  pre-release build
                                +----+    +---+
```

支持的后缀:

| 优先级 |     	后缀      |
|:---:|:------------:|
|  5  |    	空或未知     |
|  4  |     	rc      |
|  3  |    	beta     |
|  2  |    	alpha    |
|  1  | 	pre + alpha |
|  0  |  	snapshot   |

```js
console.log(new Version('5.2.3-beta').isHigherThan('5.2.3-snapshot')); // true
```

### [c] (versionString, throwExceptions)

**`6.2.0`** **`Global`** **`Overload 2/2`**

- **versionString** { [string](dataTypes#string) | [number](dataTypes#number) } - 版本号参数
- **[ throwExceptions = `false` ]** { [boolean](dataTypes#boolean) } - 是否在版本号参数不合法时抛出异常
- <ins>**returns**</ins> { [Version](#c-version) }

throwExceptions 参数用于控制是否在版本号参数不合法时抛出异常.

不合法的情况:

1. versionString 参数为 null
2. versionString 参数为非数字开头的字符串

```js
let verA = new Version(null, true); /* 抛出异常. */
let verB = new Version('v5.2.3', true); /* 抛出异常. */
let verC = new Version('5.2.3', true); /* 无异常. */

let verD = new Version(null); /* 无异常. */
let verE = new Version('v5.2.3'); /* 无异常. */
let verF = new Version('5.2.3'); /* 无异常. */
```

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
- **[ ignoreSuffix = `false` ]** { [boolean](dataTypes#boolean) } - 是否忽略版本后缀
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