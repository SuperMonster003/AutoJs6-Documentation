# 关于文档 (About)

<!-- type=misc -->

AutoJs6 文档, 包含模块 API 使用方法及用例.  
项目复刻 (Fork) 自 [hyb1996/AutoJs-Docs](https://github.com/hyb1996/AutoJs-Docs/) (GitHub).  
项目地址: [SuperMonster003/AutoJs6-Documentation](http://docs-project.autojs6.com) (GitHub).

---

## 文档阅读示例

### 基础

#### device.height

device 表示全局对象 (这里同时也是一个模块).  
".height" 表示访问 device 对象的 height 成员变量.  
如 console.log(device.height) 表示在控制台打印当前设备的高度数值.

#### colors.rgb(red, green, blue)

colors 与 device 类似, 表示全局对象.  
"rgb" 表示方法名称, ".rgb()" 表示调用 colors 的 rgb 方法, 括号内的 red 等表示方法参数.  
如 console.log(colors.rgb(255, 128, 64)) 表示在控制台打印一个 RGB 分别为 255, 128 和 64 的颜色数值.

> 注: 绝大多数情况, 文档不对 "[函数](https://developer.mozilla.org/zh-CN/docs/Glossary/Function/)" 与 "[方法](https://developer.mozilla.org/zh-CN/docs/Glossary/Method/)" 做明确区分.

### 临时作用域对象

通常每个章节都以某个对象作为主题.

例如上述 `colors.rgb(red, green, blue)` 位于 [Color - 颜色](color) 这个章节.  
其中 colors 称为此章节的 "临时作用域对象",  
它可能是一个对象, 函数, 甚至 "类", 在文档中使用 __`橙色粗体`__ 表示.

列举其后续的相关方法及属性时, 将不再重复书写对象本身:

<p style="font: bold 1em sans-serif; color: #FF7043">colors</p>

[m] rgb

rgb(red, green, blue)

... ...

上述 `rgb` 表示 `colors.rgb`.

### 参数类型

#### colors.rgb(red, green, blue)

- **red** { [number](dataTypes#number) }
- **green** { [number](dataTypes#number) }
- **blue** { [number](dataTypes#number) }

参数后的 "{}" 内包含其类型.  
上述示例表示需要传入三个 [number](dataTypes#number) 类型的参数.  
如 colors.rgb(255, 128, 64) 合法, 而 colors.rgb("abc", 128, 64) 将可能导致非预期结果或出现异常.

> 注: 点击类型对应的超链接 (如有) 可跳转至类型详情页面.

### 返回值类型

#### colors.rgb(red, green, blue)

- **red** { [number](dataTypes#number) }
- **green** { [number](dataTypes#number) }
- **blue** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [number](dataTypes#number) }

returns 后的 "{}" 内包含返回值类型.  
上述示例表示 colors.rgb 方法调用后将返回 [number](dataTypes#number) 类型数据.

### 属性类型

#### colors.RED

- { [number](dataTypes#number) }

属性类型包裹在一对花括号中.  
上述示例表示 colors 的 RED 属性是 [number](dataTypes#number) 类型数据.

对象字面量形式的类型则用一对双花括号表示:

- **properties** {{ name: [string](dataTypes#string); age: [number](dataTypes#number) }}

多行形式:

- **properties** {{
    - name: [string](dataTypes#string);
    - age: [number](dataTypes#number);
    - laugh(decibel?: [number](dataTypes#number));
- }}

一个符合上述示例期望的变量:

```js
let o = { name: "David", age: 13 };
```

可存取的属性在读取时如果有非 undefined 默认值, 则以一对方括号表示:

- [ `1200` ] { [number](dataTypes#number) }

上述示例表示一个默认值为 1200 的可存取属性.

以一对双方括号表示常量:

- [[ 0.5 ]] { [number](dataTypes#number) }

上述示例表示一个值为 0.5 的常量属性.

### 方法签名

形如上述 [返回值类型](#返回值类型) 小节的示例,  
包含 [ 方法名称 + 参数类型 + 返回值类型 ] 的标志符, 称为 "方法签名".

> 注: 上述 "方法签名" 定义只用于辅助读者对文档的理解, 并不保证名词解释的合理性.

### 方法描述

#### colors.rgb(red, green, blue)

- __red__ - R (红色) 通道数值  [ A ]
- __green__ - G (绿色) 通道数值  [ A ]
- __blue__ - B (蓝色) 通道数值  [ A ]
- __@return__ - 颜色数值  [ B ]

获取 R/G/B 通道组合后的颜色数值. [ C ]

```js
[ D ]
colors.rgb(255, 128, 64); // -32704
colors.rgb(255, 128, 64) === 0xFFFF8040 - Math.pow(2, 32); // true
colors.rgb(255, 128, 64) === colors.toInt("#FFFF8040"); // true
colors.rgb(255, 128, 64) === colors.toInt("#FF8040"); // true
```

上述示例包含的字母标注含义:

- [ A ] - 参数描述
- [ B ] - 方法返回值描述
- [ C ] - 方法描述
- [ D ] - 方法使用示例

### 可变参数

#### files.join(parent, ...child)

上述示例的 child 参数是 "可变参数", 也称为 "可变长参数" 或 "变长参数".  
可变参数可传入任意个 (包括 0 个) 参数:

```js
let p = files.getSdcardPath();
files.join(p); /* 0 个可变参数 */
files.join(p, 'a'); /* 1 个可变参数 */
files.join(p, 'a', 'b', 'c', 'd'); /* 4 个可变参数 */
```

文档采用 JSDoc 标准标注可变参数, 需额外注意 JSDoc 的尾数组标识代表容器, 用于容纳展开后的参数:

```js
/**
 * @param {number} x
 * @param {number} y
 * @param {...number[]} others
 */
function sum(x, y, others) {
    /* ... */
}
```

上述示例 others 参数为可变参数, 其中 "...number[]" 代表 others 期望的参数类型为 number, 而非 number[], 最后的 "[]" 代表 "..." 的容器, "..." 与 "[]" 是配对出现的.

```js
/**
 * @param {number} x
 * @param {number} y
 * @param {...number[][]} others
 */
function sum(x, y, others) {
    /* ... */
}
```

上述示例 others 期望的参数类型为 number[], 而非 number[][], 同样最后的 "[]" 代表 "..." 的容器.

```js
/**
 * @param {number} x
 * @param {number} y
 * @param {...number} others
 */
function sum(x, y, others) {
    /* ... */
}
```

上述示例 others 的参数类型标识方法 "...number" 也是合法的, 它其实是 "...number[]" 的省略形式.  
文档为了避免歧义, 将全部采用完整写法.

作为强调, "...(SomeType)[]" 这样的可变参数表示方法, 需要把 "..." 和 "[]" 视为一个整体, 中间部分才是期望的参数类型.

### 可选参数

#### device.vibrate(text, delay?)

上述示例的 delay 参数是可选的 (以 "?" 标注).  
因此以下调用方式均被支持:

```js
device.vibrate("hello", 2e3); /* 两秒钟延迟. */
device.vibrate("hello"); /* 无延迟. */
```

可选参数描述时会以 "[]" 标注:

- **[ delay ]** { [number](dataTypes#number) }

如果可选参数包含默认值, 则会以 "=" 标注:

- **[ delay = 0 ]** { [number](dataTypes#number) }

详见下述 [参数默认值](#参数默认值)

### 参数默认值

#### device.vibrate(text, delay?)

- **text** { [string](dataTypes#string) } - 需转换为摩斯码的文本
- **[ delay = 0 ]** { [number](dataTypes#number) } - 振动延迟
- <ins>**returns**</ins> { [void](dataTypes#void) }

上述示例的 delay 参数是可选的 (以 "?" 标注) 且包含默认值 (以 "=" 标注).  
因此以下两种调用方式等效:

```js
device.vibrate("hello");
device.vibrate("hello", 0);
```

> 注: 上述示例的方法签名 (含默认值标注) 在 TypeScript 中并不合法, 此类签名仅限在文档中使用.
>
> 注: 以 "=" 标注的参数一定是可选的, 此时参数的 "?" 标注可能被省略, 尤其在重载签名拆写的情况下.  
> 详情参阅下文的 "方法重载".

### 方法重载

__`Overload 1/17`__

#### pickup(selector, compass, resultType)

__`Overload 2/17`__

#### pickup(selector, compass)

__`Overload 3/17`__

#### pickup(selector, resultType)

... ...

__`Overload 16/17`__

#### pickup(root, selector)

__`Overload 17/17`__

#### pickup()

包含 "Overload m/n" 标签的方法, 表示重载方法的序数及总量.  
如 "Overload 2/3" 表示当前方法签名描述第 2 个重载方法, 总计 3 个,  
而 "Overload 5-6/17" 表示当前方法签名涵盖第 5 及 第 6 个重载方法, 总计 17 个.

重载方法可被简化:

```text
/* 拆写. */
device.vibrate(text)
device.vibrate(text, delay)

/* 合写 (简化). */
device.vibrate(text, delay?)

/* 可选参数通常会标注默认值. */
device.vibrate(text, delay?)
· [ delay = 0 ] { number }

/* 即使没有 "?" 标注 (针对拆写). */
device.vibrate(text, delay)
· [ delay = 0 ] { number }
```

多数情况下, 文档采用拆写的方式描述重载方法.

### 方法全局化

__`Global`__

#### images.requestScreenCapture(landscape)

包含 "Global" 标签的方法, 表示支持全局化使用, 可省略模块对象调用.  
因此以下两种调用方式等效:

```js
images.requestScreenCapture(false);
requestScreenCapture(false);
```

### 方法标签

用于简便表示方法的特性:

- `Global`: [方法全局化](#方法全局化) (可省略模块对象直接调用).
- `Overload 2/3`: [方法重载](#方法重载) [ 第 2 个, 共 3 个 ].
- `Non-UI`: 方法不能在 UI 模式下调用.
- `6.2.0`: 方法对 AutoJs6 的版本要求 [ 不低于 6.2.0 ].
- `[6.2.0]`: 与原同名方法相比, 方法的功能, 结果, 签名或使用方式发生变更的起始版本.
- `API>=29`: 方法对 [API 级别](apiLevel) 的要求 [ 不低于 29 ], 当不满足时不抛出异常.
- `API>=29!`: 方法对 [API 级别](apiLevel) 的要求 [ 不低于 29 ], 当不满足时将抛出异常.
- `A11Y`: 方法依赖无障碍服务.
- `A11Y?`: 方法可能会依赖无障碍服务.
- `Async`: 异步执行的方法.
- `Async?`: 可能异步执行的方法 (通过参数控制).
- `Getter`: 仅取值属性, 即使用 Getter 定义的对象属性.
- `Setter`: 仅存值属性, 即使用 Setter 定义的对象属性.
- `Getter/Setter`: 可存值且可取值属性, 即同时使用 Setter 及 Getter 定义的对象属性.
- `Enum`: 枚举类.
- `CONSTANT`: 常量.
- `READONLY`: 只读属性或方法.
- `DEPRECATED`: 已弃用的属性或方法. 表示不推荐使用, 通常会有替代属性或替代方法.
- `ABANDONED`: 已废弃的属性或方法. 表示不再提供功能支持, 使用后功能将无效.
- `xProto`: 针对原型的内置对象扩展.
- `xObject`: 针对对象的内置对象扩展.
- `xAlias`: 内置对象扩展时使用不同的方法或属性名称 (别名).

### 对象标签

用于简便表示对象的属性:

- \[m]: 普通对象方法或类静态成员方法.
    - 例如在 `images` 作为 [临时作用域对象](#临时作用域对象) 时:
    - `[m] captureScreen` 代表 `images.captureScreen` 方法.
- \[m+]: 具有扩展属性的对象方法.
    - 如 auto 本身是一个方法 (或称函数), waitFor 是 auto 的一个扩展方法.
    - 以下两种调用方式均可用: `auto()` 及 `auto.waitFor()`.
- \[p]: 普通对象属性或类静态成员属性或接口变量属性.
    - 例如在 `device` 作为 [临时作用域对象](#临时作用域对象) 时:
    - `[p] height` 代表 `device.height` 属性, 而非方法.
    - 此标签对 [ Getter / Setter / "类" 属性 / 对象属性 / 方法扩展属性 ] 等不作区分.
- \[p+]: 具有扩展属性的对象属性.
    - 如 autojs 是一个对象, version 是 autojs 的扩展属性,
    - 支持 `autojs.version.xxx` 这样的访问方式,
    - 因此 version 属性将被标记为 `[p+]`.
- \[I]: Java 接口.
- \[C]: Java 类或 JavaScript 构造函数.
- \[c]: Java 类的构造方法.
- \[m!]: 抽象方法 (针对接口及抽象类).
- \[m=]: 包含默认实现的抽象方法 (针对接口).
- \[m#]: 类的实例成员方法.
    - 类的静态成员方法用 [m] 标签标记.
    - 例如对于类 `B`, 它有一个实例 `b` (可能通过 `new B()` 等方式获得),
    - `[m#] foo` 和 `[m] bar` 的调用方式分别为
    - `b.foo()` 和 `B.bar()`.
- \[p#]: 类的实例成员属性.
    - 类的静态成员属性依然用 [p] 标签标记.
    - 例如对于类 `F`, 它有一个实例 `f` (可能通过 `new F()` 等方式获得),
    - `[p#] foo` 和 `[p] bar` 的调用方式分别为
    - `f.foo` 和 `F.bar`.
- \[@]: 代表 [临时作用域对象](#临时作用域对象) 自身.
    - 例如在同一个章节中
        - `[@] apple` [1]
        - `apple(c)` [2]
        - `[m] getColor` [3]
        - `getColor()` [4]
        - `[@] banana` [5]
        - `[m] banana` [6]
        - `banana(x)` [7]
        - `banana(x, y)` [8]
    - 这个章节有两个 [临时作用域对象](#临时作用域对象), apple 和 banana, 对应 `[1]` 和 `[5]`.
    - `[2]` 代表 apple 自身可被调用, 且调用方式为 `apple(c)`, 其中 "c" 为参数.
    - `[3]` 代表 apple 的一个方法, 名称为 "getColor",
    - 由 `[4]` 得知, 其调用方式为 `apple.getColor()`.
    - 注意 `[6]` 与 `[2]` 不同:
    - `[6]` 代表 banana 的一个方法, 名称为 "banana",
    - 由 `[7]` 和 `[8]` 得知, 其调用方式有两种,
    - `banana.banana(x)` 和 `banana.banana(x, y)`.

### 成员访问

成员访问用 "." 表示调用关系, 包括 "类" 静态成员访问, 对象成员访问等.  
而实例成员访问则需要 "类" 的实例才能访问, 用 "#" 表示调用关系.  
例如 JavaScript 的 Number 本身是一个 "类", 可用的成员访问方式如下:

```js
Number(2); /* 作为普通函数使用, 无成员访问. */
Number.EPSILON; /* "类" 静态成员访问, 用 "Number.EPSILON" 标识, 标签为 "[p]". */
new Number(2); /* 创建 "类" 实例, 无成员访问. */
new Number(2).toFixed(0); /* 实例成员访问, 用 "Number#toFixed(number)" 标识, 标签为 "[m#]". */
```

实例成员访问示例:

<p style="font: bold 1em sans-serif; color: #FF7043">UiObject</p>

[m#] bounds()

```js
/* 正确访问示例 */

let w = pickup(/.+/); /* w 是 UiObject 的实例. */
if (w !== null) {
    console.log(w.bounds()); /* 访问 UiObject 实例的 bounds 方法. */
}

/* 错误访问示例 */

importClass(org.autojs.autojs.core.automator.UiObject);
console.log(UiObject.bounds()); /* 访问的是类 UiObject 的静态方法 bounds. */
```

### 模板参数

#### foo.bar(a, b)

- **a** { [T](dataTypes#generic) }
- **b** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [T](dataTypes#generic) }
- <ins>**template**</ins> { [T](dataTypes#generic) }

template 标签指示了一个模板参数 `T`, 这个参数可以代表任意一个类型, 如 `string`.

示例 `foo.bar(a, b)` 中, 返回值与参数 `a` 的类型均为 `T`, 因此两者的类型相同.

例如当参数 `a` 传入 `string` 类型时, 返回值也为 `string` 类型:

```js
typeof foo.bar('hello', 3); // string
```

> 参阅: [泛型](dataTypes#generic)

## 声明

当前项目 (文档) 及 [AutoJs6](http://project.autojs6.com) (App) 均为二次开发.  
相对于 [原始 App](https://github.com/hyb1996/Auto.js/), 二次开发的 App 中会增加或修改部分模块功能.  
相对于 [原始文档](https://github.com/hyb1996/AutoJs-Docs/), 二次开发的文档将进行部分增删或重新编写.  
开发者无法保证对 API 的完全理解及文档的无纰漏撰写.  
如有任何不当之处, 欢迎提交 [Issue](http://docs-issues.autojs6.com) 或 [PR](http://docs-pr.autojs6.com).  