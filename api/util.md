# 工具 (Util)

util 模块提供类型判断, 参数检查, 字符串处理, 单位换算, Java 互操作, Android 版本信息, 对象格式化和摩尔斯电码工具.

`util` 与 `$util` 指向同一个模块对象. 此模块由 AutoJs6 直接注入, 无需通过 Node.js 的 `require('util')` 加载.

---

<p style="font: bold 2em sans-serif; color: #FF7043">util</p>

---

## [@] util

- { [Object](dataTypes#object) }

AutoJs6 工具模块对象.

## [m] isArray

### util.isArray(o)

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否为 JavaScript 数组

此方法不把 Java 数组视为 JavaScript 数组. 判断 Java 数组时使用 [util.isJavaArray(o)](#util-isjavaarray-o).

## [m] isBoolean

### util.isBoolean(o)

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - JavaScript 类型是否为 `boolean`

## [m] isNull

### util.isNull(o)

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否严格为 `null`

## [m] isNullOrUndefined

### util.isNullOrUndefined(o)

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否为 `null` 或 `undefined`

## [m] isNumber

### util.isNumber(o)

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - JavaScript 类型是否为 `number`

`NaN` 和无穷值的 JavaScript 类型仍为 `number`.

## [m] isString

### util.isString(o)

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - JavaScript 类型是否为 `string`

## [m] isSymbol

### util.isSymbol(o)

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - JavaScript 类型是否为 `symbol`

## [m] isUndefined

### util.isUndefined(o)

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否为 `undefined`

## [m] isRegExp

### util.isRegExp(o)

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否为 JavaScript 正则表达式

## [m] isObject

### util.isObject(o)

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否为非空 JavaScript 对象

此方法按 JavaScript 的 `typeof` 结果判断对象, 并排除 `null`. 函数不视为对象.

## [m] isDate

### util.isDate(o)

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否为 JavaScript `Date` 对象

## [m] isError

### util.isError(o)

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否为 JavaScript 错误对象

## [m] isFunction

### util.isFunction(o)

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - JavaScript 类型是否为 `function`

## [m] isBigInt

### util.isBigInt(o)

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - JavaScript 类型是否为 `bigint`

## [m] isJavaObject

### util.isJavaObject(o)

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否为 Rhino 包装的 Java 对象

## [m] isJavaArray

### util.isJavaArray(o)

**`[6.8.0]`**

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 解包后是否为 Java 数组

基本类型数组和对象数组均可识别.

## [m] isInteger

### util.isInteger(o)

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否为整数

## [m] isPrimitive

### util.isPrimitive(o)

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否不是引用类型

此方法是 [util.isReference(o)](#util-isreference-o) 的逻辑取反.

## [m] isReference

### util.isReference(o)

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否为非空 JavaScript 对象或函数

## [m] isEmptyObject

### util.isEmptyObject(o)

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否为不含自有属性的 JavaScript 对象

## [m] unwrapJavaObject

### util.unwrapJavaObject(o)

- **o** { [any](dataTypes#any) } - 待解包的值
- <ins>**returns**</ins> { [any](dataTypes#any) } - 解包或规范化后的值

递归解包 Rhino `Wrapper` 对象. 字符串, 数字和布尔值会规范化为对应的 JavaScript 值, Kotlin `Unit` 会转换为 `undefined`.

## [m] extend

### util.extend(derived, base)

- **derived** { [Function](dataTypes#function) } - 子构造函数
- **base** { [Function](dataTypes#function) | [Object](dataTypes#object) | [null](dataTypes#null) } - 父构造函数或原型来源
- <ins>**returns**</ins> { [void](dataTypes#void) }

建立构造函数及其实例原型的继承关系. `derived` 必须是可修改原型的 Rhino 脚本对象.

```js
function Animal() {
}

function Cat() {
}

util.extend(Cat, Animal);
```

## [m] format

### util.format(...args)

- **...args** { ...([any](dataTypes#any))[] } - 格式字符串及替换值
- <ins>**returns**</ins> { [string](dataTypes#string) } - 格式化结果

当首个参数为字符串时, 支持以下占位符:

- `%s`: 转换为字符串.
- `%d`: 转换为数字.
- `%j`: 使用 `JSON.stringify` 转换, 循环引用显示为 `[Circular]`.
- `%%`: 输出 `%`, 不消耗参数.

缺少对应参数的占位符保持原样. 未被占位符消耗的参数以空格分隔追加, 对象使用 [util.inspect(value, options?)](#util-inspect-value-options) 格式化.

当首个参数不是字符串时, 所有参数均使用 `util.inspect` 格式化并以空格分隔. 无参数时返回空字符串.

```js
util.format("%s: %d", "count", 3); // "count: 3"
util.format("100%%"); // "100%"
```

## [m] deprecate

### util.deprecate(...args)

- **...args** { ...([any](dataTypes#any))[] } - 兼容参数, 当前实现不读取
- <ins>**returns**</ins> { [void](dataTypes#void) }

**`ABANDONED`**

此 Node.js 兼容入口不适用于 AutoJs6. 调用时仅在控制台输出警告, 不会包装或返回传入函数.

## [m] debuglog

### util.debuglog(...args)

- **...args** { ...([any](dataTypes#any))[] } - 兼容参数, 当前实现不读取
- <ins>**returns**</ins> { [void](dataTypes#void) }

**`ABANDONED`**

此 Node.js 兼容入口不适用于 AutoJs6. 调用时仅在控制台输出警告, 不会返回日志函数.

## [m] log

### util.log(...args)

- **...args** { ...([any](dataTypes#any))[] } - 待输出的值
- <ins>**returns**</ins> { [void](dataTypes#void) }

在格式化结果前添加 `dd MMM HH:mm:ss` 形式的时间戳, 然后写入控制台.

## [m] checkStringArgument

### util.checkStringArgument(src, pattern)

- **src** { [string](dataTypes#string) | [number](dataTypes#number) | [boolean](dataTypes#boolean) | [symbol](dataTypes#symbol) | [bigint](glossaries#bigint) | [undefined](dataTypes#undefined) } - 待检查的非空原始值
- **pattern** { [string](dataTypes#string) | kotlin.text.Regex } - 匹配模式
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 去除首尾空白后是否完整匹配

匹配忽略大小写. `pattern` 为字符串时, 方法会自动补齐开头和结尾锚点. `src` 为 `null` 或引用类型时抛出异常.

## [m] checkStringParam

### util.checkStringParam(src, pattern)

**`6.8.0`** **`DEPRECATED`**

- **src** { [any](dataTypes#any) } - 待检查的值
- **pattern** { [string](dataTypes#string) | kotlin.text.Regex } - 匹配模式
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

[util.checkStringArgument(src, pattern)](#util-checkstringargument-src-pattern) 的兼容别名.

## [m] assureStringStartsWith

### util.assureStringStartsWith(s, start)

- **s** { [string](dataTypes#string) } - 原字符串
- **start** { [string](dataTypes#string) } - 目标前缀
- <ins>**returns**</ins> { [string](dataTypes#string) } - 已包含目标前缀的字符串

若 `s` 不以 `start` 开头, 则在开头补充 `start`.

## [m] assureStringEndsWith

### util.assureStringEndsWith(s, end)

- **s** { [string](dataTypes#string) } - 原字符串
- **end** { [string](dataTypes#string) } - 目标后缀
- <ins>**returns**</ins> { [string](dataTypes#string) } - 已包含目标后缀的字符串

若 `s` 不以 `end` 结尾, 则在结尾补充 `end`.

## [m] assureStringSurroundsWith

### util.assureStringSurroundsWith(s, start, end?)

- **s** { [string](dataTypes#string) } - 原字符串
- **start** { [string](dataTypes#string) } - 目标前缀
- **[ end = `start` ]** { [string](dataTypes#string) } - 目标后缀
- <ins>**returns**</ins> { [string](dataTypes#string) } - 已包含目标前缀和后缀的字符串

依次确保字符串具有指定前缀和后缀. 省略 `end` 时, 前缀和后缀使用同一个字符串.

## [m] ensureType

### util.ensureType(o, type)

- **o** { [any](dataTypes#any) } - 待检查的值
- **type** { [string](dataTypes#string) } - 预期的 JavaScript 类型名称
- <ins>**returns**</ins> { [void](dataTypes#void) }

当 `typeof o` 与 `type` 不匹配时抛出异常. 类型名称忽略大小写, 支持 `object`, `string`, `undefined`, `symbol`, `bigint`, `number`, `function` 和 `boolean`.

## [m] ensureStringType

### util.ensureStringType(...values)

- **...values** { ...([any](dataTypes#any))[] } - 待检查的值
- <ins>**returns**</ins> { [void](dataTypes#void) }

依次要求所有值的 JavaScript 类型为 `string`.

## [m] ensureNumberType

### util.ensureNumberType(...values)

- **...values** { ...([any](dataTypes#any))[] } - 待检查的值
- <ins>**returns**</ins> { [void](dataTypes#void) }

依次要求所有值的 JavaScript 类型为 `number`.

## [m] ensureUndefinedType

### util.ensureUndefinedType(...values)

- **...values** { ...([any](dataTypes#any))[] } - 待检查的值
- <ins>**returns**</ins> { [void](dataTypes#void) }

依次要求所有值的 JavaScript 类型为 `undefined`.

## [m] ensureBooleanType

### util.ensureBooleanType(...values)

- **...values** { ...([any](dataTypes#any))[] } - 待检查的值
- <ins>**returns**</ins> { [void](dataTypes#void) }

依次要求所有值的 JavaScript 类型为 `boolean`.

## [m] ensureSymbolType

### util.ensureSymbolType(...values)

- **...values** { ...([any](dataTypes#any))[] } - 待检查的值
- <ins>**returns**</ins> { [void](dataTypes#void) }

依次要求所有值的 JavaScript 类型为 `symbol`.

## [m] ensureBigIntType

### util.ensureBigIntType(...values)

- **...values** { ...([any](dataTypes#any))[] } - 待检查的值
- <ins>**returns**</ins> { [void](dataTypes#void) }

依次要求所有值的 JavaScript 类型为 `bigint`.

`util.ensureBigintType(...values)` 是此方法的兼容别名.

### util.ensureBigintType(...values)

**`6.8.0`**

- **...values** { ...([any](dataTypes#any))[] } - 待检查的值
- <ins>**returns**</ins> { [void](dataTypes#void) }

[util.ensureBigIntType(...values)](#util-ensurebiginttype-values) 的兼容拼写别名.

## [m] ensureObjectType

### util.ensureObjectType(...values)

- **...values** { ...([any](dataTypes#any))[] } - 待检查的值
- <ins>**returns**</ins> { [void](dataTypes#void) }

依次要求所有值的 JavaScript 类型为 `object`. JavaScript 中 `typeof null` 的结果也是 `object`, 因此此方法接受 `null`.

## [m] ensureFunctionType

### util.ensureFunctionType(...values)

- **...values** { ...([any](dataTypes#any))[] } - 待检查的值
- <ins>**returns**</ins> { [void](dataTypes#void) }

依次要求所有值的 JavaScript 类型为 `function`.

## [m] ensureNonNullObjectType

### util.ensureNonNullObjectType(...values)

- **...values** { ...([any](dataTypes#any))[] } - 待检查的值
- <ins>**returns**</ins> { [void](dataTypes#void) }

依次要求所有值为非 `null` 且 JavaScript 类型为 `object`.

## [m] ensureArrayType

### util.ensureArrayType(...values)

- **...values** { ...([any](dataTypes#any))[] } - 待检查的值
- <ins>**returns**</ins> { [void](dataTypes#void) }

依次要求所有值为 JavaScript 数组.

## [m] toRegular

### util.toRegular(f)

- **f** { [Function](dataTypes#function) } - 待规范化的函数
- <ins>**returns**</ins> { [Function](dataTypes#function) } - 普通函数

带有对象原型的普通函数会原样返回. 对于箭头函数等没有对象原型的可调用值, 方法返回一个普通函数包装器.

## [m] toRegularAndCall

### util.toRegularAndCall(...args)

**`ABANDONED`**

- **...args** { ...([any](dataTypes#any))[] } - 未使用
- <ins>**returns**</ins> { [never](dataTypes#never) }

此入口已失效, 调用时始终抛出 `ObsoletedRhinoFunctionException`.

## [m] toRegularAndApply

### util.toRegularAndApply(...args)

**`ABANDONED`**

- **...args** { ...([any](dataTypes#any))[] } - 未使用
- <ins>**returns**</ins> { [never](dataTypes#never) }

此入口已失效, 调用时始终抛出 `ObsoletedRhinoFunctionException`.

## [m] dpToPx

### util.dpToPx(dp)

- **dp** { [number](dataTypes#number) } - 密度无关像素值
- <ins>**returns**</ins> { [number](dataTypes#number) } - 像素值

## [m] spToPx

### util.spToPx(sp)

- **sp** { [number](dataTypes#number) } - 可缩放像素值
- <ins>**returns**</ins> { [number](dataTypes#number) } - 像素值

## [m] pxToDp

### util.pxToDp(px)

- **px** { [number](dataTypes#number) } - 像素值
- <ins>**returns**</ins> { [number](dataTypes#number) } - 密度无关像素值

## [m] pxToSp

### util.pxToSp(px)

- **px** { [number](dataTypes#number) } - 像素值
- <ins>**returns**</ins> { [number](dataTypes#number) } - 可缩放像素值

## [m] \_\_assignFunctions\_\_

### util.\_\_assignFunctions\_\_(src, target, funcNames)

**`READONLY`**

- **src** { [Object](dataTypes#object) } - 函数来源对象
- **target** { [Object](dataTypes#object) } - 目标对象
- **funcNames** { [string](dataTypes#string)[[]](dataTypes#array) } - 待复制的函数名
- <ins>**returns**</ins> { [void](dataTypes#void) }

将 `src` 中的指定函数绑定到 `src`, 并写入 `target` 的同名属性. 来源对象, 目标对象和函数名数组必须是 Rhino 原生脚本对象.

此方法的实际属性名为 `util.__assignFunctions__`, 主要供 AutoJs6 内部模块初始化使用.

## [p+] java

- { [Object](dataTypes#object) }

Java 互操作工具对象.

### [m] instanceof

#### util.java.instanceof(obj, clazz)

**`[6.8.0]`**

- **obj** { [any](dataTypes#any) } - 待检查的非空对象
- **clazz** { java.lang.Class | [string](dataTypes#string) } - Java 类, Rhino Java 类包装或完整类名
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 对象是否可赋值给指定 Java 类

方法会先解包 Rhino 包装对象. `clazz` 为 `null` 时返回 `false`, `obj` 为 `null` 时抛出异常.

`util.java.instanceOf(obj, clazz)` 是此方法的别名.

```js
let list = new java.util.ArrayList();
util.java.instanceOf(list, java.util.List); // true
util.java.instanceof(list, "java.util.ArrayList"); // true
```

#### util.java.instanceOf(obj, clazz)

**`6.8.0`**

- **obj** { [any](dataTypes#any) } - 待检查的非空对象
- **clazz** { java.lang.Class | [string](dataTypes#string) } - Java 类, Rhino Java 类包装或完整类名
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 对象是否可赋值给指定 Java 类

[util.java.instanceof(obj, clazz)](#util-java-instanceof-obj-clazz) 的兼容大小写别名.

### [m] array

#### util.java.array(componentType, ...dimensions)

- **componentType** { java.lang.Class | [string](dataTypes#string) } - 数组元素类型
- **...dimensions** { ...([number](dataTypes#number))[] } - 一个或多个维度长度
- <ins>**returns**</ins> { [JavaArray](dataTypes#javaarray) } - 新建的 Java 数组

`componentType` 支持 Java 类, Rhino Java 类包装, 完整类名, 以及 `string`, `int`, `long`, `double`, `char`, `byte`, `float`, `short` 和 `boolean`.

至少需要一个维度. 可指定任意数量的维度.

```js
let bytes = util.java.array("byte", 16);
let matrix = util.java.array("int", 3, 4);
```

### [m] toJsArray

#### util.java.toJsArray(list, nullListToEmptyArray?)

- **list** { java.lang.Iterable | [null](dataTypes#null) } - Java 可迭代对象
- **[ nullListToEmptyArray = false ]** { [boolean](dataTypes#boolean) } - 是否把 `null` 转换为空数组
- <ins>**returns**</ins> { [any](dataTypes#any)[[]](dataTypes#array) | [null](dataTypes#null) } - JavaScript 数组或 `null`

将 Java `Iterable` 的元素依次复制到 JavaScript 数组. `list` 为 `null` 时, 默认返回 `null`.

### [m] objectToMap

#### util.java.objectToMap(o)

- **o** { [Object](dataTypes#object) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - JavaScript 原生对象
- <ins>**returns**</ins> { java.util.HashMap | [null](dataTypes#null) } - Java 映射或 `null`

复制对象的自有属性. 属性名转换为字符串, 属性值保持原值. `null` 或 `undefined` 返回 `null`.

### [m] mapToObject

#### util.java.mapToObject(map)

- **map** { java.util.Map | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - Java 映射
- <ins>**returns**</ins> { [Object](dataTypes#object) | [null](dataTypes#null) } - JavaScript 原生对象或 `null`

复制映射条目并将键转换为字符串. `null` 或 `undefined` 返回 `null`.

## [p+] version

- { [Object](dataTypes#object) }

当前 Android 版本工具对象.

### [p] sdkInt

- { [number](dataTypes#number) }

当前设备的 Android API 级别, 对应 `android.os.Build.VERSION.SDK_INT`.

## [p+] versionCodes

- { [Object](dataTypes#object) }

Android 版本代码信息与查询工具对象.

### [p] VERSION_CODE

**`CONSTANT`**

- { [AndroidVersionInfo](#androidversioninfo) }

每个版本代码属性均返回只读的 Android 版本信息对象. 当前公开属性如下:

```text
CINNAMON_BUN
BAKLAVA
VANILLA_ICE_CREAM
UPSIDE_DOWN_CAKE
TIRAMISU
S_V2
S
R
Q
P
O_MR1
O
N_MR1
N
M
LOLLIPOP_MR1
LOLLIPOP
KITKAT_WATCH
KITKAT
JELLY_BEAN_MR2
JELLY_BEAN_MR1
JELLY_BEAN
ICE_CREAM_SANDWICH_MR1
ICE_CREAM_SANDWICH
HONEYCOMB_MR2
HONEYCOMB_MR1
HONEYCOMB
GINGERBREAD_MR1
GINGERBREAD
FROYO
ECLAIR_MR1
ECLAIR_0_1
ECLAIR
DONUT
CUPCAKE
BASE_1_1
BASE
```

例如, `util.versionCodes.TIRAMISU.apiLevel` 为 `33`.

### [m] search

#### util.versionCodes.search(query)

- **query** { [string](dataTypes#string) | [number](dataTypes#number) | [Date](dataTypes#date) | [null](dataTypes#null) } - 查询值
- <ins>**returns**</ins> { [AndroidVersionInfo](#androidversioninfo) | [null](dataTypes#null) } - 首个匹配项或 `null`

查询可匹配 API 级别, 版本代码, 完整发布名称, 发布名称中的单词, 完整内部代号, 内部代号中的单词, 发布时间戳, 完整发布日期, 完整平台版本, 或平台版本开头的数字部分.

匹配区分大小写. `null` 返回 `null`, 其他不支持的类型会抛出异常.

### [m] searchAll

#### util.versionCodes.searchAll(query)

- **query** { [string](dataTypes#string) | [number](dataTypes#number) | [Date](dataTypes#date) | [null](dataTypes#null) } - 查询值
- <ins>**returns**</ins> { [AndroidVersionInfo](#androidversioninfo)[[]](dataTypes#array) } - 全部匹配项

匹配规则与 [util.versionCodes.search(query)](#util-versioncodes-search-query) 相同. 结果去重后按 API 级别降序排列. `null` 返回空数组.

### [m] summary

#### util.versionCodes.summary(isInDetail?)

- **[ isInDetail = false ]** { [boolean](dataTypes#boolean) } - 是否输出详细字段
- <ins>**returns**</ins> { [string](dataTypes#string) } - 每个版本占一行的摘要

简略模式的行格式为 `VERSION_CODE: apiLevel / releaseName / platformVersion`.

详细模式依次输出 `versionCode`, `apiLevel`, `releaseName`, `platformVersion`, `internalCodename`, `releaseDate` 和 `releaseTimestamp`, 字段以 `, ` 分隔.

### [m] toString

#### util.versionCodes.toString(isInDetail?)

- **[ isInDetail = false ]** { [boolean](dataTypes#boolean) } - 是否输出详细字段
- <ins>**returns**</ins> { [string](dataTypes#string) } - 版本摘要

与 [util.versionCodes.summary(isInDetail?)](#util-versioncodes-summary-isindetail) 等价.

## AndroidVersionInfo

Android 版本信息对象.

### [p] versionCode

**`READONLY`**

- { [string](dataTypes#string) } - Android 版本代码名称

### [p] apiLevel

**`READONLY`**

- { [number](dataTypes#number) } - Android API 级别

### [p] releaseName

**`READONLY`**

- { [string](dataTypes#string) } - Android 发布名称

### [p] platformVersion

**`READONLY`**

- { [string](dataTypes#string) } - Android 平台版本范围

### [p] internalCodename

**`READONLY`**

- { [string](dataTypes#string) } - Android 内部甜点代号

### [p] releaseDate

**`READONLY`**

- { [string](dataTypes#string) } - 英文发布日期

### [p] releaseTimestamp

**`READONLY`**

- { [number](dataTypes#number) } - 本地时区零时对应的发布日期时间戳

### [m#] valueOf

#### AndroidVersionInfo#valueOf()

- <ins>**returns**</ins> { [number](dataTypes#number) } - Android API 级别

## [m+] inspect

### util.inspect(value, options?)

- **value** { [any](dataTypes#any) } - 待格式化的值
- **[ options = `{}` ]** {{
    - showHidden: [boolean](dataTypes#boolean);
    - depth: [number](dataTypes#number);
    - colors: [boolean](dataTypes#boolean);
    - maxArrayItems: [number](dataTypes#number);
    - maxObjectKeys: [number](dataTypes#number);
    - maxStringLength: [number](dataTypes#number);
    - customInspect: [boolean](dataTypes#boolean);
- }} - 格式化选项
- <ins>**returns**</ins> { [string](dataTypes#string) } - 可读字符串

默认选项如下:

- `showHidden`: `false`. 是否包含不可枚举属性.
- `depth`: `2`. 对象递归深度.
- `colors`: `false`. 是否使用 ANSI SGR 颜色代码.
- `maxArrayItems`: `10000`. 数组最多输出的元素数.
- `maxObjectKeys`: `10000`. 对象最多输出的属性数.
- `maxStringLength`: `100000`. 字符串最多输出的字符数.
- `customInspect`: `false`. 是否调用对象自身的 `inspect(recurseTimes, context)` 方法.

`maxArrayItems`, `maxObjectKeys` 或 `maxStringLength` 不大于 `0` 时, 对应限制不生效.

```js
let text = util.inspect({
    name: "AutoJs6",
    nested: { enabled: true },
}, {
    depth: 1,
});

console.log(text);
```

### [p] colors

**`Getter`**

- { [Object](dataTypes#object) }

ANSI SGR 样式名称到 `[startCode, endCode]` 的只读映射. 包含 `bold`, `italic`, `underline`, `inverse`, `white`, `gray`, `grey`, `black`, `blue`, `cyan`, `green`, `magenta`, `red` 和 `yellow`.

通过 `util.inspect.colors` 访问此映射.

### [p] styles

**`Getter`**

- { [Object](dataTypes#object) }

值类型到颜色名称的只读映射. 包含 `regexp`, `date`, `special`, `number`, `boolean`, `string`, `undefined` 和 `null`.

通过 `util.inspect.styles` 访问此映射.

## [m+] morseCode

### util.morseCode(source, timeSpan?)

- **source** { [any](dataTypes#any) } - 待编码内容
- **[ timeSpan = 100 ]** { [number](dataTypes#number) } - 一个信号单位的时长 (毫秒)
- <ins>**returns**</ins> { [MorseCodeResult](#morsecoderesult) } - 摩尔斯电码结果对象

`source` 会转换为字符串, 英文字母不区分大小写. `timeSpan` 会四舍五入为整数, 且最小为 `100`.

支持英文字母 `A-Z`, 数字 `0-9`, 以及以下 ASCII 标点:

```text
. : , ; ? = ' / ! - _ " ( ) $ & @ +
```

出现不支持的字符时抛出异常.

### [m] getPattern

#### util.morseCode.getPattern(source, timeSpan?)

- **source** { [any](dataTypes#any) } - 待编码内容
- **[ timeSpan = 100 ]** { [number](dataTypes#number) } - 一个信号单位的时长 (毫秒)
- <ins>**returns**</ins> { [number](dataTypes#number)[[]](dataTypes#array) } - 交替的振动与停顿时长

点占 `1` 个单位, 划占 `3` 个单位, 同一字符内的间隔占 `1` 个单位, 字符间隔占 `3` 个单位, 单词间隔占 `7` 个单位.

### [m] getCode

#### util.morseCode.getCode(source, timeSpan?)

- **source** { [any](dataTypes#any) } - 待编码内容
- **[ timeSpan = 100 ]** { [number](dataTypes#number) } - 一个信号单位的时长 (毫秒)
- <ins>**returns**</ins> { [string](dataTypes#string) } - 摩尔斯电码文本

点使用 Unicode 字符 `U+00B7`, 划使用 ASCII `-`. `timeSpan` 不影响返回文本.

### [m] vibrate

#### util.morseCode.vibrate(source, delay?)

- **source** { [any](dataTypes#any) } - 待编码内容
- **[ delay = 0 ]** { [number](dataTypes#number) } - 开始振动前的延迟 (毫秒)
- <ins>**returns**</ins> { [void](dataTypes#void) }

使用默认 `100` 毫秒信号单位生成振动模式并执行振动. `delay` 小于 `0` 或为 `NaN` 时按 `0` 处理.

## MorseCodeResult

由 [util.morseCode(source, timeSpan?)](#util-morsecode-source-timespan) 返回的结果对象.

### [p#] pattern

**`Getter`**

- { [number](dataTypes#number)[[]](dataTypes#array) } - 交替的振动与停顿时长

### [p#] code

**`Getter`**

- { [string](dataTypes#string) } - 摩尔斯电码文本

### [m#] getPattern

#### MorseCodeResult#getPattern()

- <ins>**returns**</ins> { [number](dataTypes#number)[[]](dataTypes#array) } - `pattern` 的当前副本

### [m#] getCode

#### MorseCodeResult#getCode()

- <ins>**returns**</ins> { [string](dataTypes#string) } - `code`

### [m#] toString

#### MorseCodeResult#toString()

- <ins>**returns**</ins> { [string](dataTypes#string) } - 同时包含 `code` 与 `pattern` 的可读字符串

### [m#] vibrate

#### MorseCodeResult#vibrate(delay?)

- **[ delay = 0 ]** { [number](dataTypes#number) } - 开始振动前的延迟 (毫秒)
- <ins>**returns**</ins> { [void](dataTypes#void) }

使用结果对象中已生成的振动模式执行振动.
