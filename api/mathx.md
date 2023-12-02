# Mathx (Math 扩展)

Mathx 用于扩展 JavaScript 标准内置对象 Math 的功能 (参阅 [内置对象扩展](glossaries#内置对象扩展)).

Mathx 全局可用:

```js
console.log(typeof Mathx); // "object"
console.log(typeof Mathx.sum); // "function"
```

当启用内置扩展后, Mathx 将被应用在 Math 上:

```js
console.log(typeof Math.sum); // "function"
```

## 启用内置扩展

内置扩展默认被禁用, 以下任一方式可启用内置扩展:

- 在脚本中加入代码片段: `plugins.extendAll();` 或 `plugins.extend('Math');`
- AutoJs6 应用设置 - 扩展性 - JavaScript 内置对象扩展 - [ 启用 ]

当上述应用设置启用时, 所有脚本均默认启用内置扩展.  
当上述应用设置禁用时, 只有加入上述代码片段的脚本才会启用内置扩展.  
内置扩展往往是不安全的, 除非明确了解内置扩展的原理及风险, 否则不建议启用.

> 注: 因 Mathx 所有属性及方法均为 "针对对象的内置对象扩展", 在启用内置对象扩展时, 使用方法仅仅是 Mathx 与 Math 的差别, 故示例代码中将不再赘述相关示例, 但别名方法例外 (如 min 的别名 mini, max 的别名 maxi 等).

---

<p style="font: bold 2em sans-serif; color: #FF7043">Mathx</p>

---

## [m] randInt

randInt 用于返回一个指定范围内的随机整数.

因 NaN 不属于整数范畴, 故 randInt 内部实现对范围数值中出现的 NaN 做了过滤处理, 进而使 NaN 失去了常见的传染性.

```js
/* NaN 不属于整数范畴. */
console.log(Number.isInteger(NaN)); // false

/* NaN 出现在范围数值中时将失去其传染性. */
console.log(Number.isNaN(Mathx.randInt(1, NaN))); // false
```

若范围数值中出现非整数数值, 将范围中极小值作 `Math.ceil()` 处理, 极大值作 `Math.floor()` 处理.

```js
console.log(Mathx.randInt(1.8, 3.3)); /* 视为 randInt(2, 3). */
console.log(Mathx.randInt(-9.7, -2.4)); /* 视为 randInt(-9, -3). */
```

### randInt(start, stop)

**`6.2.0`** **`xObject`** **`Overload 1/5`**

- **start** { [number](dataTypes#number) } - 范围起点 (含)
- **stop** { [number](dataTypes#number) } - 范围止点 (含)
- <ins>**returns**</ins> { [number](dataTypes#number) } - 范围内随机整数

返回一个指定范围内的随机整数.

```js
/* 10 - 20 的随机整数. */
console.log(Mathx.randInt(10, 20)); // e.g. 13

/* start 和 stop 可自动交换. */
console.log(Mathx.randInt(20, 10)); /* 与 randInt(10, 20) 效果相同. */

/* start 与 stop 相等时返回唯一值. */
console.log(Mathx.randInt(15, 15)); // 15
```

### randInt(stop)

**`6.2.0`** **`xObject`** **`Overload 2/5`**

- **stop** { [number](dataTypes#number) } - 范围止点 (含)
- <ins>**returns**</ins> { [number](dataTypes#number) } - 范围内随机整数

返回一个指定范围内的随机整数, stop 参数作为止点, 0 作为起点.  
相当于 `randInt(0, stop)`.  
当 stop 为负数时, 起止点将自动交换.

```js
/* 10 - 20 的随机整数. */
console.log(Mathx.randInt(10, 20)); // e.g. 13

/* start 和 stop 可自动交换. */
console.log(Mathx.randInt(20, 10)); /* 与 randInt(10, 20) 效果相同. */

/* start 与 stop 相等时返回唯一值. */
console.log(Mathx.randInt(15, 15)); // 15
```

### randInt(range?)

**`6.2.0`** **`xObject`** **`Overload [3-4]/5`**

- **[ range = [ [MIN_SAFE_INTEGER](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER), [MAX_SAFE_INTEGER](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER) ] ]** { [number](dataTypes#number)[[]](dataTypes#array) } - 范围数组 (含两边界)
- <ins>**returns**</ins> { [number](dataTypes#number) } - 范围内随机整数

返回一个指定范围内的随机整数.

```js
/* 10 - 20 的随机整数. */
console.log(Mathx.randInt([ 10, 20 ])); // e.g. 13

/* 范围数组中的数字没有数量限制, 排序后将两个极值作为边界. */
console.log(Mathx.randInt([ 20, 10, 13, 11, 15 ])); /* 与 randInt([ 10, 20 ]) 效果相同. */

/* 范围数组中排序后极值相同时将直接返回此极值. */
console.log(Mathx.randInt([ 15, 15, 15 ])); // 15

/* 范围数组为空数组或省略参数时将返回任意 "安全" 整数. */
console.log(Mathx.randInt([])); // e.g. -7217922776918875
console.log(Mathx.randInt([ Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER ])); /* 效果同上. */
console.log(Mathx.randInt()); /* 效果同上. */
```

### randInt(...numbers)

**`6.2.0`** **`xObject`** **`Overload 5/5`**

- **numbers** { [...](documentation#可变参数)[number](dataTypes#number)[[]](documentation#可变参数) } - 范围数组 (含两边界)
- <ins>**returns**</ins> { [number](dataTypes#number) } - 范围内随机整数

返回一个指定范围内的随机整数.

```js
/* 10 - 20 的随机整数. */
console.log(Mathx.randInt(10, 20)); // e.g. 13

/* 可变参数没有数量限制, 排序后将两个极值作为边界. */
console.log(Mathx.randInt(20, 10, 13, 11, 15)); /* 与 randInt(10, 20) 效果相同. */

/* 可变参数排序后极值相同时将直接返回此极值. */
console.log(Mathx.randInt(15, 15, 15)); // 15
```

## [m] sum

求和.

### sum(...numbers)

**`6.2.0`** **`xObject`** **`Overload 1/3`**

- **numbers** { [...](documentation#可变参数)[number](dataTypes#number)[[]](documentation#可变参数) } - 待求和数字
- <ins>**returns**</ins> { [number](dataTypes#number) }

返回所有数字的加和结果.

```js
/* 整数求和. */
console.log(Mathx.sum(1, 2, 3)); // 6
console.log(Mathx.sum(9)); // 9

/* 浮点数求和. */
console.log(Mathx.sum(0.1, 0.1)); // 0.2
console.log(Mathx.sum(0.1, 0.2, 0.3)); // 0.6000000000000001

/* NaN 保持其传染性. */
console.log(Mathx.sum(7, 8, 9, NaN)); // NaN

/* 无参将返回 NaN. */
console.log(Mathx.sum()); // NaN

/* 元素将被 Number 化. */
console.log(Mathx.sum('1', '2', '3')); // 6
console.log(Mathx.sum({ valueOf: () => 11 }, { valueOf: () => 12 })); // 23

/* 嵌套将被展平. */
console.log(Mathx.sum(1, [ 2, [ 3, [ 4 ] ], 5 ])); // 15
```

### sum(numbers, fraction?)

**`6.2.0`** **`xObject`** **`Overload [2-3]/3`**

- **numbers** { [number](dataTypes#number)[[]](dataTypes#array) } - 待求和数字数组
- **[ fraction = undefined ]** { [number](dataTypes#number) } - 小数点后的数字个数
- <ins>**returns**</ins> { [number](dataTypes#number) }

返回数组内数字的加和结果, 并根据 fraction 参数进行可能的四舍五入.

```js
console.log(Mathx.sum([ 1, 2, 3 ])); // 6
console.log(Mathx.sum([ 1, 2, [ 3 ] ])); // 6
console.log(Mathx.sum([ 0.1, 0.2, 0.309 ], 2)); // 0.61
console.log(Mathx.sum([ 0.1, 0.2, 0.309 ], 10)); // 0.609
console.log(Mathx.sum([ 0.1, 0.2, 0.309 ], 0)); // 1
```

## [m] avg

算术平均数.

### avg(...numbers)

**`6.2.0`** **`xObject`** **`Overload 1/3`**

- **numbers** { [...](documentation#可变参数)[number](dataTypes#number)[[]](documentation#可变参数) } - 待求算术平均值的数字
- <ins>**returns**</ins> { [number](dataTypes#number) }

返回所有数字的算术平均值.

```js
/* 常规运算. */
console.log(Mathx.avg(1, 2, 3)); // 2
console.log(Mathx.avg(9)); // 9
console.log(Mathx.avg(0.1, 0.1)); // 0.1
console.log(Mathx.avg(0.1, 0.2, 0.3)); // 0.20000000000000004

/* NaN 保持其传染性. */
console.log(Mathx.avg(7, 8, 9, NaN)); // NaN

/* 无参将返回 NaN. */
console.log(Mathx.avg()); // NaN

/* 元素将被 Number 化. */
console.log(Mathx.avg('1', '2', '3')); // 2
console.log(Mathx.avg({ valueOf: () => 11 }, { valueOf: () => 12 })); // 11.5

/* 嵌套将被展平. */
console.log(Mathx.avg(1, [ 2, [ 3, [ 4 ] ], 5 ])); // 3
```

### avg(numbers, fraction?)

**`6.2.0`** **`xObject`** **`Overload [2-3]/3`**

- **numbers** { [number](dataTypes#number)[[]](dataTypes#array) } - 待求算术平均值数字数组
- **[ fraction = undefined ]** { [number](dataTypes#number) } - 小数点后的数字个数
- <ins>**returns**</ins> { [number](dataTypes#number) }

返回数组内数字的算术平均值, 并根据 fraction 参数进行可能的四舍五入.

```js
console.log(Mathx.avg([ 1, 2, 3 ])); // 2
console.log(Mathx.avg([ 1, 2, [ 3 ] ])); // 2
console.log(Mathx.avg([ 0.1, 0.2, 0.309 ], 2)); // 0.2
console.log(Mathx.avg([ 0.1, 0.2, 0.309 ], 10)); // 0.203
console.log(Mathx.avg([ 0.1, 0.2, 0.309 ], 0)); // 0
```

## [m] median

中位数.

### median(...numbers)

**`6.2.0`** **`xObject`** **`Overload 1/3`**

- **numbers** { [...](documentation#可变参数)[number](dataTypes#number)[[]](documentation#可变参数) } - 待求中位数的数字
- <ins>**returns**</ins> { [number](dataTypes#number) }

返回所有数字的中位数.

```js
/* 常规运算. */
console.log(Mathx.median(1, 2, 3)); // 2
console.log(Mathx.median(9)); // 9
console.log(Mathx.median(0.1, 0.1)); // 0.1
console.log(Mathx.median(0.1, 0.2, 0.3)); // 0.2

/* NaN 保持其传染性. */
console.log(Mathx.median(7, 8, 9, NaN)); // NaN

/* 无参将返回 NaN. */
console.log(Mathx.median()); // NaN

/* 元素将被 Number 化. */
console.log(Mathx.median('1', '2', '3')); // 2
console.log(Mathx.median({ valueOf: () => 11 }, { valueOf: () => 12 })); // 11.5

/* 嵌套将被展平. */
console.log(Mathx.median(1, [ 2, [ 3, [ 4 ] ], 5 ])); // 3
```

### median(numbers, fraction?)

**`6.2.0`** **`xObject`** **`Overload [2-3]/3`**

- **numbers** { [number](dataTypes#number)[[]](dataTypes#array) } - 待求中位数数字数组
- **[ fraction = undefined ]** { [number](dataTypes#number) } - 小数点后的数字个数
- <ins>**returns**</ins> { [number](dataTypes#number) }

返回数组内数字的中位数, 并根据 fraction 参数进行可能的四舍五入.

```js
console.log(Mathx.median([ 1, 2, 3 ])); // 2
console.log(Mathx.median([ 1, 2, [ 3 ] ])); // 2
console.log(Mathx.median([ 0.1, 0.2, 0.309 ], 2)); // 0.2
console.log(Mathx.median([ 0.1, 0.2, 0.309 ], 10)); // 0.203
console.log(Mathx.median([ 0.1, 0.2, 0.309 ], 0)); // 0
```

## [m] var

方差.

### var(...numbers)

**`6.2.0`** **`xObject`** **`Overload 1/3`**

- **numbers** { [...](documentation#可变参数)[number](dataTypes#number)[[]](documentation#可变参数) } - 待求方差的数字
- <ins>**returns**</ins> { [number](dataTypes#number) }

返回所有数字的方差.

```js
/* 常规运算. */
console.log(Mathx.var(1, 2, 3)); // 0.6666666666666666
console.log(Mathx.var(1, 2, 3, 4, 5)); // 2
console.log(Mathx.var(9)); // 0
console.log(Mathx.var(0.1, 0.1)); // 0
console.log(Mathx.var(0.1, 0.2, 0.3)); // 0.006666666666666665

/* NaN 保持其传染性. */
console.log(Mathx.var(7, 8, 9, NaN)); // NaN

/* 无参将返回 NaN. */
console.log(Mathx.var()); // NaN

/* 元素将被 Number 化. */
console.log(Mathx.var('1', '2', '3')); // 0.6666666666666666
console.log(Mathx.var({ valueOf: () => 11 }, { valueOf: () => 12 })); // 0.25

/* 嵌套将被展平. */
console.log(Mathx.var(1, [ 2, [ 3, [ 4 ] ], 5 ])); // 2
```

### var(numbers, fraction?)

**`6.2.0`** **`xObject`** **`Overload [2-3]/3`**

- **numbers** { [number](dataTypes#number)[[]](dataTypes#array) } - 待求方差数字数组
- **[ fraction = undefined ]** { [number](dataTypes#number) } - 小数点后的数字个数
- <ins>**returns**</ins> { [number](dataTypes#number) }

返回数组内数字的方差, 并根据 fraction 参数进行可能的四舍五入.

```js
console.log(Mathx.var([ 1, 2, 3 ])); // 0.6666666666666666
console.log(Mathx.var([ 1, 2, [ 3 ] ])); // 0.6666666666666666
console.log(Mathx.var([ 0.1, 0.2, 0.309 ], 2)); // 0.01
console.log(Mathx.var([ 0.1, 0.2, 0.309 ], 10)); // 0.0072846667
console.log(Mathx.var([ 0.1, 0.2, 0.309 ], 0)); // 0
```

## [m] std

标准差 (均方差).

### std(...numbers)

**`6.2.0`** **`xObject`** **`Overload 1/3`**

- **numbers** { [...](documentation#可变参数)[number](dataTypes#number)[[]](documentation#可变参数) } - 待求标准差的数字
- <ins>**returns**</ins> { [number](dataTypes#number) }

返回所有数字的标准差.

```js
/* 常规运算. */
console.log(Mathx.std(1, 2, 3)); // 0.816496580927726
console.log(Mathx.std(1, 2, 3, 4, 5)); // 1.4142135623730951
console.log(Mathx.std(9)); // 0
console.log(Mathx.std(0.1, 0.1)); // 0
console.log(Mathx.std(0.1, 0.2, 0.3)); // 0.0816496580927726

/* NaN 保持其传染性. */
console.log(Mathx.std(7, 8, 9, NaN)); // NaN

/* 无参将返回 NaN. */
console.log(Mathx.std()); // NaN

/* 元素将被 Number 化. */
console.log(Mathx.std('1', '2', '3')); // 0.0816496580927726
console.log(Mathx.std({ valueOf: () => 11 }, { valueOf: () => 12 })); // 0.5

/* 嵌套将被展平. */
console.log(Mathx.std(1, [ 2, [ 3, [ 4 ] ], 5 ])); // 1.4142135623730951
```

### std(numbers, fraction?)

**`6.2.0`** **`xObject`** **`Overload [2-3]/3`**

- **numbers** { [number](dataTypes#number)[[]](dataTypes#array) } - 待求标准差数字数组
- **[ fraction = undefined ]** { [number](dataTypes#number) } - 小数点后的数字个数
- <ins>**returns**</ins> { [number](dataTypes#number) }

返回数组内数字的标准差, 并根据 fraction 参数进行可能的四舍五入.

```js
console.log(Mathx.std([ 1, 2, 3 ])); // 0.816496580927726
console.log(Mathx.std([ 1, 2, [ 3 ] ])); // 0.816496580927726
console.log(Mathx.std([ 0.1, 0.2, 0.309 ], 2)); // 0.09
console.log(Mathx.std([ 0.1, 0.2, 0.309 ], 10)); // 0.0853502587
console.log(Mathx.std([ 0.1, 0.2, 0.309 ], 0)); // 0
```

## [m] cv

变异系数 (离散系数).

### cv(...numbers)

**`6.2.0`** **`xObject`** **`Overload 1/3`**

- **numbers** { [...](documentation#可变参数)[number](dataTypes#number)[[]](documentation#可变参数) } - 待求变异系数的数字
- <ins>**returns**</ins> { [number](dataTypes#number) }

返回所有数字的变异系数.

```js
/* 常规运算. */
console.log(Mathx.cv(1, 2, 3)); // 0.5
console.log(Mathx.cv(1, 2, 3, 4, 5)); // 0.5270462766947299
console.log(Mathx.cv(9)); // NaN
console.log(Mathx.cv(0.1, 0.1)); // 0
console.log(Mathx.cv([ 0.1, 0.2, 0.3 ], 2)); // 0.5

/* NaN 保持其传染性. */
console.log(Mathx.cv(7, 8, 9, NaN)); // NaN

/* 无参将返回 NaN. */
console.log(Mathx.cv()); // NaN

/* 元素将被 Number 化. */
console.log(Mathx.cv('1', '2', '3')); // 0.5
console.log(Mathx.cv({ valueOf: () => 11 }, { valueOf: () => 12 })); // 0.06148754619013457

/* 嵌套将被展平. */
console.log(Mathx.cv(1, [ 2, [ 3, [ 4 ] ], 5 ])); // 0.5270462766947299
```

### cv(numbers, fraction?)

**`6.2.0`** **`xObject`** **`Overload [2-3]/3`**

- **numbers** { [number](dataTypes#number)[[]](dataTypes#array) } - 待求变异系数数字数组
- **[ fraction = undefined ]** { [number](dataTypes#number) } - 小数点后的数字个数
- <ins>**returns**</ins> { [number](dataTypes#number) }

返回数组内数字的变异系数, 并根据 fraction 参数进行可能的四舍五入.

```js
console.log(Mathx.cv([ 1, 2, 3 ])); // 0.5
console.log(Mathx.cv([ 1, 2, [ 3 ] ])); // 0.5
console.log(Mathx.cv([ 0.1, 0.2, 0.309 ], 2)); // 0.51
console.log(Mathx.cv([ 0.1, 0.2, 0.309 ], 10)); // 0.5149373973
console.log(Mathx.cv([ 0.1, 0.2, 0.309 ], 0)); // 1
```

## [m] max

最大值.

内置扩展别名: maxi.

```js
console.log(Mathx.max([ 5, 23 ])); // 23

/* 启用内置对象扩展后. */
console.log(Math.maxi([ 5, 23 ])); // 23
```

需额外留意空数组作为参数及无参时的一些情况:

```js
console.log(Math.max()); // -Infinity
console.log(Mathx.max()); // -Infinity

console.log(Math.max([])); // 0
console.log(Mathx.max([])); // -Infinity
```

### max(...numbers)

**`6.2.0`** **`xObject`** **`xAlias`** **`Overload 1/3`**

- **numbers** { [...](documentation#可变参数)[number](dataTypes#number)[[]](documentation#可变参数) } - 待求最大值的数字
- <ins>**returns**</ins> { [number](dataTypes#number) }

返回所有参数中的最大数字.

```js
/* 常规运算. */
console.log(Mathx.max(1, 2, 3)); // 3
console.log(Mathx.max(9)); // 9
console.log(Mathx.max(0.1, 0.1)); // 0.1

/* NaN 保持其传染性. */
console.log(Mathx.max(7, 8, 9, NaN)); // NaN

/* 无参将返回与 Math.max() 相同的值. */
console.log(Mathx.max()); // -Infinity

/* 元素将被 Number 化. */
console.log(Mathx.max('1', '2', '3')); // 3
console.log(Mathx.max({ valueOf: () => 11 }, { valueOf: () => 12 })); // 12

/* 嵌套将被展平. */
console.log(Mathx.max(1, [ 2, [ 3, [ 4 ] ], 5 ])); // 5
```

### max(numbers, fraction?)

**`6.2.0`** **`xObject`** **`xAlias`** **`Overload [2-3]/3`**

- **numbers** { [number](dataTypes#number)[[]](dataTypes#array) } - 待求最大值的数字数组
- **[ fraction = undefined ]** { [number](dataTypes#number) } - 小数点后的数字个数
- <ins>**returns**</ins> { [number](dataTypes#number) }

返回数组内参数的最大数字, 并根据 fraction 参数进行可能的四舍五入.

```js
console.log(Mathx.max([ 1, 2, 3 ])); // 3
console.log(Mathx.max([ 1, 2, [ 3 ] ])); // 3
console.log(Mathx.max([ 0.1, 0.2, 0.309 ], 2)); // 0.31
console.log(Mathx.max([ 0.1, 0.2, 0.309 ], 10)); // 0.309
console.log(Mathx.max([ 0.1, 0.2, 0.309 ], 0)); // 0

/* 相当于无参调用 Math.max(). */
console.log(Mathx.max([])); // -Infinity
```

## [m] min

最小值.

内置扩展别名: mini.

```js
console.log(Mathx.min([ 5, 23 ])); // 5

/* 启用内置对象扩展后. */
console.log(Math.mini([ 5, 23 ])); // 5
```

需额外留意空数组作为参数及无参时的一些情况:

```js
console.log(Math.min()); // Infinity
console.log(Mathx.min()); // Infinity

console.log(Math.min([])); // 0
console.log(Mathx.min([])); // Infinity
```

### min(...numbers)

**`6.2.0`** **`xObject`** **`xAlias`** **`Overload 1/3`**

- **numbers** { [...](documentation#可变参数)[number](dataTypes#number)[[]](documentation#可变参数) } - 待求最小值的数字
- <ins>**returns**</ins> { [number](dataTypes#number) }

返回所有参数中的最小数字.

```js
/* 常规运算. */
console.log(Mathx.min(1, 2, 3)); // 1
console.log(Mathx.min(9)); // 9
console.log(Mathx.min(0.1, 0.1)); // 0.1

/* NaN 保持其传染性. */
console.log(Mathx.min(7, 8, 9, NaN)); // NaN

/* 无参将返回与 Math.min() 相同的值. */
console.log(Mathx.min()); // Infinity

/* 元素将被 Number 化. */
console.log(Mathx.min('1', '2', '3')); // 1
console.log(Mathx.min({ valueOf: () => 11 }, { valueOf: () => 12 })); // 11

/* 嵌套将被展平. */
console.log(Mathx.min(1, [ 2, [ 3, [ 4 ] ], 5 ])); // 1
```

### min(numbers, fraction?)

**`6.2.0`** **`xObject`** **`xAlias`** **`Overload [2-3]/3`**

- **numbers** { [number](dataTypes#number)[[]](dataTypes#array) } - 待求最小值的数字数组
- **[ fraction = undefined ]** { [number](dataTypes#number) } - 小数点后的数字个数
- <ins>**returns**</ins> { [number](dataTypes#number) }

返回数组内参数的最小数字, 并根据 fraction 参数进行可能的四舍五入.

```js
console.log(Mathx.min([ 1, 2, 3 ])); // 1
console.log(Mathx.min([ 1, 2, [ 3 ] ])); // 1
console.log(Mathx.min([ 0.1, 0.2, 0.309 ], 2)); // 0.1
console.log(Mathx.min([ 0.1, 0.2, 0.309 ], 10)); // 0.1
console.log(Mathx.min([ 0.1, 0.2, 0.309 ], 0)); // 0

/* 相当于无参调用 Math.min(). */
console.log(Mathx.min([])); // Infinity
```

## [m] dist

两点间距离.

上述 "距离" 指的是 [欧几里得距离 (Euclidean distance)](https://zh.wikipedia.org/wiki/%E6%AC%A7%E5%87%A0%E9%87%8C%E5%BE%97%E8%B7%9D%E7%A6%BB), 亦称作欧氏距离.

### dist(pointA, pointB, fraction?)

**`6.2.0`** **`xObject`** **`Overload [1-2]/4`**

- **pointA** { [\[](dataTypes#tuple) [number](dataTypes#number), [number](dataTypes#number) [\]](dataTypes#tuple) | [{](dataTypes#object) x: [number](dataTypes#number), y: [number](dataTypes#number) [}](dataTypes#object) | [OpenCVPoint](opencvPointType) | [AndroidRect](androidRectType) }
- **pointB** { [\[](dataTypes#tuple) [number](dataTypes#number), [number](dataTypes#number) [\]](dataTypes#tuple) | [{](dataTypes#object) x: [number](dataTypes#number), y: [number](dataTypes#number) [}](dataTypes#object) | [OpenCVPoint](opencvPointType) | [AndroidRect](androidRectType) }
- **[ fraction = undefined ]** { [number](dataTypes#number) } - 小数点后的数字个数
- <ins>**returns**</ins> { [number](dataTypes#number) }

返回两点间距离, 并根据 fraction 参数进行可能的四舍五入.

```js
const Point = org.opencv.core.Point;
const Rect = android.graphics.Rect;

/* 无参返回 NaN. */
console.log(Mathx.dist()); // NaN

/* 以数组作点. */
console.log(Mathx.dist([ 0, 0 ], [ 3, 4 ])); // 5

/* 以包含 x 及 y 属性的对象作点. */
console.log(Mathx.dist({ x: 0, y: 0 }, { x: 3, y: 4 })); // 5

/* 以 Point 作点. */
console.log(Mathx.dist(new Point(6, 7), new Point(12, 15))); // 10

/* 以 Rect 作点, 此时其中心点作为参照点. */
console.log(Mathx.dist(new Rect(0, 0, 10, 10), new Rect(10, 10, 20, 20))); // 14.142135623730951
console.log(Mathx.dist(new Rect(0, 0, 10, 10), new Rect(10, 10, 20, 20), 3)); // 14.142

/* 两点类型可以不一致. */
console.log(Mathx.dist([ 0, 0 ], new Point(3, 4))); // 5
console.log(Mathx.dist([ 0, 0 ], new Rect(0, 0, 6, 8))); // 5

/* 点可以用浮点数表示. */
console.log(Mathx.dist(new Point(0, 0), new Point(0.5, 0.5))); // 0.7071067811865476

/* Rect 的中心点也可以为浮点数. */
console.log(Mathx.dist(new Point(0, 0), new Rect(0, 0, 1, 1))); // 0.7071067811865476
```

### dist(rect, fraction?)

**`6.2.0`** **`xObject`** **`Overload [3-4]/4`**

- **rect** { [AndroidRect](androidRectType) } - 矩形
- **[ fraction = undefined ]** { [number](dataTypes#number) } - 小数点后的数字个数
- <ins>**returns**</ins> { [number](dataTypes#number) }

返回矩形的对角点间距, 并根据 fraction 参数进行可能的四舍五入.

```js
/* 长 6 (12 - 6) 宽 8 (15 - 7) 的矩形, 对角线长度为 10. */
console.log(Mathx.dist(new Rect(6, 7, 12, 15))); // 10

/* 边长为 1 的正方形, 对角线长度为 √2 (根号 2). 结果保留 3 位小数. */
console.log(Mathx.dist(new Rect(0, 0, 1, 1), 3)); // 1.414
```
