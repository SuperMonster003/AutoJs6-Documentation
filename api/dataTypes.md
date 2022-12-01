# 数据类型 (Data Types)

---

<p style="font: italic 1em sans-serif; color: #78909C">此章节待补充或完善...</p>
<p style="font: italic 1em sans-serif; color: #78909C">Marked by SuperMonster003 on Oct 22, 2022.</p>

---

数据类型是用来约束数据的解释.  
本章节的数据类型包括 [ number / void / any / object / 泛型 / 交叉类型 ] 等.

> 注: 此章节的类型概念 与 JavaScript 数据类型 (如 [基本类型](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive/)) 以及 TypeScript 数据类型 (如 [基础类型](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)) 在概念上可能存在出入, 因此仅适用于对文档内容的辅助理解, 不适用于严格的概念参考.

## Boolean

布尔类型.

**foo(bar)**

- **bar** { [boolean](#boolean) }

```js
foo(true); /* 符合预期. */
foo(false); /* 符合预期. */
foo(3); /* 不符合预期. */
```

需留意 JavaScript 的短路特性:

```js
/* 符合预期, 相当于 foo(false). */
foo(3 > 4);

/* 不符合预期, 相当于 foo("hello"). */
foo(3 > 4 || "hello");

/* 符合预期, 相当于 foo(false). */
foo(3 > 4 && "hello");

/* 不符合预期, 相当于 foo("hello"). */
foo(3 > 2 && "hello");
```

## Number

数字类型.

常用以下表示方法:

- `3` - 整数
- `+3` - 整数
    - 结果与 3 相同, 通常仅用于强调正负性
    - 这里的 "+" 并非符号, 而是一元运算符
- `-3` - 负数
- `3.1` - 小数
    - JS 使用 IEEE 754 双精度版本存储数字
    - 参阅: [0.1 + 0.2 !== 0.3](https://github.com/HXWfromDJTU/blog/issues/20)
- `3.0` - 整数
    - 结果与 3 相同, JS 没有 Double 等类型
- `.1` - 小数, 省略前导 0, 相当于 0.1
- `2e3` - 科学计数法, 相当于 2 × 10^3, 即 2000
    - 符号 e 表示 10 的幂, e 前后的数字分别称为有效数和幂次
    - 有效数可以为整数或小数字面量:
        - `1e2`, `3.1e2`, `-9e2`, `0e2`, `.1e2` 均合法
    - 幂次只能为整数字面量:
        - `1e2`, `1e-2` 均合法
    - e 的前后不能有变量或括号等符号:
        - `let num = 3;`
        - `nume2`, `(num)e2`, `(3)e(2)`, `3e(num)` 均不合法
- `0x23` - 十六进制
- `0b101` - 二进制
- `0o307` - 八进制
- `NaN` - 特殊数值
    - 参阅: [NaN](glossaries#nan)
- `Infinity` - 无穷大
- `-Infinity` - 负无穷大
- `Number.XXX` - Number 对象上的常量
    - 如 [Number\.EPSILON](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON), [Number.MAX_VALUE](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_VALUE) 等
- `Math.XXX` - Math 对象上的常量
    - 如 [Math.PI](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/PI), [Math.SQRT2](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/SQRT2), [Math.LN2](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/LN2) 等

**foo(bar)**

- **bar** { [number](#number) }

```js
foo(3); /* 符合预期. */
foo(3.3); /* 符合预期. */
foo(3e3); /* 符合预期. */
foo(NaN); /* 符合预期. */
```

JavaScript 的所有数字都是浮点数, 因此 number 类型对 Double, Float, Long, Integer, Short 等均不作区分.

```js
3.0 === 3; // true
typeof new java.lang.Double(5.23).doubleValue(); // "number"
```

> 注: 如需表示一个很大的数 (超过 `2^53 - 1`), 需要用 [BigInt](glossaries#bigint) 表示.  
> 文档中通常不会出现 `bigint` 类型的数据, 包括 `number | bigint` 这样的 [联合类型](#联合类型) 数据.

## String

字符串类型.

常用以下表示方法:

- `"hello"` - 成对双引号 (`"`)
- `'hello'` - 成对单引号 (`'`)
- `&#96;hello&#96;` - 成对反引号 (`&#96;`)
    - 参阅: [模板字符串](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals)
- `转义字符`
    - 如 `\n`, `\r`, `\uXXXX`, `\xXX` 等
    - 参阅: [转义字符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String#%E8%BD%AC%E4%B9%89%E5%AD%97%E7%AC%A6)

**foo(bar)**

- **bar** { [string](#string) }

```js
foo("3"); /* 符合预期. */
foo('3.3'); /* 符合预期. */
foo(`3e3 equals to ${3000}`); /* 符合预期. */
foo(NaN.toString()); /* 符合预期. */
```

## Array

数组类型.

后缀 "[]" 代表数组类型.  
如 `number[]` 代表一个数组, 其中的元素全部为 [number](#number) 类型, 且元素数量不限 (包括 0, 即空数组).

> 注: `number[]` 与 `[number]` 不同, 后者表示 [元组类型](#tuple).

> 注: 使用 `Array<T>` 这样的 [泛型](#generic) 表示法也可代表数组类型, 但文档通常只采用后缀表示法.

**foo(bar)**

- **bar** { [string[]](#array) }

```js
foo([ "3" ]); /* 符合预期. */
foo([ 3 ]); /* 不符合预期. */
foo([ "3", 3 ]); /* 不符合预期. */
foo([]); /* 符合预期. */
```

## Tuple

元组类型.

元组类型严格限制数组的对应类型及元素数量.  
如 `[ number, number, string, number ]` 有如下限制:  
&#45; &#45; 数组有且必有 4 个元素;  
&#45; &#45; 元素类型依次为 number, number, string, number.

> 注: 需额外注意元组类型与 JSDoc 表示数组方法的异同.  
> 另外 JavaScript 中没有元组的概念.

**foo(bar)**

- **bar** { [&#91;](#tuple) [string](#string), [number](#number) [&#93;](#tuple) }

```js
foo([ "3" ]); /* 不符合预期. */
foo([ 3 ]); /* 不符合预期. */
foo([ "3", 3 ]); /* 符合预期. */
foo([]); /* 不符合预期. */
```

## Function

函数类型.

文档采用 [箭头函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions) 表示一个函数参数.

**foo(bar)**

- **bar** { [() =>](#function) [number](#number) }

上述 [方法签名](documentation#方法签名) 中, bar 为函数参数, 该函数是一个无参函数且返回值为 number 类型.

```js
foo(Math.random()); /* 不符合预期. */

foo(function () {
    return Math.random();
}); /* 符合预期. */

foo(function () {
    return 'hello';
}); /* 不符合预期. */
```

**foo(bar)**

- **bar** { [(a: ](#function)[string](#string)[, b: ](#function)[any](#any)[) => ](#function)[string](#string) }

上述 [方法签名](documentation#方法签名) 中, bar 为函数参数, 该函数包含两个参函数且返回值为 string 类型.

```js
/* 参数 a 为 string 类型, b 为 any 类型. */
foo(function (a, b) {
    return a + String(b); /* 字符串拼接. */
}); /* 符合预期. */
```

## RegExp

正则表达式类型.

**foo(bar)**

- **bar** { [RegExp](#regexp) }

上述 [方法签名](documentation#方法签名) 中, bar 为正则表达式参数, 是 JavaScript 标准 RegExp 类型:

1. 字面量

   `foo(/hello.+world?/)`

2. RegExp 构造器

   `new RegExp('hello.+world?')`

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp)

## Any

任意类型.

类型 any 能够兼容所有类型.

**foo(bar)**

- **bar** { [any](#any) }

```js
foo(3); /* 符合预期. */
foo([]); /* 符合预期. */
foo({}); /* 符合预期. */
foo(null); /* 符合预期. */
```

尽管 any 可以兼容所有类型, 但仍需提供一个具体的类型, 不能省略:

```js
foo(); /* 不符合预期. */
foo(undefined); /* 符合预期. */
```

## Void

此类型用于表示一个函数没有返回值.

### 作为函数体返回值

**foo(bar)**

- **bar** { [any](#any) }
- <ins>**returns**</ins> { [void](#void) }

Void 作为 foo 函数体的返回值类型, 表示 foo 函数没有返回值:

```js
function foo() {
    console.log("hello");
} /* 符合预期. */

function foo() {
    return "hello";
} /* 不符合预期. */
```

### 作为参数返回值

**foo(bar)**

- **bar** { [() =>](#function) [void](#void) }

上述 [方法签名](documentation#方法签名) 中, bar 为函数参数,  
void 并非表示要求其返回值为 void,  
它表示 bar 返回的所有值均被忽略 (即不被关心).

```js
let arr = [];
foo(() => arr.push(Math.random())); /* 符合预期. */
console.log(arr);
```

### Void 与 Undefined

**foo(bar)**

- **bar** { [string](#string) }
- <ins>**returns**</ins> { [void](#void) }

在 JavaScript 中, 没有 return 语句的函数将默认返回 [undefined](#undefined).  
因此对于函数体, 返回值为 void 相当于 undefined:

```js
foo(() => {
    return;
}) /* 符合预期. */;

foo(() => {
    return undefined;
}) /* 符合预期. */;

foo(() => {
    // Empty body.
}) /* 符合预期. */;

foo(() => {
    return 3;
}) /* 不符合预期. */;
```

**foo(bar, baz)**

- **bar** { [() =>](#function) [void](#void) }
- **baz** { [() =>](#function) [undefined](#undefined) }

对于函数参数, 返回值 void 与 返回值 undefined 意义不同.  
void 表示返回的所有值均被忽略 (参阅 [作为参数返回值](#作为参数返回值)),  
而 undefined 表示返回值必须为 undefined 类型.

```js
foo(
    /* bar = */ () => {
        return;
    }, /* 符合预期. */
    /* baz = */ () => {
        return;
    }, /* 符合预期. */
);

foo(
    /* bar = */ () => {
        return undefined;
    }, /* 符合预期. */
    /* baz = */ () => {
        return undefined;
    }, /* 符合预期. */
);

foo(
    /* bar = */ () => {
        // Empty body.
    }, /* 符合预期. */
    /* baz = */ () => {
        // Empty body.
    }, /* 符合预期. */
);

foo(
    /* bar = */ () => {
        return 3;
    }, /* 符合预期. */
    /* baz = */ () => {
        return 3;
    }, /* 不符合预期. */
);
```

> 注: 上述方法签名如果将 void 替换为 any, 就 bar 参数是否符合预期方面而言, 效果是相同的.  
> 然而两者在语义上有明确不同, void 表示不关心 bar 的返回值, 而 any 表示任意返回值类型均可接受.  
> 在设计自定义 API 或设计 TS 声明文件时, 上述区分将显得尤为重要.

## Never

## Object

### 字面量对象类型

{{ a: number }}

## Generic

## Null

> 参阅: [MDN #术语](https://developer.mozilla.org/zh-CN/docs/Glossary/Null/) / [MDN #操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/null/) / [MDN #Nullish](https://developer.mozilla.org/zh-CN/docs/Glossary/Nullish/)

## Undefined

```js
// device.vibrate(text: string, delay?: number): void
typeof device.vibrate("hello") === "undefined"; // true
```

> 参阅: [MDN #术语](https://developer.mozilla.org/zh-CN/docs/Glossary/undefined/) / [MDN #全局对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined/)

## RegExPattern

正则表达式模式类型.

通常只在 [操纵泛型](#pattern) 中使用.

**foo(bar)**

- **bar** { [Pattern](#pattern)[<](#generic)[/^\d+$/](#regexp)[>](#generic) }

```js
foo("1"); /* 符合预期. */
foo("123"); /* 符合预期. */
foo("hello"); /* 不符合预期. */
foo("1e3"); /* 不符合预期. */
foo("1.3"); /* 不符合预期. */
```

## 联合类型

# 操作符

## in

## keyof

## typeof

## extends

## index

## condition

## readonly

# 操纵泛型

例如 Array<T>

## Uppercase

**Uppercase&lt;T>: string**

通常用于输出转换.  
接受 string 类型并生成所有字母大写的同类型数据.

## Lowercase

**Lowercase&lt;T>: string**

通常用于输出转换.  
接受 string 类型并生成所有字母小写的同类型数据.

## Capitalize

**Capitalize&lt;T>: string**

通常用于输出转换.  
接受 string 类型并生成首字母大写的同类型数据.

```js

```

## IgnoreCase

**IgnoreCase&lt;T extends string>: T**

通常用于输出转换.  
接受 string 类型并生成忽略大小写的同类型数据.

例如, 对于 IgnoreCase<"webUrl">, 以下数据均符合预期:

```js
[ "webUrl", "WEBURL", "WebUrl", "WEBurl" ];
```

但不能在字符串前后或内部插入其他字符,  
如 [ "WEB_URL" / "web-url" / "#WebUrl" ] 等.

## Pattern

**Pattern&lt;[T](#generic) [extends](#extends) [RegExPattern](#regexpattern)>: [string](#string)**

通常用于输入检查.  
接受 [正则表达式字面量](glossaries#正则表达式) 并生成通过测试的 [string](#string) 类型数据.

Pattern 的泛型通配符 T 在文档中也称作 [字符串模式](glossaries#字符串模式).

**foo(bar)**

- **bar** { [Pattern](#pattern)[<](#generic)[/^https?:/](#regexpattern)[>](#generic) }

```js
foo("http is an abbreviation."); /* 不符合预期. */
foo("https://xxx"); /* 符合预期. */
foo("ftp://xxx"); /* 不符合预期. */
```

支持 [标记参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions#%E9%80%9A%E8%BF%87%E6%A0%87%E5%BF%97%E8%BF%9B%E8%A1%8C%E9%AB%98%E7%BA%A7%E6%90%9C%E7%B4%A2):

**foo(bar)**

- **bar** { [Pattern](#pattern)[<](#generic)[/^h...[oy]/i](#regexpattern)[>](#generic) }

```js
foo("Happy"); /* 符合预期. */
foo("hello"); /* 符合预期. */
foo("Halloween"); /* 符合预期. */
foo("history"); /* 符合预期. */
foo("heroes"); /* 不符合预期. */
```

为便于理解或重复引用, 有些 Pattern 类型会被重新定义为自定义类型, 如 [NumberString](dataTypes#numberstring).

> 注: 目前 (2022/08) 在 JSDoc 及 TypeScript 中,  
> 均不存在使用正则表达式字面量检查字符串的类型检查 (参阅 [StackOverflow](https://stackoverflow.com/questions/51445767/how-to-define-a-regex-matched-string-type-in-typescript)),  
> 上述 Pattern 类型仅适用于对文档内容的辅助理解.

## JavaArray

Java Array (Java 数组).

```js
let javaArr = java.lang.reflect.Array
    .newInstance(java.lang.Float.TYPE, 3);

console.log(util.isJavaArray(javaArr)); // true
console.log(Array.isArray(javaArr)); // false
```

Java 数组可使用 JavaScript 数组的属性及方法:

```js
let javaArr = java.lang.reflect.Array
    .newInstance(java.lang.Float.TYPE, 3);

console.log(javaArr.length); // 3

console.log(javaArr.slice === Array.prototype.slice); // true
Array.isArray(javaArr.slice(0)); // true
```

Java 数组一旦被初始化, 长度将不可改变, [ 改变长度 / 越界赋值 ] 均会失败且抛出异常:

```js
let javaArr = java.lang.reflect.Array
    .newInstance(java.lang.Float.TYPE, 3);

/* 静默失败. */
javaArr.length = 20;
console.log(javaArr.length); // 3

/* push 或 unshift 导致越界抛出异常. */
javaArr.push(9); /* Error. */
javaArr.unshift(9); /* Error. */

/* pop 或 shift 不抛出异常但不改变数组长度. */
javaArr.pop();
console.log(javaArr.length); // 3
javaArr.shift();
console.log(javaArr.length); // 3

/* 越界访问不抛出异常, 会返回 undefined. */
console.log(javaArr[9]); // undefined

/* 越界赋值将抛出异常. */
javaArr[9] = 10; /* Error. */
```

Java 数组中的元素将隐式转换为指定的类型, 同时此类型也会被转换为 JavaScript 类型, 如 Java 的 Integer 等均转换为 Number:

```js
let javaArr = java.lang.reflect.Array
    .newInstance(java.lang.Integer.TYPE, 3);

console.log(javaArr.join()); // '0,0,0'

/* Number('1a') -> NaN */
javaArr[0] = '1a';
console.log(javaArr[0]); // NaN

/* Number('2.2') -> 2.2 $ JS */
/* java.lang.Integer(2.2 $ JS) -> 2 $ Java */
/* Number(2 $ Java) -> 2 $ JS */
javaArr[2] = '2.2';
console.log(javaArr[0]); // 2

/* 0xFF $ Hexadecimal == 255 $ Decimal / JS */
/* java.lang.Integer(255 $ JS) -> 255 $ Java */
/* Number(255 $ Java) -> 255 $ JS */
javaArr[0] = 0xFF;
console.log(javaArr[0]); // 255
```

> 参阅: [Oracle Docs](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html)

## JavaArrayList

Java ArrayList (Java 数组列表).

与 [Java Array](#javaarray) 不同的是, ArrayList 创建的数组可调整大小:

```js
let arrList = new java.util.ArrayList();

arrList.add(10);
arrList.add('20');
arrList.add([ '30' ]);
arrList.add(/40/g);

console.log(arrList.length); // 4

arrList.forEach((o) => {
    // 10 (Number)
    // 20 (String)
    // 30 (Array)
    // /40/g (RegExp)
    console.log(`${o} (${species(o)})`);
});

arrList.addAll(arrList);
console.log(arrList.length); // 8

arrList.clear();
console.log(arrList.length); // 0
```

> 参阅: [Oracle Docs](https://docs.oracle.com/javase/8/docs/api/java/util/ArrayList.html)

# 自定义类型

## NumberString

数字字符串.

[字符串模式](glossaries#字符串模式): `/[+-]?(\d+(\.\d+)?(e\d+)?)/`.

```js
"12";
"-5";
"1.5";
"1.5e3";
```

## ScreenMetricNumberX

屏幕横向度量值.

表示方式:

- 数字 { X >= 1 或 X < -1 } - 横向屏幕宽度值
- 数字 { X > -1 且 X < 1 } - 横向屏幕宽度值的百分比
- 数字 { X == -1 } - 横向屏幕宽度值本身 (代指值)

例如, 对于下面的参数:

**bottom** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) }

bottom 赋值为 50, 表示 X 坐标为 50.  
bottom 赋值为 -80, 表示 X 坐标为 -80.  
bottom 赋值为 0.5, 表示 X 坐标为 50% 横向屏幕宽度, 即 `0.5 * device.width`.  
bottom 赋值为 -0.1, 表示 X 坐标为 -10% 横向屏幕宽度, 即 `-0.1 * device.width`.  
bottom 赋值为 -1, 表示 X 坐标为横向屏幕宽度的代指值, 即 `device.width`.

## ScreenMetricNumberY

屏幕纵向度量值.

表示方式:

- 数字 { Y >= 1 或 Y < -1 } - 纵向屏幕高度值
- 数字 { Y > -1 且 Y < 1 } - 纵向屏幕高度值的百分比
- 数字 { Y == -1 } - 纵向屏幕高度值本身 (代指值)

例如, 对于下面的参数:

**top** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) }

top 赋值为 50, 表示 Y 坐标为 50.  
top 赋值为 -80, 表示 Y 坐标为 -80.  
top 赋值为 0.5, 表示 Y 坐标为 50% 纵向屏幕高度, 即 `0.5 * device.height`.  
top 赋值为 -0.1, 表示 Y 坐标为 -10% 纵向屏幕高度, 即 `-0.1 * device.height`.  
top 赋值为 -1, 表示 Y 坐标为纵向屏幕高度的代指值, 即 `device.height`.

---

## OpencvPoint

org.opencv.core.Point 别名.
表示一个点, 作为控件信息时则表示点在屏幕的相对位置.

```js
let point = pickup(/.+/, '.');
console.log(`${point.x}, ${point.y}`);
```

部分属性或方法:

- `[p#]` [x](#p-x)
- `[p#]` [y](#p-y)

常见可以返回此类型的方法:

- [UiSelector.pickup](uiSelectorType#m-pickup)

> 参阅: [OpenCV Docs](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Point.html)

---

<p style="font: bold 2em sans-serif; color: #FF7043">org.opencv.core.Point</p>

---

### [C] org.opencv.core.Point

#### [c] (x, y)

- **x** { [number](dataTypes#number) } - 点 X 坐标
- **y** { [number](dataTypes#number) } - 点 Y 坐标
- <ins>**returns**</ins> { [org.opencv.core.Point](#c-orgopencvcorepoint) }

生成一个点.

```js
console.log(new org.opencv.core.Point(10, 20)); // {10.0, 20.0}
```

坐标不会被化为整型:

```js
console.log(new org.opencv.core.Point(10.8, 20.44)); // {10.8, 20.44}
```

#### [c] ()

- <ins>**returns**</ins> { [org.opencv.core.Point](#c-orgopencvcorepoint) }

生成一个点, 并初始化为 `{0, 0}` 坐标.

```js
console.log(new org.opencv.core.Point()); // {0.0, 0.0}
```

#### [c] (points)

- **points** { [number](dataTypes#number)[[]](dataTypes#array) } - 点坐标数组
- <ins>**returns**</ins> { [org.opencv.core.Point](#c-orgopencvcorepoint) }

生成一个点, 并按指定参数初始化坐标.

两个坐标:

```js
console.log(new org.opencv.core.Point([ 5, 23 ])); // {5.0, 23.0}
```

一个坐标, 此坐标作为 X 坐标, Y 坐标初始化为 0:

```js
console.log(new org.opencv.core.Point([ 5 ])); // {5.0, 0.0}
```

空数组, X 与 Y 坐标均为 0:

```js
console.log(new org.opencv.core.Point([])); // {0.0, 0.0}
```

超过两个坐标, 多余坐标将被忽略:

```js
console.log(new org.opencv.core.Point([ 5, 23, 7, 8, 9 ])); // {5.0, 23.0}
```

### [p#] x

- { [number](dataTypes#number) }

点 X 坐标.

如: Point(**180**, 440) 表示点距屏幕左边缘 180 像素.

### [p#] y

- { [number](dataTypes#number) }

点 Y 坐标.

如: Point(180, **440**) 表示点距屏幕上边缘 440 像素.

---

## OpencvSize

org.opencv.core.Size 别名.
表示一个长宽尺寸对象, 作为控件信息时则表示控件矩形在屏幕的控件占用尺寸.

```js
let size = pickup(/.+/, 'size');
console.log(`${size.width}x${size.height}`);
```

部分属性或方法:

* `[p#]` [x](#p-width)
* `[p#]` [y](#p-height)

常见可以返回此类型的方法:

- [UiObject.size](uiobjectType#m-size)

> 参阅: [OpenCV Docs](https://docs.opencv.org/4.x/javadoc/org/opencv/core/Size.html)

---

<p style="font: bold 2em sans-serif; color: #FF7043">org.opencv.core.Size</p>

---

### [C] org.opencv.core.Size

#### [c] (width, height)

- **width** { [number](dataTypes#number) } - 宽度值
- **height** { [number](dataTypes#number) } - 高度值
- <ins>**returns**</ins> { [org.opencv.core.Size](#c-orgopencvcoresize) }

生成一个尺寸对象.

```js
console.log(new org.opencv.core.Size(100, 200)); // 100x200
```

坐标不会被化为整型:

```js
/* 打印时, 数值会转换为整数. */
console.log(new org.opencv.core.Size(1.8, 3.2)); // 1x3
/* 但获取宽高值时, 依然保留原始值, 不会被化为整型. */
console.log(new org.opencv.core.Size(1.8, 3.2).width); // 1.8
console.log(new org.opencv.core.Size(1.8, 3.2).height); // 3.2
```

#### [c] ()

- <ins>**returns**</ins> { [org.opencv.core.Size](#c-orgopencvcoresize) }

生成一个尺寸对象, 并初始化为 `0x0` 宽高尺寸.

```js
console.log(new org.opencv.core.Size()); // 0x0
```

#### [c] (point)

- **point** { [OpencvPoint](#opencvpoint) } - 用于表示尺寸的 "点"
- <ins>**returns**</ins> { [org.opencv.core.Size](#c-orgopencvcoresize) }

生成一个尺寸对象, 并按参数初始化宽高尺寸.

```js
const { Size, Point } = org.opencv.core;
console.log(new Size(new Point(5, 23))); // 5x23
```

#### [c] (dimensions)

- **dimensions** { [number](dataTypes#number)[[]](dataTypes#array) } - 尺寸值数组
- <ins>**returns**</ins> { [org.opencv.core.Size](#c-orgopencvcoresize) }

生成一个尺寸对象, 并按指定参数初始化宽高尺寸.

两个尺寸值:

```js
console.log(new org.opencv.core.Size([ 5, 23 ])); // 5x23
```

一个尺寸值, 此尺寸值作为宽度值, 高度值初始化为 0:

```js
console.log(new org.opencv.core.Size([ 5 ])); // 5x0
```

空数组, 宽度尺寸值均为 0:

```js
console.log(new org.opencv.core.Size([])); // 0x0
```

超过两个尺寸值, 多余尺寸值将被忽略:

```js
console.log(new org.opencv.core.Size([ 5, 23, 7, 8, 9 ])); // 5x23
```

### [p#] width

- { [number](dataTypes#number) }

尺寸宽度值.

### [p#] height

- { [number](dataTypes#number) }

尺寸高度值.

---

## AndroidRect

android.graphics.Rect 别名.  
表示一个矩形, 作为控件信息时则用于表示控件在屏幕的相对位置及空间范围, 又称 **控件矩形**.

```js
let bounds = pickup(/.+/, 'bounds');
console.log(`${bounds.centerX()}, ${bounds.centerY()}`);
```

部分属性或方法:

- `[p#]` [left](#p-left)
- `[p#]` [top](#p-top)
- `[p#]` [right](#p-right)
- `[p#]` [bottom](#p-bottom)
- `[m#]` [width()](#m-width)
- `[m#]` [height()](#m-height)
- `[m#]` [centerX()](#m-centerx)
- `[m#]` [centerY()](#m-centery)
- `[m#]` [exactCenterX()](#m-exactcenterx)
- `[m#]` [exactCenterY()](#m-exactcentery)
- `[m#]` [contains()](#m-contains)
- `[m#]` [intersect()](#m-intersect)
- `[m#]` [intersects()](#m-intersects)

常见可以返回此类型的方法:

- [UiObject#bounds](uiObjectType#m-bounds)
- [UiSelector.pickup](uiSelectorType#m-pickup)

> 参阅: [Android Docs](https://developer.android.com/reference/android/graphics/Rect)

---

<p style="font: bold 2em sans-serif; color: #FF7043">android.graphics.Rect</p>

---

### [C] android.graphics.Rect

#### [c] (left, top, right, bottom)

- **left** { [number](dataTypes#number) } - 矩形左边界 X 坐标
- **top** { [number](dataTypes#number) } - 矩形上边界 Y 坐标
- **right** { [number](dataTypes#number) } - 矩形右边界 X 坐标
- **bottom** { [number](dataTypes#number) } - 矩形下边界 Y 坐标
- <ins>**returns**</ins> { [android.graphics.Rect](#c-androidgraphicsrect) }

生成一个矩形.

```js
let rect = new android.graphics.Rect(10, 20, 80, 90);
console.log(rect); // Rect(10, 20 - 80, 90)
```

如果坐标值为浮点数, 将做向下取整处理:

```js
let rect = new android.graphics.Rect(10.2, 20.7, 80.1, 90.92);
console.log(rect); // Rect(10, 20 - 80, 90)
```

坐标值可以为 0 或负数:

```js
let rect = new android.graphics.Rect(0, 0, -80, -90);
console.log(rect); // Rect(0, 0 - -80, -90)
```

#### [c] ()

- <ins>**returns**</ins> { [android.graphics.Rect](#c-androidgraphicsrect) }

生成一个空矩形.

```js
let rect = new android.graphics.Rect();
console.log(rect); // Rect(0, 0 - 0, 0)
```

#### [c] (rect)

- **rect** { [android.graphics.Rect](#c-androidgraphicsrect) } - 参照矩形
- <ins>**returns**</ins> { [android.graphics.Rect](#c-androidgraphicsrect) }

生成一个新矩形, 并按照参照矩形的参数初始化.

```js
let rectA = new android.graphics.Rect(10, 20, 80, 90);
let rectB = new android.graphics.Rect(rectA);
console.log(rectB); // Rect(10, 20 - 80, 90)
rectB.top = 1;
rectB.bottom = 0;
console.log(rectB); // Rect(10, 1 - 80, 0)
console.log(rectA); // Rect(10, 20 - 80, 90)
```

### [p#] left

- { [number](dataTypes#number) }

矩形左边界 X 坐标.

如: Rect(**180**, 440, 750, 1200) 表示矩形左边界距屏幕左边缘 180 像素.

### [p#] top

- { [number](dataTypes#number) }

矩形上边界 Y 坐标.

如: Rect(180, **440**, 750, 1200) 表示矩形上边界距屏幕上边缘 440 像素.

### [p#] right

- { [number](dataTypes#number) }

矩形右边界 X 坐标.

如: Rect(180, 440, **750**, 1200) 表示矩形右边界距屏幕左边缘 750 像素.

### [p#] bottom

- { [number](dataTypes#number) }

矩形下边界 Y 坐标.

如: Rect(180, 440, 750, **1200**) 表示矩形下边界距屏幕上边缘 1200 像素.

### [m#] width

#### width()

- <ins>**returns**</ins> { [number](dataTypes#number) }

矩形宽度.

```js
let rect = new android.graphics.Rect(180, 440, 750, 1200);
console.log(rect.width()); // 570
```

宽度可能为 0 或负数:

```js
let rectA = new android.graphics.Rect(0, 440, 0, 1200);
console.log(rectA.width()); // 0
let rectB = new android.graphics.Rect(30, 440, 10, 1200);
console.log(rectB.width()); // -20
```

### [m#] height

#### height()

- <ins>**returns**</ins> { [number](dataTypes#number) }

矩形高度.

```js
let rect = new android.graphics.Rect(180, 440, 750, 1200);
console.log(rect.height()); // 760
```

高度可能为 0 或负数:

```js
let rectA = new android.graphics.Rect(180, 1200, 750, 1200);
console.log(rectA.height()); // 0
let rectB = new android.graphics.Rect(180, 40, 750, 10);
console.log(rectB.height()); // -30
```

### [m#] centerX

#### centerX()

- <ins>**returns**</ins> { [number](dataTypes#number) }

矩形中点 X 坐标 (向下取整).

```js
let rectA = new android.graphics.Rect(180, 440, 750, 1200);
console.log(rectA.centerX()); // 465

let rectB = new android.graphics.Rect(100, 200, 101, 201);
console.log(rectB.centerX()); // 100
```

### [m#] centerY

#### centerY()

- <ins>**returns**</ins> { [number](dataTypes#number) }

矩形中点 Y 坐标 (向下取整).

```js
let rectA = new android.graphics.Rect(180, 440, 750, 1200);
console.log(rectA.centerY()); // 820

let rectB = new android.graphics.Rect(100, 200, 101, 201);
console.log(rectB.centerY()); // 200
```

### [m#] exactCenterX

#### exactCenterX()

- <ins>**returns**</ins> { [number](dataTypes#number) }

矩形中点 X 坐标 (浮点数).

```js
let rectA = new android.graphics.Rect(180, 440, 750, 1200);
console.log(rectA.exactCenterX()); // 465

let rectB = new android.graphics.Rect(100, 200, 101, 201);
console.log(rectB.exactCenterX()); // 100.5
```

### [m#] exactCenterY

#### exactCenterY()

- <ins>**returns**</ins> { [number](dataTypes#number) }

矩形中点 Y 坐标 (浮点数).

```js
let rectA = new android.graphics.Rect(180, 440, 750, 1200);
console.log(rectA.exactCenterY()); // 820

let rectB = new android.graphics.Rect(100, 200, 101, 201);
console.log(rectB.exactCenterY()); // 200.5
```

### [m#] contains

#### contains(rect)

- **rect** { [android.graphics.Rect](#c-androidgraphicsrect) } - 参照矩形
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回是否包含另一个矩形.  
参照矩形的所有边均在当前矩形内 (包含边重叠情况) 则满足包含条件.  
空矩形与任何矩形不存在包含关系.

```js
let rectThis = new android.graphics.Rect(180, 440, 750, 1200);

let rectRefA = new android.graphics.Rect(rectThis);
console.log(rectThis.contains(rectRefA)); // true

let rectRefB = new android.graphics.Rect(200, 440, 750, 1200);
console.log(rectThis.contains(rectRefB)); // true

let rectRefC = new android.graphics.Rect(); /* 空矩形. */
console.log(rectThis.contains(rectRefC)); // false
```

### [m#] intersect

#### intersect(rect)

- **rect** { [android.graphics.Rect](#c-androidgraphicsrect) } - 参照矩形
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回是否与参展矩形相交 (不包括边界或点重叠的情况).  
如果相交, 则返回 true, **且当前矩形被设置为相交部分的矩形**.

```js
let rectThis = new android.graphics.Rect(0, 0, 600, 600);
let rectRef = new android.graphics.Rect(200, 0, 800, 800);

console.log(rectThis.intersect(rectRef)); // true

/* rectThis 被修改. */
console.log(rectThis); // Rect(200, 0 - 600, 600) 
```

如果不相交, 则返回 false, 当前矩形不会被修改:

```js
let rectThis = new android.graphics.Rect(0, 0, 100, 100);
let rectRef = new android.graphics.Rect(100, 0, 800, 800);

console.log(rectThis.intersect(rectRef)); // false

/* rectThis 保持原来的值. */
console.log(rectThis); // Rect(0, 0 - 100, 100)
```

空矩形与任意矩形不相交:

```js
let rectThis = new android.graphics.Rect(0, 0, 100, 100);
let rectRef = new android.graphics.Rect();
console.log(rectThis.intersect(rectRef)); // false
```

### [m] intersects

#### intersects(rectA, rectB)

- **rect** { [android.graphics.Rect](#c-androidgraphicsrect) } - 参照矩形
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回是否和另一个长方形相交.

此方法近判断是否相交, 不改变任何矩形:

```js
let rectA = new android.graphics.Rect(0, 0, 600, 600);
let rectB = new android.graphics.Rect(200, 0, 800, 800);

console.log(android.graphics.Rect.intersects(rectA, rectB)); // true

/* rectA 和 refB 均保持原来的值. */
console.log(rectA); // Rect(0, 0 - 600, 600)
console.log(rectB); // Rect(200, 0 - 800, 800)
```

需额外留意 [intersects](#m-intersects) 与 [intersect](#m-intersect) 的区别:

- `[m#] intersect` 为实例方法, `rectA.intersect(rectB)` 需传入一个参数, 当相交时 `rectA` 会被改变, 返回结果为 "是否相交".

- `[m] intersects` 为静态方法, `Rect.intersects(rectA, rectB)` 需传入两个参数, 且不改变任何矩形, 仅返回 "是否相交" 结果.

## AndroidBundle

android.os.Bundle 别名.  
表示一个会被打包成捆的容器, 容器内可存储 `键值对 (Key-Value Pair)` 形式的数据.

```js
let bundleA = new android.os.Bundle();
bundleA.putInt("num_key", 23);
console.log(bundleA.getInt("num_key") === 23); // true

let bundleB = new android.os.Bundle();
let arrList = new java.util.ArrayList(2);
arrList.add("A");
arrList.add("B");
bundleB.putStringArrayList("arr_list_key", arrList);
console.log(bundleB.getStringArrayList("arr_list_key").get(0) === "A"); // true
console.log(bundleB.getStringArrayList("arr_list_key").get(1) === "B"); // true
```

> 参阅: [Android Docs](https://developer.android.com/reference/android/os/Bundle)

## DetectCompass

用于传递给 [控件罗盘](uiObjectType#m-compass) 的参数类型, 又称 `罗盘参数`.

罗盘参数是 [字符串](dataTypes#string) 类型, 支持单独或组合使用.

下面列举了部分罗盘参数示例:

- `p` - 父控件
- `p2` - 二级父控件
- `c0` - 索引 0 (首个) 子控件
- `c2` - 索引 2 子控件
- `c-1` - 末尾子控件
- `s5` - 索引 5 兄弟控件
- `s-2` - 倒数第 2 兄弟控件
- `s<1` - 相邻左侧兄弟节点
- `s>1` - 相邻右侧兄弟节点
- `k2` - 向上寻找可点击控件 (最多 2 级)
- `p4c0>1>1>0s0` - 组合使用

[控件罗盘 (UiObject.compass)](uiObjectType#m-compass) 是 [控件探测 (UiObject.detect)](uiObjectType#m-detect) 的衍生方法, 因此类型命名采用了 `DetectCompass`.

## DetectResult

[控件探测 (UiObject.detect)](uiObjectType#m-detect) 的结果参数类型, 又称 `探测结果`, 此过程也称为 `结果筛选`.

- `# / w / widget` - [控件](uiObjectType)
- `$ / txt / content` - [文本内容](uiObjectType#m-content)
- `. / pt / point` - [点](uiObjectType#m-point)
- `UiObjectInvokable` - [控件可调用类型](#uiobjectinvokable)

```js
/* 控件. */
detect(w, '#');
detect(w, 'w'); /* 同上. */
detect(w, 'widget'); /* 同上. */

/* 文本内容. */
detect(w, '$');
detect(w, 'txt'); /* 同上. */
detect(w, 'content'); /* 同上. */

/* 点. */
detect(w, '.');
detect(w, 'pt'); /* 同上. */
detect(w, 'point'); /* 同上. */

/* UiObjectInvokable (控件可调用类型). */
detect(w, 'click'); /* i.e. w.click() */
detect(w, [ 'setText', 'hello' ]); /* i.e. w.setText('hello') */
```

不同于 [PickupResult (拾取结果)](#pickupresult), `探测结果` 的种类相对较少.

## DetectCallback

探测回调.

探测回调用于处理 [控件探测 (UiObject.detect)](uiObjectType#m-detect) 的结果.

`回调结果` 将影响 `探测结果`, 当 `回调结果` 返回 `undefined` 时, 将直接返回 `探测结果`, 否则返回 `回调结果`:

```ts
function detect<T extends UiObject, R>(w: T, callback: (w: T) => R): T | R {
    let callbackResult: R = callback(w);
    return callbackResult == undefined ? w : callbackResult;
}
```

示例:

```js
let w = pickup(/.+/);

/* 返回 w.content() 的结果. */
detect(w, (w) => w.content());

/* 返回 w 的结果. */
detect(w, (w) => {
    console.log(w.content());
});
```

## PickupSelector

[拾取选择器](uiSelectorType#m-pickup) 的 `选择器参数`.

`选择器参数` 的类型分为 [单一型选择器](#单一型选择器) 和 [混合型选择器](#混合型选择器).

### 单一型选择器

单一型选择器包含 [ [经典选择器](#经典选择器) / [内容选择器](#内容选择器) / [对象选择器](#对象选择器) ].

#### 经典选择器

`text('abc')` 或串联形式 `text('abc').clickable().centerX(0.5)`.

#### 内容选择器

字符串 `'abc'` 或正则表达式 `/abc/`.  
相当于 `content('abc')` 及 `contentMatch(/abc/)`.

#### 对象选择器

将选择器名称作为 `键 (key)`, 选择器参数作为 `值 (value)`.  
若参数多于 1 个, 使用数组包含所有参数; 若无参数, 使用 `[]` (空数组) 或 `null`, 或默认值 (如 `true`).  
虽然一个参数也可使用数组, 但通常无必要.

```js
/* 经典选择器. */
let selClassic = text('abc').clickable().centerX(0.5).boundsInside(0.2, 0.05, -1, -1).action('CLICK', 'SET_TEXT', 'LONG_CLICK');

/* 对象选择器. */
let selObject = {
    text: 'abc',
    clickable: [], /* 或 clickable: true . */
    centerX: 0.5,
    boundsInside: [ 0.2, 0.05, -1, -1 ],
    action: [ 'CLICK', 'SET_TEXT', 'LONG_CLICK' ],
};
```

### 混合型选择器

混合型选择器由多个单一型选择器组成.

用数组表示一个混合型选择器, 其中的元素为单一型选择器:

```js
pickup([ /he.+/, clickable(true).boundsInside(0.2, 0.05, -1, -1) ]);
```

上述示例的选择器参数使用了混合型选择器, 它包含两个单一型选择器, 分别为 [内容选择器](#内容选择器) 和 [经典选择器](#经典选择器).

上述示例可以转换为单一型选择器:

```js
/* 对象选择器. */
pickup({
    contentMatch: /he.+/,
    clickable: true,
    boundsInside: [ 0.2, 0.05, -1, -1 ],
});

/* 经典选择器. */
pickup(contentMatch(/he.+/).clickable(true).boundsInside(0.2, 0.05, -1, -1));
```

## PickupResult

[拾取选择器 (UiSelector#pickup)](uiSelectorType#m-pickup) 的结果参数类型, 又称 `拾取结果`, 此过程也称为 `结果筛选`.

- `# / w / widget` - [控件 (UiObject)](uiObjectType)
- `{} / #{} / {#} / w{} / {w} / wc / collection / list` -> [控件集合 (UiObjectCollection)](uiObjectCollectionType)
- `[] / #[] / [#] / w[] / [w] / ws / widgets` -> [控件 (UiObject)](uiObjectType) 数组
- `$ / txt / content` - [文本内容 (UiObject#content)](uiObjectType#m-content)
- `$[] / [$] / txt[] / [txt] / content[] / [content] / contents` -> [文本内容 (UiObject#content)](uiObjectType#m-content) 数组
- `. / pt / point` - [点 (UiObject#point)](uiObjectType#m-point)
- `.[] / [.] / point[] / [point] / pt[] / [pt] / points / pts` -> [点 (UiObject#point)](uiObjectType#m-point) 数组
- `@ / selector / sel` -> [选择器 (UiSelector)](uiSelectorType)
- `? / exists` -> [存在判断 (UiSelector#exists)](uiSelectorType#m-exists)
- `UiObjectInvokable` - [控件可调用类型](#uiobjectinvokable)

```js
/* 控件. */
pickup(sel, '#');
pickup(sel, 'w'); /* 同上. */
pickup(sel, 'widget'); /* 同上. */

/* 文本内容. */
pickup(sel, '$');
pickup(sel, 'txt'); /* 同上. */
pickup(sel, 'content'); /* 同上. */

/* 文本内容数组. */
pickup(sel, '$[]');
pickup(sel, 'txt[]'); /* 同上. */
pickup(sel, '[content]'); /* 同上. */
pickup(sel, 'contents'); /* 同上. */

/* 点. */
pickup(sel, '.');
pickup(sel, 'pt'); /* 同上. */
pickup(sel, 'point'); /* 同上. */

/* 点数组. */
pickup(sel, '.[]');
pickup(sel, '[.]'); /* 同上. */
pickup(sel, '[point]'); /* 同上. */
pickup(sel, 'points'); /* 同上. */

/* UiObjectInvokable (控件可调用类型). */
pickup(sel, 'click'); /* i.e. sel.findOnce().click() */
pickup(sel, [ 'setText', 'hello' ]); /* i.e. sel.findOnce().setText('hello') */
```

与 [DetectResult (探测结果)](#detectresult) 相比, `拾取结果` 的种类更加丰富.

## UiObjectInvokable

控件可调用类型, 用于使用参数形式实现方法调用, 又称 `参化调用`.

支持所有 [UiObject](uiObjectType) 的实例方法, 如果方法需要传递参数, 需要将参数连同方法名称放入数组后再传递.

```js
/* 无参方法. */
detect(w, 'click'); /* i.e. w.click() */
detect(w, 'imeEnter'); /* i.e. w.imeEnter() */

/* 含参方法. */
detect(w, [ 'child', 0 ]); /* i.e. w.child(0) */
detect(w, [ 'setText', 'hello' ]); /* i.e. w.setText('hello') */
detect(w, [ 'setSelection', 2, 3 ]); /* i.e. w.setSelection(2, 3) */
```