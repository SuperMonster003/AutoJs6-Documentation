# Numberx (Number 扩展)

Numberx 用于扩展 JavaScript 标准内置对象 Number 的功能 (参阅 [内置对象扩展](glossaries#内置对象扩展)).

Numberx 全局可用:

```js
console.log(typeof Numberx); // "object"
console.log(typeof Numberx.clamp); // "function"
```

当启用内置扩展后, Numberx 将被应用在 Number 及其原型上:

```js
console.log(typeof Number.prototype.clamp); // "function"
console.log(typeof (123).clamp); // "function"
```

## 启用内置扩展

内置扩展默认被禁用, 以下任一方式可启用内置扩展:

- 在脚本中加入代码片段: `plugins.extendAll();` 或 `plugins.extend('Number');`
- AutoJs6 应用设置 - 扩展性 - JavaScript 内置对象扩展 - [ 启用 ]

当上述应用设置启用时, 所有脚本均默认启用内置扩展.  
当上述应用设置禁用时, 只有加入上述代码片段的脚本才会启用内置扩展.  
内置扩展往往是不安全的, 除非明确了解内置扩展的原理及风险, 否则不建议启用.

---

<p style="font: bold 2em sans-serif; color: #FF7043">Numberx</p>

---

## [p] ICU

**`6.2.0`** **`xObject`** **`CONSTANT`**

- [ `996` ] { [number](dataTypes#number) }

996.ICU - Developers' lives matter (程序员生命健康值得呵护).

常量值: 996

```js
/* 静态常量. */
console.log(`${Numberx.ICU} is not only a number`);

/* 启用内置对象扩展后. */
console.log(`${Number.ICU} is not only a number`);
```

> 参阅: [Wikipedia](https://zh.wikipedia.org/wiki/996%E5%B7%A5%E4%BD%9C%E5%88%B6) / [GitHub](https://github.com/996icu/996.ICU)

## [m] ensureNumber

### ensureNumber(...o)

**`6.2.0`** **`xObject`**

- **o** { [...](documentation#可变参数)[any](dataTypes#any)[[]](documentation#可变参数) } - 任意对象
- <ins>**returns**</ins> { [void](dataTypes#void) }

相当于严格类型检查, 当任意一个 o 不满足 `typeof o === 'number'` 时抛出异常.

```js
/* 确保每一个对象都是 number 基本类型. */

console.log(Numberx.ensureNumber(9)); /* 无异常. */
console.log(Numberx.ensureNumber(null)); /* 抛出异常. */
console.log(Numberx.ensureNumber(NaN, 0, Infinity)); /* 无异常. */

/* 启用内置对象扩展后. */

console.log(Number.ensureNumber(9)); /* 无异常. */
console.log(Number.ensureNumber(null)); /* 抛出异常. */
console.log(Number.ensureNumber(NaN, 0, Infinity)); /* 无异常. */
```

## [m] check

### check(o)

**`6.2.0`** **`Overload 1/3`** **`xObject`**

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

检查对象参数是否为数字类型, 相当于 `typeof o === 'number'`.

```js
console.log(Numberx.check(9)); // true
console.log(Numberx.check('9')); // false

/* 启用内置对象扩展后. */

console.log(Number.check(9)); // true
console.log(Number.check('9')); // false
```

### check(numA, numB)

**`6.2.0`** **`Overload 2/3`** **`xObject`**

- **numA** { [number](dataTypes#number) }
- **numB** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

检查两个数字是否相等.

任何一个参数不是 `number` 类型, 则返回 `false`.

```js
console.log(Numberx.check(9, 2 + 7)); // true
console.log(Numberx.check('9', '9')); // false

/* 启用内置对象扩展后. */

console.log(Number.check(9, 2 + 7)); // true
console.log(Number.check('9', '9')); // false
```

### check(...numberOrOperator)

**`6.2.0`** **`Overload 3/3`** **`xObject`**

- **o** { [...](documentation#可变参数)([number](dataTypes#number) [|](dataTypes#联合类型) [ComparisonOperatorString](dataTypes#comparisonoperatorstring))[[]](documentation#可变参数) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

检查数字与操作符字符串的逻辑关系.

对于参数索引 [0, 1, 2 ... n],  
索引 [0, 2, 4 ...] 需为 `number` 类型,  
索引 [1, 3, 5 ...] 需为 `string` 类型.

参数不满足上述类型需求时将抛出异常.

```js
let a = 0.5;
let b = 5;
let c = 23;
let d = 2011;

console.log(Numberx.check(a, '<', b)); // true
console.log(Numberx.check(a, '<', b, '<=', c)); // true
console.log(Numberx.check(a, '<', d, '>', b, '<', c, '>', a)); // true
console.log(Numberx.check(a, c, d)); /* 抛出异常. */

/* 启用内置对象扩展后. */

console.log(Number.check(a, '<', b)); // true
console.log(Number.check(a, '<', b, '<=', c)); // true
console.log(Number.check(a, '<', d, '>', b, '<', c, '>', a)); // true
console.log(Number.check(a, c, d)); /* 抛出异常. */
```

逻辑关系检查时, 仅检查操作符字符串相邻的两个数字.  
例如对于 `check(a, '<', d, '>', b)`, 仅检查 `a < d` 与 `d > b`, 而不会检查 `a` 与 `b` 的关系.

## [m] clamp

### clamp(num, ...clamps)

**`6.2.0`** **`xProto`**

- **num** { [number](dataTypes#number) } - 待处理数字
- **clamps** { [...](documentation#可变参数)([number](dataTypes#number) | [number](dataTypes#number)[[]](dataTypes#array))[[]](documentation#可变参数) } - 限制范围
- <ins>**returns**</ins> { [number](dataTypes#number) }

返回限制在指定范围内的数字.  
当给定数字不在限制范围内时, 则就近返回一个范围边界值.

通常限制范围用两个大小不同的数字数组表示,  
如范围 10 - 30 可用 `[ 10, 30 ]` 表示.  
范围参数会根据给定参数排序后挑选出最大值与最小值作为限制上限及下限,  
因此 `[ 30, 10 ]` 与 `[ 10, 30 ]` 效果相同,  
而与 `[ 10, 11, 15, 22, 30 ]` 或 `[ 20, 30, 25, 10 ]` 等效果也相同:

```js
let num = Math.random() * 50;
console.log(Numberx.clamp(num, [ 10, 30 ]));
console.log(Numberx.clamp(num, [ 10, 12, 30, 22, 20 ])); /* 同上. */

/* 启用内置对象扩展后. */

console.log(num.clamp([ 10, 30 ])); /* 同上. */
console.log(num.clamp([ 10, 12, 30, 22, 20 ])); /* 同上. */
```

因范围参数 clamps 是 [可变参数](documentation#可变参数), 因此以下两种调用方式效果相同:

```js
let num = Math.random() * 50;
console.log(Numberx.clamp(num, [ 10, 30 ]));
console.log(Numberx.clamp(num, 10, 30)); /* 同上. */

/* 启用内置对象扩展后. */

console.log(num.clamp([ 10, 30 ])); /* 同上. */
console.log(num.clamp(10, 30)); /* 同上. */
```

当限制范围参数是 1 个数字时, 相当于 `[ x, x ]`, 则一定返回 x 本身;  
当限制范围参数是 0 个数字时 (省略或空数组), 则返回 num 本身:

```js
let num = 307;
console.log(Numberx.clamp(num, 523)); // 523
console.log(Numberx.clamp(num)); // 307

/* 启用内置对象扩展后. */

console.log(num.clamp(523)); // 523
console.log(num.clamp()); // 307
```

## [m] clampTo

### clampTo(num, range, cycle?)

**`6.2.0`** **`xProto`** **`Overload [1-2]/2`**

- **num** { [number](dataTypes#number) } - 待处理数字
- **range** { [number](dataTypes#number)[[]](dataTypes#array) } - 限制范围
- **[ cycle = `maxOf(range) - minOf(range)` ]** { [number](dataTypes#number) } - 周期, 默认为 range 参数的跨度
- <ins>**returns**</ins> { [number](dataTypes#number) }

返回按周期限制在指定范围内的数字.

在数学中, 周期函数是无论任何独立变量上经过一个确定的周期之后数值皆能重复的函数.  

如果在函数 _f_ 中所有的位置 _x_ 都满足 _f_ ( _x_ + _T_ ) = _f_ ( _x_ ), 那么, _f_ 就是周期为 _T_ 的周期函数.  
如果周期函数 _f_ 的周期为 _T_ , 那么对于 _f_ 中任意 _x_ 及任意整数 _n_, 有 _f_ ( _x_ + _Tn_ ) = _f_ ( _x_ ).

三角函数正弦函数与余弦函数都是常见的周期函数, 如 _f_ ( _x_ ) = sin _x_ 与 _f_ ( _x_ ) = cos _x_ 等, 其周期为 `2π`.

`clampTo` 方法的作用是将数字通过周期变换回落到指定范围内:

```js
Numberx.clampTo(30, [ 0, 360 ]); // 30
Numberx.clampTo(390, [ 0, 360 ]); // 30
Numberx.clampTo(30 + 10 * 360, [ 0, 360 ]); // 30
Numberx.clampTo(30 - 10 * 360, [ 0, 360 ]); // 30

/* 启用内置对象扩展后. */

(30).clampTo([ 0, 360 ]); // 30
(390).clampTo([ 0, 360 ]); // 30
(30 + 10 * 360).clampTo([ 0, 360 ]); // 30
(30 - 10 * 360).clampTo([ 0, 360 ]); // 30
```

`cycle` 参数默认是范围的跨度, 即范围的两个极值差, 当极值为 `0` 时, 将抛出异常:

```js
Numberx.clampTo(30, [0, 0]); /* 抛出异常. */

/* 启用内置对象扩展后. */

(30).clampTo([0, 0]); /* 抛出异常. */
```

指定一个周期:

```js
Numberx.clampTo(372, [0, 360], 10); // 352

/* 启用内置对象扩展后. */

(372).clampTo([0, 360], 10); // 352
```

## [m] toFixedNum

### toFixedNum(num, fraction?)

**`6.2.0`** **`xProto`**

- **num** { [number](dataTypes#number) } - 待处理数字
- **[ fraction = 0 ]** { [number](dataTypes#number) } - 小数点后数字的个数
- <ins>**returns**</ins> { [number](dataTypes#number) }

使用定点表示法来格式化一个数值, 然后返回其对应的 number 值.

```js
console.log(Numberx.toFixedNum(123.456, 2)); // 123.46
console.log(Numberx.toFixedNum(3.004, 2)); // 3
console.log(Numberx.toFixedNum(1.23456e3)); // 1235

/* 启用内置对象扩展后. */

console.log((123.456).toFixedNum(2)); // 123.46
console.log((3.004).toFixedNum(2)); // 3
console.log((1.23456e3).toFixedNum()); // 1235
```

## [m] padStart

### padStart(num, targetLength, pad?)

**`6.2.0`** **`xProto`**

- **num** { [number](dataTypes#number) } - 待处理数字
- **targetLength** { [number](dataTypes#number) } - 当前数字需要填充到的目标字符串长度. 如果此长度小于 num 参数的字符串长度, 则返回 num 参数的字符串本身.
- **[ pad = '0' ]** { [string](dataTypes#string) | [number](dataTypes#number) } - 填充字符串. 如果字符串太长, 使填充后的字符串长度超过了目标长度, 则只保留最左侧部分, 其他部分会被截断. 此参数的默认值为 "0" (U+0030).
- <ins>**returns**</ins> { [string](dataTypes#string) }

此方法用一个字符串填充当前数字 (如果需要的话则重复填充), 返回填充后达到指定长度的字符串.  
填充从当前数字对应字符串的开头开始.

```js
console.log(Numberx.padStart(5, 2, 0)); // "05"
console.log(Numberx.padStart(5, 2)); // "05"
console.log(Numberx.padStart(3, 3)); // "003"
console.log(Numberx.padStart(99, 5, "AB")); // "ABA99"

/* 启用内置对象扩展后. */

console.log((5).padStart(2, 0)); // "05"
console.log((5).padStart(2)); // "05"
console.log((3).padStart(3)); // "003"
console.log((99).padStart(5, "AB")); // "ABA99"
```

格式化日期与时间:

```js
let pad = x => Numberx.padStart(x, 2, 0); /* 启用内置对象扩展后: `x.padStart(2, 0)`. */
let now = new Date();
let date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
let time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
console.log(`${date} ${time}`); /* e.g. "2022-11-01 08:47:15" */
```

## [m] padEnd

### padEnd(num, targetLength, pad?)

**`6.2.0`** **`xProto`**

- **num** { [number](dataTypes#number) } - 待处理数字
- **targetLength** { [number](dataTypes#number) } - 当前数字需要填充到的目标字符串长度. 如果此长度小于 num 参数的字符串长度, 则返回 num 参数的字符串本身.
- **[ pad = '0' ]** { [string](dataTypes#string) | [number](dataTypes#number) } - 填充字符串. 如果字符串太长, 使填充后的字符串长度超过了目标长度, 则只保留最左侧部分, 其他部分会被截断. 此参数的默认值为 "0" (U+0030).
- <ins>**returns**</ins> { [string](dataTypes#string) }

此方法用一个字符串填充当前数字 (如果需要的话则重复填充), 返回填充后达到指定长度的字符串.  
填充从当前数字对应字符串的末尾开始.

```js
console.log(Numberx.padEnd(5, 2, 0)); // "50"
console.log(Numberx.padEnd(5, 2)); // "50"
console.log(Numberx.padEnd(3, 3)); // "300"
console.log(Numberx.padEnd(99.1, 5)); // "99.10"

/* 启用内置对象扩展后. */

console.log((5).padEnd(2, 0)); // "50"
console.log((5).padEnd(2)); // "50"
console.log((3).padEnd(3)); // "300"
console.log((99.1).padEnd(5)); // "99.10"
```

## [m] parseFloat

### parseFloat(string, radix)

**`6.2.0`** **`xObject`**

- **string** { [string](dataTypes#string) } - 待解析的字符串
- **radix** { [number](dataTypes#number) } - 进制的基数
- <ins>**returns**</ins> { [number](dataTypes#number) }

根据指定的进制基数, 解析字符串并返回一个数字.

标准内置对象 Number 的 parseInt 支持进制基数 radix 参数, 即 parseInt(string, radix), 但 parseFloat 不支持 radix 参数.

此扩展方法对上述 radix 参数提供了支持:

```js
console.log(Numberx.parseFloat("0.8", 16)); // 0.5
console.log(Numberx.parseFloat("0.101", 2)); // 0.625

/* 启用内置对象扩展后. */

console.log(Number.parseFloat("0.8", 16)); // 0.5
console.log(Number.parseFloat("0.101", 2)); // 0.625
console.log(parseFloat("0.8", 16)); // 0.5
console.log(parseFloat("0.101", 2)); // 0.625
```

## [m] parsePercent

### parsePercent(percentage)

**`6.2.0`** **`xObject`**

- **percentage** { [string](dataTypes#string) | [number](dataTypes#number) } - 百分数字符串或任意数字
- <ins>**returns**</ins> { [number](dataTypes#number) }

此方法用于解析一个百分数字符串 (如 `"5%"`) 并返回其代表的数值.  
如果 percentage 是一个 number 基本类型值, 则直接返回.

```js
console.log(Numberx.parsePercent('1%')); // 0.01
console.log(Numberx.parsePercent('50.00%')); // 0.5
console.log(Numberx.parsePercent('2%%')); // 0.0002

/* 启用内置对象扩展后. */

console.log(Number.parsePercent('1%')); // 0.01
console.log(Number.parsePercent('50.00%')); // 0.5
console.log(Number.parsePercent('2%%')); // 0.0002
```

## [m] parseRatio

### parseRatio(ratio)

**`6.2.0`** **`xObject`**

- **ratio** { [string](dataTypes#string) } - 比率字符串
- <ins>**returns**</ins> { [number](dataTypes#number) }

此方法用于解析一个比率字符串 (如 `"5:23"`) 并返回其代表的数值.

```js
console.log(Numberx.parseRatio('3:2')); // 1.5
console.log(Numberx.parseRatio('3:0.1')); // 30
console.log(Numberx.parseRatio('0.1:0.01')); // 10

/* 启用内置对象扩展后. */

console.log(Number.parseRatio('3:2')); // 1.5
console.log(Number.parseRatio('3:0.1')); // 30
console.log(Number.parseRatio('0.1:0.01')); // 10
```

## [m] parseAny

### parseAny(o)

**`6.2.0`** **`xObject`**

- **o** { [any](dataTypes#any) } - 待解析的对象
- <ins>**returns**</ins> { [number](dataTypes#number) }

此方法用于解析任意对象并返回其代表的数值.

```js
console.log(Numberx.parseAny('9')); // 9
console.log(Numberx.parseAny('30.05')); // 30.05
console.log(Numberx.parseAny('0xFF')); // 255

console.log(Numberx.parseAny('20%')); // 0.2
console.log(Numberx.parseAny('20%%')); // 0.002

console.log(Numberx.parseAny('18:9')); // 2
```