# 全局对象 (Global)

在 JavaScript 中, [几乎一切都是对象](https://stackoverflow.com/questions/9108925/how-is-almost-everything-in-javascript-an-object/).<br>
此处的全局 "对象" 包括 [ 变量 / 方法 / 构造器 ] 等.<br>
全局对象随处可用, 包括 ECMA 标准内置对象 (如 [ Number / RegExp / String ] 等).

AutoJs6 的内置模块均支持全局使用, 如 `app`, `images`, `device` 等.

为便于使用, 一些 AutoJs6 模块中的方法也被全局化,<br>
如 `images.captureScreen()`, `dialogs.alert()`, `app.launch()` 等.<br>
全局化方法均以 `Global` 标签标注.

脚本文件可直接运行使用, 也可作为模块被导入使用 (`require` 方法).<br>
当作为模块使用时, `exports` 和 `module` 可作为全局对象使用.<br>
另在 UI 模式下也有一些专属全局对象, 如 `activity`.

## 覆写保护

AutoJs6 对部分全局对象及内置模块增加了覆写保护.<br>
以下全局声明或赋值将导致异常或非预期结果:

```js
/* 以全局对象 selector 为例. */

/* 声明无效. */
let selector = 1; /* 异常: 变量 selector 重复声明. */
const selector = 1; /* 同上. */
var selector = 1; /* 同上. */

/* 覆写无效 (非严格模式). */
selector = 1;
typeof selector; // "function" - 静默失败, 覆写未生效.

/* 覆写无效 (严格模式). */
"use strict";
selector = 1; /* 异常: 无法修改只读属性: selector. */
```

局部作用域不受上述情况影响:

```js
(function () {
    let selector = 1;
    return typeof selector;
})(); // "number"
```

截至目前 (2022/10) 受覆写保护的对象有:

```text
selector
continuation
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">global</p>

---

## [@] global

global 为 AutoJs6 的默认顶级作用域对象, 可作为全局对象使用:

```js
typeof global; // "object"
typeof global.sleep; // "function"
```

另, 访问顶级作用域对象也可通过以下代码:

```js
runtime.topLevelScope;
```

`runtime.topLevelScope` 本身有 `global` 属性, 因此全局对象 `global` 也一样拥有:

```js
typeof runtime.topLevelScope.global; // "object"

global.global === global; // true
global.global.global.global === global; // true
```

global 对象可以增加属性, 也可以覆写甚至删除属性 (部分被保护):

```js
global.hello = "hello";
delete global.hello;
```

global 对象本身是可被覆写的:

```js
typeof global; // "object"
global = 3;
typeof global; // "number"
```

如果 global 对象被意外重写 (虽然概率很低),<br>
可通过 `runtime.topLevelScope` 访问或还原:

```js
global = 3; /* 覆写 global 对象. */
typeof global; // "number"
typeof global.sleep; // "undefined"
typeof runtime.topLevelScope.sleep; // "function"

global = runtime.topLevelScope; /* 还原 global 对象. */
typeof global; // "object"
typeof global.sleep; // "function"
```

## [p] isAutoJs6

**`Global`**

- [ `true` ] { [boolean](dataTypes#boolean) }

用于识别当前脚本运行环境是否为 AutoJs6.

## [p+] axios

**`Global`** **`Getter`**

- { [Function](dataTypes#function) | [Object](dataTypes#object) }

返回运行时内置的 Axios 模块对象.

## [p+] cheerio

**`Global`** **`Getter`**

- { [Function](dataTypes#function) | [Object](dataTypes#object) }

返回运行时内置的 Cheerio 模块对象.

## [p+] dayjs

**`Global`** **`Getter`**

- { [Function](dataTypes#function) | [Object](dataTypes#object) }

返回运行时内置的 Day.js 模块对象.

## [p+] i18n

**`Global`** **`Getter`**

- { [Object](dataTypes#object) }

返回运行时内置的国际化模块对象.

## [p+] pangu

**`Global`** **`Getter`** **`6.8.0`**

- { [Object](dataTypes#object) }

返回内置的 [文本间距](pangu) 模块对象. 首次访问时加载, 同一脚本运行时内复用此对象.

## [m] toString

### global.toString()

**`Global`**

- <ins>**returns**</ins> { [string](dataTypes#string) }

返回固定字符串 `[object global]`.

## [m] TODO

### TODO(reason?)

**`Global`**

- **[ reason ]** { [string](dataTypes#string) } - 未实现原因
- <ins>**returns**</ins> { [never](dataTypes#never) }

始终抛出 `NotImplementedError`. `reason` 为空或省略时使用 AutoJs6 内置的未实现提示.

```js
function featureUnderDevelopment() {
    TODO("This feature has not been implemented");
}
```

## [m] err

### err(...args)

**`Global`**

- **...args** { [...](documentation#可变参数)[any](dataTypes#any)[[]](documentation#可变参数) } - 控制台格式化参数
- <ins>**returns**</ins> { [void](dataTypes#void) }

[console.error](console#m-error) 的全局别名.

## [m] openConsole

### openConsole(isReset?)

**`Global`**

- **[ isReset = `false` ]** { [boolean](dataTypes#boolean) } - 显示前是否清除窗口状态并重置控制台
- <ins>**returns**</ins> { [Console](console) }

[console.show](console#m-show) 的全局别名, 用于显示控制台浮动窗口.

## [m] showConsole

### showConsole(isReset?)

**`Global`**

- **[ isReset = `false` ]** { [boolean](dataTypes#boolean) } - 显示前是否清除窗口状态并重置控制台
- <ins>**returns**</ins> { [Console](console) }

[console.show](console#m-show) 的全局别名. 与 [openConsole](#m-openconsole) 等效.

## [m] clearConsole

### clearConsole()

**`Global`**

- <ins>**returns**</ins> { [Console](console) }

[console.clear](console#m-clear) 的全局别名, 用于清空控制台日志内容.

## [m] launchConsole

### launchConsole()

**`6.1.0`** **`Global`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

[console.launch](console#m-launch) 的全局别名, 用于启动控制台 Activity.

## [m] isUiThread

### isUiThread()

**`Global`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前线程是否为 Android UI 线程

## [m] isInteger

### isInteger(o)

**`Global`**

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否为整数

## [m] isPrimitive

### isPrimitive(o)

**`Global`**

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否不是引用类型

此方法是 [isReference(o)](#isreference-o) 的逻辑取反.

## [m] isReference

### isReference(o)

**`Global`**

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否为非空 JavaScript 对象或函数

## [m] isEmptyObject

### isEmptyObject(o)

**`Global`**

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否为不含自有属性的 JavaScript 对象

## [m] unwrapJavaObject

### unwrapJavaObject(o)

**`Global`**

- **o** { [any](dataTypes#any) } - 待解包的值
- <ins>**returns**</ins> { [any](dataTypes#any) } - 解包或规范化后的值

递归解包 Rhino `Wrapper` 对象. 字符串, 数字和布尔值会规范化为对应的 JavaScript 值, Kotlin `Unit` 会转换为 `undefined`.

## [m] isNullish

### isNullish(o?)

**`[6.8.0]`** **`Global`**

- **[ o ]** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否为 `null` 或 `undefined`

省略参数时返回 `true`. 多余参数会被忽略.

## [m] isObjectSpecies

### isObjectSpecies(o)

**`Global`**

- **o** { [any](dataTypes#any) } - 待判断的值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否为非空 JavaScript 对象

此兼容方法按 JavaScript 的 `typeof` 结果判断对象, 并排除 `null` 和函数. 它与 [species.isObject(o)](#isobject-o) 的严格种类判断不同, 数组和日期等对象也会返回 `true`.

## [m] sleep

### sleep(millis)

**`Global`** **`Overload 1/3`** **`Non-UI`**

- **millis** { [number](dataTypes#number) } - 休眠时间 (毫秒)
- <ins>**returns**</ins> { [void](dataTypes#void) }

使当前线程休眠一段时间.

```js
/* 休眠 9 秒钟. */
sleep(9000);
/* 休眠 9 秒钟 (使用科学计数法). */
sleep(9e3);
```

### sleep(millisMin, millisMax)

**`6.2.0`** **`Global`** **`Overload 2/3`** **`Non-UI`**

- **millisMin** { [number](dataTypes#number) } - 休眠时间下限 (毫秒)
- **millisMax** { [number](dataTypes#number) } - 休眠时间上限 (毫秒)
- <ins>**returns**</ins> { [void](dataTypes#void) }

使当前线程休眠一段时间, 该时间随机落在 millisMin 和 millisMax 之间.

```js
/* 随机休眠 3 - 5 秒钟. */
sleep(3e3, 5e3);
```

### sleep(millis, bounds)

**`6.2.0`** **`Global`** **`Overload 3/3`** **`Non-UI`**

- **millis** { [number](dataTypes#number) } - 休眠时间 (毫秒)
- **bounds** { [NumberString](dataTypes#NumberString) | [string](dataTypes#string) } - 浮动值
- <ins>**returns**</ins> { [void](dataTypes#void) }

使当前线程休眠一段时间, 该时间随机落在 millis ± bounds 之间.<br>
bounds 参数为 [数字字符串](dataTypes#NumberString) 类型 (如 "12"), 或在字符串开头附加 "±" 明确参数含义 (如 "±12").

```js
/* 随机休眠 3 - 5 秒钟 (即 4 ± 1 秒钟). */
sleep(4e3, "1e3");
sleep(4e3, "±1e3"); /* 同上. */
```

## [m+] toast

toast 模块的全局化对象, 参阅 [消息浮动框 (Toast)](toast) 模块章节.

## [m] toastVerbose

### toastVerbose(text, isLong?, isForcible?)

**`Global`**

- **text** { [any](dataTypes#any) } - 消息内容
- **[ isLong = false ]** { `'long'` | `'l'` | `'short'` | `'s'` | [boolean](dataTypes#boolean) | [number](dataTypes#number) } - 是否以较长时间显示
- **[ isForcible = false ]** { `'forcible'` | `'f'` | [boolean](dataTypes#boolean) | [number](dataTypes#number) } - 是否强制覆盖显示
- <ins>**returns**</ins> { [void](dataTypes#void) }

显示消息浮动框, 并将 `text` 传给 `console.verbose`. `toastverbose` 是此方法的全小写别名.

## [m] toastLog

### toastLog(text?, isLong?, isForcible?)

**`Global`**

- **[ text ]** { [any](dataTypes#any) } - 消息内容
- **[ isLong = false ]** { `'long'` | `'l'` | `'short'` | `'s'` | [boolean](dataTypes#boolean) | [number](dataTypes#number) } - 是否以较长时间显示
- **[ isForcible = false ]** { `'forcible'` | `'f'` | [boolean](dataTypes#boolean) | [number](dataTypes#number) } - 是否强制覆盖显示
- <ins>**returns**</ins> { [void](dataTypes#void) }

显示消息浮动框, 并将 `text` 传给 `console.log`. 省略全部参数时显示字符串 `undefined`, 同时执行无参数的 `console.log()`.

`toastlog` 是此方法的全小写别名.

虽然消息浮动框由异步队列显示, 但控制台输出同步执行.

## [m] toastInfo

### toastInfo(text, isLong?, isForcible?)

**`Global`**

- **text** { [any](dataTypes#any) } - 消息内容
- **[ isLong = false ]** { `'long'` | `'l'` | `'short'` | `'s'` | [boolean](dataTypes#boolean) | [number](dataTypes#number) } - 是否以较长时间显示
- **[ isForcible = false ]** { `'forcible'` | `'f'` | [boolean](dataTypes#boolean) | [number](dataTypes#number) } - 是否强制覆盖显示
- <ins>**returns**</ins> { [void](dataTypes#void) }

显示消息浮动框, 并将 `text` 传给 `console.info`. `toastinfo` 是此方法的全小写别名.

## [m] toastWarn

### toastWarn(text, isLong?, isForcible?)

**`Global`**

- **text** { [any](dataTypes#any) } - 消息内容
- **[ isLong = false ]** { `'long'` | `'l'` | `'short'` | `'s'` | [boolean](dataTypes#boolean) | [number](dataTypes#number) } - 是否以较长时间显示
- **[ isForcible = false ]** { `'forcible'` | `'f'` | [boolean](dataTypes#boolean) | [number](dataTypes#number) } - 是否强制覆盖显示
- <ins>**returns**</ins> { [void](dataTypes#void) }

显示消息浮动框, 并将 `text` 传给 `console.warn`. `toastwarn` 是此方法的全小写别名.

## [m] toastError

### toastError(text, isLong?, isForcible?)

**`Global`**

- **text** { [any](dataTypes#any) } - 消息内容
- **[ isLong = false ]** { `'long'` | `'l'` | `'short'` | `'s'` | [boolean](dataTypes#boolean) | [number](dataTypes#number) } - 是否以较长时间显示
- **[ isForcible = false ]** { `'forcible'` | `'f'` | [boolean](dataTypes#boolean) | [number](dataTypes#number) } - 是否强制覆盖显示
- <ins>**returns**</ins> { [void](dataTypes#void) }

显示消息浮动框, 并将 `text` 传给 `console.error`. `toasterror` 是此方法的全小写别名.

## [m+] notice

notice 模块的全局化对象, 参阅 [消息通知 (Notice)](notice) 模块章节.

## [m] random

### random()

**`Global`** **`Overload 1/3`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

与 Math.random() 相同, 返回落在 [0, 1) 区间的随机数字.

### random(value)

**`Global`** **`Overload 2/3`**

- **value** { [any](dataTypes#any) } - 未使用
- <ins>**returns**</ins> { [number](dataTypes#number) } - `NaN`

单参数调用固定返回 `NaN`. 如需生成指定范围内的随机整数, 必须同时提供下限和上限.

### random(min, max)

**`Global`** **`Overload 3/3`**

- **min** { [number](dataTypes#number) } - 随机数下限
- **max** { [number](dataTypes#number) } - 随机数上限
- <ins>**returns**</ins> { [number](dataTypes#number) }

返回落在 [min, max] 区间的随机数字.

> 注: random(min, max) 右边界闭合, 而 random() 右边界开放.

## [m] wait

### wait(condition)

**`6.2.0`** **`Global`** **`Overload 1/6`** **`A11Y?`** **`Non-UI`**

- **condition** { [(() => any)](dataTypes#function) | [PickupSelector](dataTypes#pickupselector) } - 结束等待条件
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

阻塞等待, 直到条件满足.<br>
默认等待时间为 10 秒, 条件检查间隔为 200 毫秒.<br>
若超时, 放弃等待, 并返回特定的条件超时结果 (如 false).<br>
若超时之前条件得以满足, 结束等待, 并返回特定的条件满足结果 (如 true).

> 注: `wait` 会阻塞当前线程. 6.8.0 起提供不阻塞的异步形式 [waitAsync](#m-waitasync) (即 `wait.async`), 它立即返回一个可继续追加动作与回调的 [Flow](flowType) 对象, 详见 [流程 (Flow)](flow) 章节.

> 注: 不同于 while 和 for 等循环语句的 "条件",<br>
> 该方法的条件是结束等待条件, 只要不满足条件, 就一直等待.<br>
> 而循环语句的条件, 是只要满足条件, 就一直循环.

等待条件支持函数及选择器.

函数示例, 等待设备屏幕关闭:

```js
wait(function () {
    return device.isScreenOff();
});

/* 使用箭头函数. */
wait(() => device.isScreenOff());

/* 使用 bind. */
wait(device.isScreenOff.bind(device));

/* 对结果分支处理. */
if (wait(() => device.isScreenOff())) {
    console.log("等待屏幕关闭成功");
} else {
    console.log("等待屏幕关闭超时");
}
```

选择器示例, 等待文本为 "立即开始" 的控件出现:

```js
/* 以下三种方式为 Pickup 选择器的不同格式, 效果相同. */
wait('立即开始');
wait(content('立即开始')); /* 同上. */
wait({ content: '立即开始' }); /* 同上. */

/* 函数方式. */
wait(() => content('立即开始').exists());
wait(() => pickup('立即开始', '?')); /* 同上. */

/* wait 返回结果的简单应用. */
wait('立即开始') && toast('OK');
wait('立即开始') ? toast('√') : toast('×');
```

等待条件的满足与否, 与函数返回值有关.<br>
例如当函数返回 true 时, 等待条件即满足.

下面列出不满足条件的几种返回值:<br>
[ [false](dataTypes#boolean) / [null](dataTypes#null) / [undefined](dataTypes#undefined) / [NaN](https://developer.mozilla.org/zh-CN/docs/Glossary/NaN/) ]<br>
除此之外的返回值均视为满足条件 (包括空字符串和数字 0 等).

一种常见的错误用例, 即函数条件缺少返回值:

```js
wait(() => {
    if (device.isScreenOff()) {
        console.log("屏幕已成功关闭");
    }
});
```

上述示例中, 等待条件永远无法满足, 因函数一直返回 undefined.

添加合适的返回值即可修正:

```js
wait(() => {
    if (device.isScreenOff()) {
        console.log("屏幕已成功关闭");
        return true;
    }
});
```

> 参阅: [pickup](uiSelectorType#m-pickup)

### wait(condition, limit)

**`6.2.0`** **`Global`** **`Overload 2/6`** **`A11Y?`** **`Non-UI`**

- **condition** { [(() => any)](dataTypes#function) | [PickupSelector](uiSelectorType#m-pickup) } - 结束等待条件
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

[wait(condition)](#wait-condition) 增加条件检测限制.<br>
达到限制后, 表示等待超时, 并放弃等待.<br>
限制分为 "次数限制" (limit < 100) 和 "时间限制" (limit >= 100).

```js
/* 等待屏幕关闭, 最多检测屏幕状态 20 次. */
wait(() => device.isScreenOff(), 20); /* limit < 100, 视为次数限制. */
/* 等待屏幕关闭, 最多检测屏幕状态 5 秒钟. */
wait(() => device.isScreenOff(), 5e3); /* limit >= 100, 视为时间限制. */
```

### wait(condition, limit, interval)

**`6.2.0`** **`Global`** **`Overload 3/6`** **`A11Y?`** **`Non-UI`**

- **condition** { [(() => any)](dataTypes#function) | [PickupSelector](uiSelectorType#m-pickup) } - 结束等待条件
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- **interval** { [number](dataTypes#number) } - 等待条件检测间隔
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

[wait(condition, limit)](#wait-condition-limit) 增加条件检测间隔.<br>
只要条件不满足, wait() 方法会持续检测, 直到条件满足或达到检测限制.<br>
interval 参数用于设置条件检测之间的间歇时长, 默认为 200 毫秒.

```text
检查条件 (不满足) - 间歇 - 检查条件 (不满足) - 间歇 - 检查条件...
```

```js
/* 等待屏幕关闭, 最多检测屏幕状态 20 次, 每次检查间歇 3 秒钟. */
wait(() => device.isScreenOff(), 20, 3e3);
/* 等待屏幕关闭, 最多检测屏幕状态 20 次, 并采用不间断检测 (无间歇). */
wait(() => device.isScreenOff(), 20, 0);
```

> 注: 在最后一次条件检查之后, 将不再发生间歇.<br>
> 包括条件满足或达到检测限制.
>
> 例如在第三次检查时, 条件满足:<br>
> 检查 (×) - 间歇 - 检查 (×) - 间歇 - 检查 (√) - 立即结束 wait()

### wait(condition, callback)

**`6.2.0`** **`Global`** **`Overload 4/6`** **`A11Y?`** **`Non-UI`**

- **condition** { [(() => T)](dataTypes#function) | [PickupSelector](uiSelectorType#m-pickup) } - 结束等待条件
- **callback** {{
    - then(result?: [T](dataTypes#generic))?: [R](dataTypes#generic)
    - else(result?: [T](dataTypes#generic))?: [R](dataTypes#generic)
- }} - 等待结束回调对象
- <ins>**returns**</ins> { [R](dataTypes#generic) extends [void](dataTypes#void) ? [boolean](dataTypes#boolean) : [R](dataTypes#generic) }
- <ins>**template**</ins> [T](dataTypes#generic), [R](dataTypes#generic)

[wait(condition)](#wait-condition) 增加回调对象.

回调对象集合了两个方法, then 与 else 分别对应等待成功与等待失败的情况:

```js
wait(() => device.isScreenOff(), {
    then: () => console.log("等待屏幕关闭成功"),
    else: () => console.log("等待屏幕关闭超时"),
});
```

两种方法都将最后一次检查结果作为实参, 可在方法体内直接使用:

```js
/* 等待一个落在 99.99 到 100 区间的随机数. */
wait(() => {
    let num = Math.random() * 100;
    return num > 99.99 && num;
}, {
    then(o) {
        console.log(`获取随机数成功, 数字是: ${o}`);
    },
    else() {
        console.log("获取 99.99 到 100 的随机数超时");
    },
});
```

> 注: else 回调方法的参数只能是 [ [false](dataTypes#boolean) / [null](dataTypes#null) / [undefined](dataTypes#undefined) / [NaN](https://developer.mozilla.org/zh-CN/docs/Glossary/NaN/) ],<br>
> 因此 else 的参数几乎不会用到.

需特别注意, 回调方法的返回值具有穿透性.<br>
在回调方法内使用 return 语句, 将直接影响 wait() 的返回值 (undefined 除外).

上述示例中, then 和 else 回调都没有返回值, 因此 wait() 返回值是 boolean 类型, 表示等待条件是否满足.<br>
下述示例在回调函数中增加了返回值 (非 undefined), 则 wait() 也将返回这个值.

```js
let result = wait(() => {
    let num = Math.random() * 100;
    return num > 99.99 && num;
}, {
    then(o) {
        console.log(`获取随机数成功`);
        return o;
    },
    else() {
        console.log("获取 99.99 到 100 的随机数超时");
        return NaN;
    },
});
result; /* 一个数字 (如 99.99732126036437) 或 NaN. */
```

上述示例如果等待条件满足, 则返回 then 的返回值 (number 类型),<br>
等待条件超时, 则返回 else 的返回值 (NaN, 也为 number 类型).

如果去掉 else 的返回语句, 则等待条件超时后, wait() 将返回 false (boolean 类型).

如需对 wait() 的返回值做进一步处理, 则建议两个回调方法的返回值类型一致:

```js
wait(() => {
    let num = Math.random() * 100;
    return num > 99.99 && num;
}, {
    then(o) {
        return [ o - 1, o, o + 1 ];
    },
    else() {
        /* 即使等待条件超时, 也可调用 forEach 方法. */
        return [];
    },
}).forEach(x => console.log(x));
```

### wait(condition, limit, callback)

**`6.2.0`** **`Global`** **`Overload 5/6`** **`A11Y?`** **`Non-UI`**

- **condition** { [(() => T)](dataTypes#function) | [PickupSelector](uiSelectorType#m-pickup) } - 结束等待条件
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- **callback** {{
    - then(result?: [T](dataTypes#generic))?: [R](dataTypes#generic)
    - else(result?: [T](dataTypes#generic))?: [R](dataTypes#generic)
- }} - 等待结束回调对象
- <ins>**returns**</ins> { [R](dataTypes#generic) extends [void](dataTypes#void) ? [boolean](dataTypes#boolean) : [R](dataTypes#generic) }
- <ins>**template**</ins> [T](dataTypes#generic), [R](dataTypes#generic)

[wait(condition, callback)](#wait-condition-callback) 增加条件检测限制.

> 参阅: [wait(condition, limit)](#wait-condition-limit)

### wait(condition, limit, interval, callback)

**`6.2.0`** **`Global`** **`Overload 6/6`** **`A11Y?`** **`Non-UI`**

- **condition** { [(() => T)](dataTypes#function) | [PickupSelector](uiSelectorType#m-pickup) } - 结束等待条件
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- **interval** { [number](dataTypes#number) } - 等待条件检测间隔
- **callback** {{
    - then(result?: [T](dataTypes#generic))?: [R](dataTypes#generic)
    - else(result?: [T](dataTypes#generic))?: [R](dataTypes#generic)
- }} - 等待结束回调对象
- <ins>**returns**</ins> { [R](dataTypes#generic) extends [void](dataTypes#void) ? [boolean](dataTypes#boolean) : [R](dataTypes#generic) }
- <ins>**template**</ins> [T](dataTypes#generic), [R](dataTypes#generic)

[wait(condition, limit, callback)](#wait-condition-limit-callback) 增加条件检测间隔.

> 参阅: [wait(condition, limit, interval)](#wait-condition-limit-interval)

## [m] waitForActivity

等待指定名称的 Activity 出现 (前置).<br>
此方法相当于 `wait(() => currentActivity() === activityName, ...args)`,<br>
因此其所有重载方法的结构与 wait 一致.<br>
为节约篇幅, 将仅列出方法签名等重要信息.

### waitForActivity(activityName)

**`6.2.0`** **`Global`** **`Overload 1/6`** **`A11Y?`** **`Non-UI`**

- **activityName** { [string](dataTypes#string) } - 目标活动名称
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

> 参阅: [wait(condition)](#wait-condition)

### waitForActivity(activityName, limit)

**`6.2.0`** **`Global`** **`Overload 2/6`** **`A11Y?`** **`Non-UI`**

- **activityName** { [string](dataTypes#string) } - 目标活动名称
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

> 参阅: [wait(condition, limit)](#wait-condition-limit)

### waitForActivity(activityName, limit, interval)

**`6.2.0`** **`Global`** **`Overload 3/6`** **`A11Y?`** **`Non-UI`**

- **activityName** { [string](dataTypes#string) } - 目标活动名称
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- **interval** { [number](dataTypes#number) } - 等待条件检测间隔
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

> 参阅: [wait(condition, limit, interval)](#wait-condition-limit-interval)

### waitForActivity(activityName, callback)

**`6.2.0`** **`Global`** **`Overload 4/6`** **`A11Y?`** **`Non-UI`**

- **activityName** { [string](dataTypes#string) } - 目标活动名称
- **callback** {{
    - then(result?: [T](dataTypes#generic))?: [R](dataTypes#generic)
    - else(result?: [T](dataTypes#generic))?: [R](dataTypes#generic)
- }} - 等待结束回调对象
- <ins>**returns**</ins> { [R](dataTypes#generic) extends [void](dataTypes#void) ? [boolean](dataTypes#boolean) : [R](dataTypes#generic) }
- <ins>**template**</ins> [T](dataTypes#generic), [R](dataTypes#generic)

> 参阅: [wait(condition, callback)](#wait-condition-callback)

### waitForActivity(activityName, limit, callback)

**`6.2.0`** **`Global`** **`Overload 5/6`** **`A11Y?`** **`Non-UI`**

- **activityName** { [string](dataTypes#string) } - 目标活动名称
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- **callback** {{
    - then(result?: [T](dataTypes#generic))?: [R](dataTypes#generic)
    - else(result?: [T](dataTypes#generic))?: [R](dataTypes#generic)
- }} - 等待结束回调对象
- <ins>**returns**</ins> { [R](dataTypes#generic) extends [void](dataTypes#void) ? [boolean](dataTypes#boolean) : [R](dataTypes#generic) }
- <ins>**template**</ins> [T](dataTypes#generic), [R](dataTypes#generic)

> 参阅: [wait(condition, limit, callback)](#wait-condition-limit-callback)

### waitForActivity(activityName, limit, interval, callback)

**`6.2.0`** **`Global`** **`Overload 6/6`** **`A11Y?`** **`Non-UI`**

- **activityName** { [string](dataTypes#string) } - 目标活动名称
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- **interval** { [number](dataTypes#number) } - 等待条件检测间隔
- **callback** {{
    - then(result?: [T](dataTypes#generic))?: [R](dataTypes#generic)
    - else(result?: [T](dataTypes#generic))?: [R](dataTypes#generic)
- }} - 等待结束回调对象
- <ins>**returns**</ins> { [R](dataTypes#generic) extends [void](dataTypes#void) ? [boolean](dataTypes#boolean) : [R](dataTypes#generic) }
- <ins>**template**</ins> [T](dataTypes#generic), [R](dataTypes#generic)

> 参阅: [wait(condition, limit, interval, callback)](#wait-condition-limit-interval-callback)

## [m] waitForPackage

等待指定包名的应用出现 (前置).<br>
此方法相当于 `wait(() => currentPackage() === packageName, ...args)`,<br>
因此其所有重载方法的结构与 wait 一致.<br>
为节约篇幅, 将仅列出方法签名等重要信息.

### waitForPackage(packageName)

**`6.2.0`** **`Global`** **`Overload 1/6`** **`A11Y?`** **`Non-UI`**

- **packageName** { [string](dataTypes#string) } - 目标应用包名
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

> 参阅: [wait(condition)](#wait-condition)

### waitForPackage(packageName, limit)

**`6.2.0`** **`Global`** **`Overload 2/6`** **`A11Y?`** **`Non-UI`**

- **packageName** { [string](dataTypes#string) } - 目标应用包名
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

> 参阅: [wait(condition, limit)](#wait-condition-limit)

### waitForPackage(packageName, limit, interval)

**`6.2.0`** **`Global`** **`Overload 3/6`** **`A11Y?`** **`Non-UI`**

- **packageName** { [string](dataTypes#string) } - 目标应用包名
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- **interval** { [number](dataTypes#number) } - 等待条件检测间隔
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

> 参阅: [wait(condition, limit, interval)](#wait-condition-limit-interval)

### waitForPackage(packageName, callback)

**`6.2.0`** **`Global`** **`Overload 4/6`** **`A11Y?`** **`Non-UI`**

- **packageName** { [string](dataTypes#string) } - 目标应用包名
- **callback** {{
    - then(result?: [T](dataTypes#generic))?: [R](dataTypes#generic)
    - else(result?: [T](dataTypes#generic))?: [R](dataTypes#generic)
- }} - 等待结束回调对象
- <ins>**returns**</ins> { [R](dataTypes#generic) extends [void](dataTypes#void) ? [boolean](dataTypes#boolean) : [R](dataTypes#generic) }
- <ins>**template**</ins> [T](dataTypes#generic), [R](dataTypes#generic)

> 参阅: [wait(condition, callback)](#wait-condition-callback)

### waitForPackage(packageName, limit, callback)

**`6.2.0`** **`Global`** **`Overload 5/6`** **`A11Y?`** **`Non-UI`**

- **packageName** { [string](dataTypes#string) } - 目标应用包名
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- **callback** {{
    - then(result?: [T](dataTypes#generic))?: [R](dataTypes#generic)
    - else(result?: [T](dataTypes#generic))?: [R](dataTypes#generic)
- }} - 等待结束回调对象
- <ins>**returns**</ins> { [R](dataTypes#generic) extends [void](dataTypes#void) ? [boolean](dataTypes#boolean) : [R](dataTypes#generic) }
- <ins>**template**</ins> [T](dataTypes#generic), [R](dataTypes#generic)

> 参阅: [wait(condition, limit, callback)](#wait-condition-limit-callback)

### waitForPackage(packageName, limit, interval, callback)

**`6.2.0`** **`Global`** **`Overload 6/6`** **`A11Y?`** **`Non-UI`**

- **packageName** { [string](dataTypes#string) } - 目标应用包名
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- **interval** { [number](dataTypes#number) } - 等待条件检测间隔
- **callback** {{
    - then(result?: [T](dataTypes#generic))?: [R](dataTypes#generic)
    - else(result?: [T](dataTypes#generic))?: [R](dataTypes#generic)
- }} - 等待结束回调对象
- <ins>**returns**</ins> { [R](dataTypes#generic) extends [void](dataTypes#void) ? [boolean](dataTypes#boolean) : [R](dataTypes#generic) }
- <ins>**template**</ins> [T](dataTypes#generic), [R](dataTypes#generic)

> 参阅: [wait(condition, limit, interval, callback)](#wait-condition-limit-interval-callback)

## [m] waitAsync

### waitAsync(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y?`**

### waitAsync(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y?`**

- <ins>**returns**</ins> { [Flow](flowType) }

[wait](#m-wait) 的异步形式, 同 [flow.wait](flow#m-wait): 不阻塞当前线程, 立即返回 [Flow](flowType) 对象; 条件满足时以匹配结果 (选择器条件为 [UiObject](uiObjectType), 函数条件为返回值) fulfill, 超时则以 [FlowError](flowErrorType) 拒绝. `wait.async` 是同一函数.

参数 (条件, 超时, 间隔, 选项对象与尾随回调) 见 [流程 (Flow)](flow) 章节的 [等待选项](flow#等待选项-waitoptions).

```js
waitAsync('立即开始', 5e3).click();
wait.async('立即开始', 5e3).then(w => console.log(w.bounds()));

/* 同步等待与异步等待的对照. */
let w = wait('立即开始', 5e3) ? pickup('立即开始') : null; /* 阻塞至多 5 秒. */
waitAsync('立即开始', 5e3).then(w => w.click(), e => console.warn(e.code)); /* 立即返回. */
```

## [m] waitThenClick

### waitThenClick(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`**

### waitThenClick(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`**

- <ins>**returns**</ins> { [Flow](flowType) }

等待目标出现后点击, 同 [flow.waitThenClick](flow#m-waitthenclick), 相当于 `waitAsync(cond, ...).click()`. `clickWait` 是别名.

```js
waitThenClick('登录', 5e3);
clickWait('登录', 5e3); /* 同上. */
```

## [m] waitThenClickBounds

### waitThenClickBounds(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`**

### waitThenClickBounds(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`**

- <ins>**returns**</ins> { [Flow](flowType) }

等待目标出现后在控件中心坐标点按, 同 [flow.waitThenClickBounds](flow#m-waitthenclickbounds), 相当于 `waitAsync(cond, ...).clickBounds()`. `clickBoundsWait` 是别名.

```js
waitThenClickBounds('登录', 5e3);
clickBoundsWait('登录', 5e3); /* 同上. */
```

直接使用控件边界中心执行手势, 不调用控件自身的 `click()` 方法. 等待参数与 [flow.wait](flow#m-wait) 相同, 稳定性参数见 [flow.waitForStable](flow#m-waitforstable). 需要坐标偏移时可使用 `waitAsync(cond, ...).clickBounds(offsetX, offsetY)`.

## [m] waitForStable

### waitForStable(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y?`**

### waitForStable(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y?`**

- <ins>**returns**</ins> { [Flow](flowType) }

等待目标出现并连续 `stableFor` 毫秒 (默认 0) 无变化, 同 [flow.waitForStable](flow#m-waitforstable).

```js
waitForStable(className('RecyclerView'), { timeout: 10e3, stableFor: 800 }).then(list => console.log(list.childCount()));
```

## [m] waitForStableThenClick

### waitForStableThenClick(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`**

### waitForStableThenClick(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`**

- <ins>**returns**</ins> { [Flow](flowType) }

等待目标稳定后点击, 同 [flow.waitForStableThenClick](flow#m-waitforstablethenclick). `clickWhenStable` 是别名.

```js
clickWhenStable('下一步', 8e3);
```

## [m] waitForStableThenClickBounds

### waitForStableThenClickBounds(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`**

### waitForStableThenClickBounds(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`**

- <ins>**returns**</ins> { [Flow](flowType) }

等待目标稳定后在控件中心坐标点按, 同 [flow.waitForStableThenClickBounds](flow#m-waitforstablethenclickbounds). `clickBoundsWhenStable` 是别名.

```js
clickBoundsWhenStable('下一步', 8e3);
```

直接使用控件边界中心执行手势, 不调用控件自身的 `click()` 方法. 等待参数与 [flow.wait](flow#m-wait) 相同, 稳定性参数见 [flow.waitForStable](flow#m-waitforstable). 需要坐标偏移时可使用 `waitAsync(cond, ...).clickBounds(offsetX, offsetY)`.

## [m] waitForVisible

### waitForVisible(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y?`**

### waitForVisible(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y?`**

- <ins>**returns**</ins> { [Flow](flowType) }

等待目标出现, 对用户可见且保持稳定, 同 [flow.waitForVisible](flow#m-waitforvisible).

## [m] waitForHidden

### waitForHidden(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y?`**

### waitForHidden(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y?`**

- <ins>**returns**</ins> { [Flow](flowType) }

等待目标消失 (连续 `stableFor` 毫秒不存在或不可见), 同 [flow.waitForHidden](flow#m-waitforhidden). `waitForGone` 是别名.

```js
waitForHidden(className('ProgressBar'), 30e3).then(() => console.log('加载完成'));
```

## [m] clickWhenStableAfter

### clickWhenStableAfter(cond, timeout?, interval?, delayMin?, delayMax?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`**

### clickWhenStableAfter(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`**

- <ins>**returns**</ins> { [Flow](flowType) }

等待目标稳定, 随机延时 `delayMin` 至 `delayMax` 毫秒后点击, 同 [flow.clickWhenStableAfter](flow#m-clickwhenstableafter).

```js
clickWhenStableAfter('同意', 5e3, 200, 300, 800); /* 5 秒超时, 200 毫秒间隔, 延时 300 ~ 800 毫秒. */
clickWhenStableAfter('同意', { delay: [ 300, 800 ] }); /* 同上, 超时与间隔取默认值. */
```

## [m] clickBoundsWhenStableAfter

### clickBoundsWhenStableAfter(cond, timeout?, interval?, delayMin?, delayMax?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`**

### clickBoundsWhenStableAfter(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`**

- <ins>**returns**</ins> { [Flow](flowType) }

等待目标稳定, 随机延时 `delayMin` 至 `delayMax` 毫秒后在控件中心坐标点按, 同 [flow.clickBoundsWhenStableAfter](flow#m-clickboundswhenstableafter).

```js
clickBoundsWhenStableAfter('同意', 5e3, 200, 300, 800); /* 5 秒超时, 200 毫秒间隔, 延时 300 ~ 800 毫秒. */
clickBoundsWhenStableAfter('同意', { delay: [ 300, 800 ] }); /* 同上, 超时与间隔取默认值. */
```

直接使用控件边界中心执行手势, 不调用控件自身的 `click()` 方法. 等待参数与 [flow.wait](flow#m-wait) 相同, 稳定性参数见 [flow.waitForStable](flow#m-waitforstable). 需要坐标偏移时可使用 `waitAsync(cond, ...).clickBounds(offsetX, offsetY)`.

选项对象使用 `delay` 指定固定延时或 `[min, max]` 范围, 省略延时会抛出异常.

## 工具集与事件驱动等待的全局函数

**`6.8.0`**

以下全局函数在 [自动化 (Automator)](automator) 与 [选择器 (UiSelector)](uiSelectorType) 章节说明:

- [工具集](automator#工具集-toolkit): [smartClick](automator#m-smartclick), [smartClickBounds](automator#m-smartclickbounds), [clickIfExists](automator#m-clickifexists), [clickBoundsIfExists](automator#m-clickboundsifexists), [clickAny](automator#m-clickany), [clickBoundsAny](automator#m-clickboundsany), [findAny](automator#m-findany), [scrollUntil](automator#m-scrolluntil), [typeInto](automator#m-typeinto), [dismissPopups](automator#m-dismisspopups), [collectList](automator#m-collectlist), [launchAndWait](automator#m-launchandwait), [backUntil](automator#m-backuntil), [backToApp](automator#m-backtoapp), [toggle](automator#m-toggle), [retry](automator#m-retry)
- [事件驱动等待](automator#事件驱动等待): [waitForIdle](automator#m-waitforidle), [waitForEvent](automator#m-waitforevent), [waitForToast](automator#m-waitfortoast), [waitForNotification](automator#m-waitfornotification)
- [字符串选择器语法](uiSelectorType#m-select): `select('text=登录 clickable')` 返回选择器

## [m] exit

停止脚本运行.

### exit()

**`Global`** **`Overload 1/2`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

通过抛出 `ScriptInterruptedException` 异常实现脚本停止.<br>
因此用 `try` 包裹 `exit()` 语句将会使脚本继续运行片刻:

```js
try {
    log('exit now');
    exit();
    log("after"); /* 控制台不会打印 "after". */
} catch (e) {
    e.javaException instanceof ScriptInterruptedException; // true
}
while (true) log("hello"); /* 控制台将打印一定数量的 "hello". */
```

如果编写的脚本对 "是否停止" 的状态十分敏感,<br>
即要求 exit() 之后的代码一定不被执行,<br>
则可通过附加状态判断实现上述需求:

```js
if (!isStopped()) {
    // 其他代码...
}
```

因此上述示例如果加上状态判断, "hello" 将不会被打印:

```js
try {
    log('exit now');
    exit();
} catch (_) {
    // Ignored.
}
if (!isStopped()) {
    while (true) {
        /* 控制台不会打印 "hello". */
        log("hello");
    }
}
```

除了 [isStopped](#m-isstopped), 还可通过 `threads` 或 `engines` 模块获取停止状态:

```js
/* threads. */
if (!threads.currentThread().isInterrupted()) {
    // 其他代码...
}

/* engines. */
if (!engines.myEngine().isStopped()) {
    // 其他代码...
}
```

### exit(e)

**`Global`** **`Overload 2/2`**

- **e** { [OmniThrowable](omniTypes#omnithrowable) } - 异常参数
- <ins>**returns**</ins> { [void](dataTypes#void) }

停止脚本运行并抛出异常参数指定的异常.

```js
let arg = 'hello';
try {
    if (typeof arg !== "number") {
        throw Error('arg 参数非 number 类型');
    }
} catch (e) {
    exit(e);
}
```

[OmniThrowable](omniTypes#omnithrowable) 支持字符串参数, 可将字符串参数作为异常消息传入 `exit` 方法中:

```js
let buttonText = '点此开始';
if (!pickup(buttonText)) {
    exit(`"${buttonText}" 按钮不存在.`);
}
```

## [m] stop

### stop()

**`Global`** - <ins>**returns**</ins> { [void](dataTypes#void) }

停止脚本运行.

[exit()](#exit) 的别名方法.

> 注: stop 方法不存在 [exit(e)](#exit-e) 对应的重载方法.

## [m] isStopped

### isStopped()

**`Global`** **`DEPRECATED`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

检测脚本主线程是否已中断.

即 `runtime.isInterrupted()`.

## [m] isShuttingDown

### isShuttingDown()

**`Global`** **`DEPRECATED`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

检测脚本主线程是否已中断.

因方法名称易造成歧义及混淆, 因此被弃用, 建议使用 [isStopped()](#m-isstopped) 或 `runtime.isInterrupted()` 替代.

## [m] isRunning

### isRunning()

**`Global`** - <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

检测脚本主线程是否未被中断.

即 `!runtime.isInterrupted()`.

## [m] notStopped

### notStopped()

**`Global`** **`DEPRECATED`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

检测脚本主线程是否未被中断.

因方法名称易造成歧义及混淆, 因此被弃用, 建议使用 [isRunning()](#m-isrunning) 或 `!runtime.isInterrupted()` 替代.

## [m] requiresApi

### requiresApi(api)

**`Global`** - **api** { [number](dataTypes#number) } - 安卓 API 级别

- <ins>**returns**</ins> { [void](dataTypes#void) }

脚本运行的最低 API 级别要求.

例如要求脚本运行不低于 [Android API 30 (11) [R]](apiLevel):

```js
requiresApi(30);
requiresApi(util.versionCodes.R.apiLevel); /* 同上. */
requiresApi(android.os.Build.VERSION_CODES.R); /* 同上. */
```

若 API 级别不符合要求, 脚本抛出异常并停止继续执行.

> 参阅:
> - [Android API Level - 安卓 API 级别](apiLevel)
> - [util.versionCodes](util#p-versioncodes)

## [m] requiresAutojsVersion

### requiresAutojsVersion(versionName)

**`Global`** **`Overload 1/2`**

- **versionName** { [string](dataTypes#string) } - AutoJs6 版本名称
- <ins>**returns**</ins> { [void](dataTypes#void) }

脚本运行的最低 AutoJs6 版本要求 (版本名称).

```js
requiresAutojsVersion("6.2.0");
```

可通过 `autojs.versionName` 查看 AutoJs6 版本名称.

> 参阅: [autojs.versionName](autojs#versionname)

### requiresAutojsVersion(versionCode)

**`Global`** **`Overload 2/2`**

- **versionCode** { [number](dataTypes#number) } - AutoJs6 版本号
- <ins>**returns**</ins> { [void](dataTypes#void) }

脚本运行的最低 AutoJs6 版本要求 (版本号).

```js
requiresAutojsVersion(1024);
```

可通过 `autojs.versionCode` 查看 AutoJs6 版本号.

> 参阅: [autojs.versionCode](autojs#versioncode)

## [m] importPackage

### importPackage(...pkg)

**`Global`** - **pkg** { ...( [string](dataTypes#string) | [object](dataTypes#object) ) } - 需导入的 Java 包

- <ins>**returns**</ins> { [void](dataTypes#void) }

```js
/* 导入一个 Java 包. */

importPackage(java.lang);
importPackage('java.lang'); /* 同上. */

/* 导入多个 Java 包. */

importPackage(java.io);
importPackage(java.lang);
importPackage(java.util);

importPackage(java.io, java.lang, java.util); /* 同上. */
```

> 参阅: [访问 Java 包和类](scriptingJava#访问-Java-包和类)

## [m] importClass

### importClass(...cls)

**`Global`** - **cls** { ...( [string](dataTypes#string) | [object](dataTypes#object) ) } - 需导入的 Java 类

- <ins>**returns**</ins> { [void](dataTypes#void) }

```js
/* 导入一个 Java 类. */

importClass(java.lang.Integer);
importClass('java.lang.Integer'); /* 同上. */

/* 导入多个 Java 类. */

importClass(java.io.File);
importClass(java.lang.Integer);
importClass(java.util.HashMap);

importClass(
    java.io.File,
    java.lang.Integer,
    java.util.HashMap,
); /* 同上. */
```

> 参阅: [访问 Java 包和类](scriptingJava#访问-Java-包和类)

## [m] currentPackage

### currentPackage(mode?)

**`Global`** **`A11Y?`**

- **[ mode = "auto" ]** { `'auto'` | `'a11y'` | `'shizuku'` | `'root'` | {{ by?: [string](dataTypes#string); mode?: [string](dataTypes#string) }} } - 信息获取方式
- <ins>**returns**</ins> { [string](dataTypes#string) } - 前台应用包名, 获取失败时为空字符串

获取当前前台应用的包名.

模式名称忽略大小写, 并支持以下别名:

- `auto`, `automatic`, `automatism`: 依次尝试 Shizuku, Root 和无障碍服务, 返回首个非空结果.
- `a11y`, `accessibility`: 使用无障碍服务最近监测到的信息.
- `shizuku`: 使用 Shizuku 服务.
- `root`: 使用 Root Shell.

模式也可写为 `{ by: "shizuku" }` 或 `{ mode: "root" }`.

## [m] currentActivity

### currentActivity(mode?)

**`Global`** **`A11Y?`**

- **[ mode = "auto" ]** { `'auto'` | `'a11y'` | `'shizuku'` | `'root'` | {{ by?: [string](dataTypes#string); mode?: [string](dataTypes#string) }} } - 信息获取方式
- <ins>**returns**</ins> { [string](dataTypes#string) } - 前台活动名称, 获取失败时为空字符串

获取当前前台活动名称. 模式及别名与 [currentPackage(mode?)](#currentpackage-mode) 相同.

## [m] currentComponent

### currentComponent(mode?)

**`Global`** **`A11Y?`**

- **[ mode = "auto" ]** { `'auto'` | `'a11y'` | `'shizuku'` | `'root'` | {{ by?: [string](dataTypes#string); mode?: [string](dataTypes#string) }} } - 信息获取方式
- <ins>**returns**</ins> { [string](dataTypes#string) } - 前台组件名称, 获取失败时为空字符串

获取当前前台组件, 通常采用 `packageName/activityName` 形式. 模式及别名与 [currentPackage(mode?)](#currentpackage-mode) 相同.

## [m] setClip

### setClip(text)

**`Global`** - **text** { [string](dataTypes#string) } - 剪贴板内容

- <ins>**returns**</ins> { [void](dataTypes#void) }

设置系统剪贴板内容.

> 参阅: [getClip](#m-getclip)

## [m] getClip

### getClip()

**`Global`** - <ins>**returns**</ins> { [string](dataTypes#string) } - 系统剪贴板内容

需额外留意, 自 [Android API 29 (10) [Q]](apiLevel) 起, 剪贴板数据的访问将受到限制:

为更好地保护用户隐私权, 除默认输入法及当前获取焦点的前置应用外, 均无法访问剪贴板数据.

```js
setClip("test");

/* 安卓 10 以下: 打印 "test". */
/* 安卓 10 及以上: 若 AutoJs6 前置, 打印 "test", 否则打印空字符串. */
console.log(getClip());
```

> 参阅: [setClip](#m-setclip)

> 参阅: [Android Docs](https://developer.android.com/about/versions/10/privacy/changes#clipboard-data)

## [m] selector

### selector()

**`Global`** - <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

构建一个 "空" [选择器](uiSelectorType).

## [m] pickup

拾取选择器, 简称拾取器, 是高度封装的混合形式选择器, 用于在筛选控件及处理结果过程中实现快捷操作.<br>
支持 [ 选择器多形式混合 / 控件罗盘 / 结果筛选 / 参化调用 ] 等.

参阅 [UiSelector.pickup](uiSelectorType#m-pickup).

## [m] detect

控件探测.

探测相当于对控件进行一系列组合操作 (罗盘定位, 结果筛选, 参化调用, 回调处理).

参阅 [UiObject#detect](uiObjectType#m-detect).

## [m] existsAll

### existsAll(...selectors)

**`Global`** - **selectors** { [...](documentation#可变参数)[PickupSelector](dataTypes#pickupselector)[[]](documentation#可变参数) } - 混合选择器参数

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 选择器全部满足 "存在" 条件

提供的选择器参数全部满足 "存在" 条件, 即 `selector.exists() === true`.

例如要求当前活动窗口中同时存在以下三个选择器对应的控件:

1. contentMatch(/^开始.*/)
2. descMatch(/descriptions?/)
3. content('点击继续')

```js
console.log(existsAll(contentMatch(/^开始.*/), descMatch(/descriptions?/), content('点击继续'))); /* e.g. true */
```

因混合选择器参数支持对 content 系列选择器的简化, 因此上述示例也可改写为以下形式:

```js
console.log(existsAll(/^开始.*/, descMatch(/descriptions?/), '点击继续')); /* e.g. true */
```

此方法对应的传统的逻辑判断形式:

```js
console.log(contentMatch(/^开始.*/).exists()
    && descMatch(/descriptions?/).exists()
    && content('点击继续').exists()); /* e.g. true */
```

## [m] existsOne

### existsOne(...selectors)

**`Global`** - **selectors** { [...](documentation#可变参数)[PickupSelector](dataTypes#pickupselector)[[]](documentation#可变参数) } - 混合选择器参数

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 选择器任一满足 "存在" 条件

提供的选择器参数任一满足 "存在" 条件, 即 `selector.exists() === true`.

例如要求当前活动窗口中存在任意一个以下选择器对应的控件:

1. contentMatch(/^开始.*/)
2. descMatch(/descriptions?/)
3. content('点击继续')

```js
console.log(existsOne(contentMatch(/^开始.*/), descMatch(/descriptions?/), content('点击继续'))); /* e.g. true */
```

因混合选择器参数支持对 content 系列选择器的简化, 因此上述示例也可改写为以下形式:

```js
console.log(existsOne(/^开始.*/, descMatch(/descriptions?/), '点击继续')); /* e.g. true */
```

此方法对应的传统的逻辑判断形式:

```js
console.log(contentMatch(/^开始.*/).exists()
    || descMatch(/descriptions?/).exists()
    || content('点击继续').exists()); /* e.g. true */
```

## [m] setScreenMetrics

### setScreenMetrics(width, height)

**`Global`**

- **width** { [number](dataTypes#number) } - 脚本设计时的屏幕宽度 (像素)
- **height** { [number](dataTypes#number) } - 脚本设计时的屏幕高度 (像素)
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置基于坐标的触摸操作所使用的设计分辨率. 实际点击, 长按和滑动坐标会按当前设备尺寸缩放.

某一维度为 `0` 时, 该方向的自动缩放不生效.

> 参阅: [setScreenMetrics(width, height)](automator#setscreenmetrics-width-height)

## [m] getScaleBases

### getScaleBases()

**`Global`**

- <ins>**returns**</ins> {{ x: [number](dataTypes#number); y: [number](dataTypes#number) }} - 当前横向和纵向标度基数

默认返回 `{ x: 720, y: 1280 }`.

## [m] getScaleBaseX

### getScaleBaseX()

**`Global`**

- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前横向标度基数

默认值为 `720`.

## [m] getScaleBaseY

### getScaleBaseY()

**`Global`**

- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前纵向标度基数

默认值为 `1280`.

## [m] setScaleBases

### setScaleBases(baseX, baseY)

**`Global`**

- **baseX** { [number](dataTypes#number) } - 横向标度基数
- **baseY** { [number](dataTypes#number) } - 纵向标度基数
- <ins>**returns**</ins> { [void](dataTypes#void) }

同时设置 [cX](#m-cx), [cY](#m-cy), [cYx](#m-cyx) 和 [cXy](#m-cxy) 使用的标度基数. 两个参数必须为正整数.

每个方向的基数在同一个脚本运行时中最多设置一次.

## [m] setScaleBaseX

### setScaleBaseX(baseX)

**`Global`**

- **baseX** { [number](dataTypes#number) } - 横向标度基数
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置横向标度基数. 参数必须为正整数, 且在同一个脚本运行时中最多设置一次.

## [m] setScaleBaseY

### setScaleBaseY(baseY)

**`Global`**

- **baseY** { [number](dataTypes#number) } - 纵向标度基数
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置纵向标度基数. 参数必须为正整数, 且在同一个脚本运行时中最多设置一次.

## [m] cX

横坐标标度.

### cX()

**`6.2.0`** **`Global`** **`Overload 1/4`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

无参时, 返回当前设备宽度.

```js
console.log(cX() === device.width); // true
```

### cX(x, base, isRatio?)

**`6.2.0`** **`Global`** **`Overload 2/4`**

- **x** { [number](dataTypes#number) } - 绝对坐标值
- **base** { [number](dataTypes#number) } - 坐标值基数
- **[ isRatio = false ]** { [boolean](dataTypes#boolean) } - 是否强制将 `x` 作为百分比
- <ins>**returns**</ins> { [number](dataTypes#number) }

由基数换算后得到的横坐标值.

`isRatio` 为 `true` 时, `x` 强制作为屏幕宽度百分比, 此时 `base` 不参与计算.

例如在一个设备宽度为 `1096` 的设备上的 `100` 像素, 在其他不同宽度的设备上将转换为不同的值:

```js
/* 在宽度为 1096 像素的设备上. */
cX(100, 1096); // 100

/* 在宽度为 1080 像素的设备上. */
cX(100, 1096); // 99

/* 在宽度为 720 像素的设备上. */
cX(100, 1096); // 66

/* 在宽度为 540 像素的设备上. */
cX(100, 1096); // 49
```

上述示例的 `1096` 为基数, 默认基数为 `720`, 如需设置默认基数, 可使用以下方法:

```js
cX(100); /* 相当于 cX(100, 720). */
setScaleBaseX(1096);
cX(100); /* 相当于 cX(100, 1096). */
```

默认基数只能修改最多一次.

### cX(x, isRatio)

**`6.2.0`** **`Global`** **`Overload 3/4`**

- **x** { [number](dataTypes#number) } - 绝对坐标值或屏幕宽度百分比
- **[ isRatio = 'auto' ]** { `'auto'` | [boolean](dataTypes#boolean) } - 是否将 `x` 参数强制作为百分比
- <ins>**returns**</ins> { [number](dataTypes#number) }

`isRatio` 参数默认为 `auto`, 即由 `x` 参数的范围自动决定 `x` 是否视为百分比,<br>
即当参数 `x` 满足 `-1 < x < 1` 时, `x` 将视为屏幕宽度百分比, 否则将视为绝对坐标值.

`isRatio` 参数为 `true` 时, `x` 参数将强制视为百分比, 如 `cX(2, true)` 意味着两倍屏幕宽度, `2` 的意义不再是像素值.

`isRatio` 参数为 `false` 时, `x` 参数将强制视为绝对坐标值, 如 `cX(0.5, false)` 意味着 `0.5` 像素值, 其意义不再是百分比.

### cX(x)

**`6.2.0`** **`Global`** **`Overload 4/4`**

- **x** { [number](dataTypes#number) } - 绝对坐标值或屏幕宽度百分比
- <ins>**returns**</ins> { [number](dataTypes#number) }

当参数 `x` 满足 `-1 < x < 1` 时, 相当于 `cX(x, /* isRatio = */ true)`, 即 `x` 将视为屏幕宽度百分比.

当参数 `x` 满足 `x <= -1 | x >= 1` 时, 相当于 `cX(x, /* base = */ 720)`, 即 `x` 将视为绝对坐标值, 另 `base` 参数可能由 `setScaleBaseX` 等方法修改, `720` 为其默认值.

## [m] cY

纵坐标标度.

### cY()

**`6.2.0`** **`Global`** **`Overload 1/4`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

无参时, 返回当前设备高度.

```js
console.log(cY() === device.height); // true
```

### cY(y, base, isRatio?)

**`6.2.0`** **`Global`** **`Overload 2/4`**

- **y** { [number](dataTypes#number) } - 绝对坐标值
- **base** { [number](dataTypes#number) } - 坐标值基数
- **[ isRatio = false ]** { [boolean](dataTypes#boolean) } - 是否强制将 `y` 作为百分比
- <ins>**returns**</ins> { [number](dataTypes#number) }

由基数换算后得到的纵坐标值.

`isRatio` 为 `true` 时, `y` 强制作为屏幕高度百分比, 此时 `base` 不参与计算.

例如在一个设备高度为 `2560` 的设备上的 `100` 像素, 在其他不同高度的设备上将转换为不同的值:

```js
/* 在高度为 2560 像素的设备上. */
cY(100, 2560); // 100

/* 在高度为 1920 像素的设备上. */
cY(100, 2560); // 75

/* 在高度为 1280 像素的设备上. */
cY(100, 2560); // 50

/* 在高度为 960 像素的设备上. */
cY(100, 2560); // 38
```

上述示例的 `2560` 为基数, 默认基数为 `1280`, 如需设置默认基数, 可使用以下方法:

```js
cY(100); /* 相当于 cY(100, 1280). */
setScaleBaseY(2560);
cY(100); /* 相当于 cY(100, 2560). */
```

默认基数只能修改最多一次.

### cY(y, isRatio)

**`6.2.0`** **`Global`** **`Overload 3/4`**

- **y** { [number](dataTypes#number) } - 绝对坐标值或屏幕高度百分比
- **[ isRatio = 'auto' ]** { `'auto'` | [boolean](dataTypes#boolean) } - 是否将 `y` 参数强制作为百分比
- <ins>**returns**</ins> { [number](dataTypes#number) }

`isRatio` 参数默认为 `auto`, 即由 `y` 参数的范围自动决定 `y` 是否视为百分比,<br>
即当参数 `y` 满足 `-1 < y < 1` 时, `y` 将视为屏幕高度百分比, 否则将视为绝对坐标值.

`isRatio` 参数为 `true` 时, `y` 参数将强制视为百分比, 如 `cY(2, true)` 意味着两倍屏幕高度, `2` 的意义不再是像素值.

`isRatio` 参数为 `false` 时, `y` 参数将强制视为绝对坐标值, 如 `cY(0.5, false)` 意味着 `0.5` 像素值, 其意义不再是百分比.

### cY(y)

**`6.2.0`** **`Global`** **`Overload 4/4`**

- **y** { [number](dataTypes#number) } - 绝对坐标值或屏幕高度百分比
- <ins>**returns**</ins> { [number](dataTypes#number) }

当参数 `y` 满足 `-1 < y < 1` 时, 相当于 `cY(y, /* isRatio = */ true)`, 即 `y` 将视为屏幕高度百分比.

当参数 `y` 满足 `y <= -1 | y >= 1` 时, 相当于 `cY(y, /* base = */ 1280)`, 即 `y` 将视为绝对坐标值, 另 `base` 参数可能由 `setScaleBaseY` 等方法修改, `1280` 为其默认值.

## [m] cYx

以横坐标度量的纵坐标标度.

与设备高度无关, 与设备宽度相关的坐标标度.

如 `cYx(0.5, '9:16')` 对于以下 5 个设备 (以分辨率区分) 得到的结果是完全一致的:

```text
1. 1080 × 1920
4. 1080 × 2160
5. 1080 × 2340
3. 1080 × 2520
2. 1080 × 2560
```

因为所有设备宽度相同, `cYx` 的结果是高度无关的.

计算结果:

```js
1080 * 0.5 * 16 / 9; // 960
```

设想如下场景, 某个应用页面是可以向下滚动窗口显示更多内容的, 在屏幕上半部分有一个按钮 `BTN`, 距离屏幕上边缘 `H` 距离, 另一台设备与当前设备屏幕宽度相同, 但高度更大, 相当于屏幕纵向变长, 此时按钮 `BTN` 距离屏幕上边缘依然是 `H` 距离, 仅仅是屏幕下方显示了更多内容.<br>
因此可使用 `cYx` 标度表示按钮 `BTN` 的位置, 如 `cYx(0.2, 1080 / 1920)` 或 `cYx(0.2, 9 / 16)` 或 `cYx(0.2, '9:16')`.

上述示例的 `0.2` 是一个相对值, 是相对于当前设备屏幕高度的, 因此第 2 个参数对应设备宽高比例值.<br>
如果使用绝对坐标值 (`Y` 坐标值), 如 `384`, 则第 2 个参数对应的是设备屏幕宽度值:

| 第 1 个参数 | 第 2 个参数 |        示例        |
|:-------:|:-------:|:----------------:|
| Y 坐标百分比 |  设备宽高比  | cYx(0.2, '9:16') |
|  Y 坐标值  |  设备宽度值  |  cYx(384, 1096)  |

### cYx(coordinateY, baseX)

**`6.2.0`** **`Global`** **`Overload [1(A)]/3`**

- **coordinateY** { [number](dataTypes#number) } - 纵坐标值
- **[ baseX = 720 ]** { [number](dataTypes#number) } - 横坐标基数
- <ins>**returns**</ins> { [number](dataTypes#number) }

由横坐标基数换算后得到的纵坐标值.

例如在一个设备宽度为 `1096` 设备上的 `512` 像素高度, 在其他不同宽度的设备上将转换为不同的值:

```js
/* 在宽度为 1096 像素的设备上. */
cYx(512, 1096); // 512

/* 在宽度为 1080 像素的设备上. */
cYx(512, 1096); // 505

/* 在宽度为 720 像素的设备上. */
cYx(512, 1096); // 336

/* 在宽度为 540 像素的设备上. */
cYx(512, 1096); // 252
```

上述示例的 `1096` 为基数, 默认基数为 `720`, 如需设置默认基数, 可使用以下方法:

```js
cYx(512); /* 相当于 cYx(512, 720). */
setScaleBaseX(1096);
cYx(512); /* 相当于 cYx(512, 1096). */
```

默认基数只能修改最多一次.

### cYx(percentY, ratio)

**`6.2.0`** **`Global`** **`Overload [1(B)]/3`**

- **percentY** { [number](dataTypes#number) } - 纵坐标百分比
- **[ ratio = '9:16' ]** { [number](dataTypes#number) | [string](dataTypes#string) } - 设备宽高比
- <ins>**returns**</ins> { [number](dataTypes#number) }

由设备宽高比换算后得到的新纵坐标值.

例如在一个设备宽度与高度分别为 `1096` 和 `2560` 的设备上的 `512` 像素高度, 即 `0.2` 倍的屏幕高度, 在其他不同宽度的设备上将转换为不同的值:

```js
/* 在宽度为 1096 像素的设备上. */
cYx(0.2, 1096 / 2560); // 512

/* 在宽度为 1080 像素的设备上. */
cYx(0.2, 1096 / 2560); // 505

/* 在宽度为 720 像素的设备上. */
cYx(0.2, 1096 / 2560); // 336

/* 在宽度为 540 像素的设备上. */
cYx(0.2, 1096 / 2560); // 252
```

上述示例的 `1096 / 2560` 为基数, 默认基数为 `720 / 1280`, 如需设置默认基数, 可使用以下方法:

```js
cYx(0.2); /* 相当于 cYx(0.2, 720 / 1280). */
setScaleBases(1096, 2560);
cYx(0.2); /* 相当于 cYx(0.2, 1096 / 2560). */
```

默认基数只能修改最多一次.

### cYx(y, isRatio)

**`6.2.0`** **`Global`** **`Overload 2/3`**

- **y** { [number](dataTypes#number) } - 绝对坐标值或屏幕高度百分比
- **[ isRatio = 'auto' ]** { `'auto'` | [boolean](dataTypes#boolean) } - 是否将 `y` 参数强制作为百分比
- <ins>**returns**</ins> { [number](dataTypes#number) }

`isRatio` 参数默认为 `auto`, 即由 `y` 参数的范围自动决定 `y` 是否视为百分比,<br>
即当参数 `y` 满足 `-1 < y < 1` 时, `y` 将视为屏幕高度百分比, 否则将视为绝对坐标值.

`isRatio` 参数为 `true` 时, `y` 参数将强制视为百分比, 如 `cYx(2, true)` 意味着两倍屏幕高度, `2` 的意义不再是像素值.

`isRatio` 参数为 `false` 时, `y` 参数将强制视为绝对坐标值, 如 `cYx(0.5, false)` 意味着 `0.5` 像素值, 其意义不再是百分比.

### cYx(y)

**`6.2.0`** **`Global`** **`Overload 3/3`**

- **y** { [number](dataTypes#number) } - 绝对坐标值或屏幕高度百分比
- <ins>**returns**</ins> { [number](dataTypes#number) }

当参数 `y` 满足 `-1 < y < 1` 时, 相当于 `cYx(y, /* isRatio = */ true)`, 即 `y` 将视为屏幕高度百分比.

当参数 `y` 满足 `y <= -1 | y >= 1` 时, 相当于 `cYx(y, /* base = */ 720)`, 即 `y` 将视为绝对坐标值, 另 `base` 参数可能由 `setScaleBaseX` 等方法修改, `720` 为其默认值.

```js
cYx(0.3); /* 相当于 cYx(0.3, '9:16'). */
cYx(384); /* 相当于 cYx(384, 720). */
```

## [m] cXy

以纵坐标度量的横坐标标度.

与设备宽度无关, 与设备高度相关的坐标标度.

如 `cXy(0.5, '9:16')` 对于以下 5 个设备 (以分辨率区分) 得到的结果是完全一致的:

```text
1. 1080 × 1920
4. 1096 × 1920
5. 720 × 1920
3. 540 × 1920
2. 960 × 1920
```

因为所有设备高度相同, `cXy` 的结果是宽度无关的.

计算结果:

```js
1920 * 0.5 * 9 / 16; // 540
```

设想如下场景, 某个应用页面是可以向右滚动窗口显示更多内容的, 在屏幕左半部分有一个按钮 `BTN`, 距离屏幕左边缘 `W` 距离, 另一台设备与当前设备屏幕高度相同, 但宽度更大, 相当于屏幕横向变长, 此时按钮 `BTN` 距离屏幕左边缘依然是 `W` 距离, 仅仅是屏幕右方显示了更多内容.<br>
因此可使用 `cXy` 标度表示按钮 `BTN` 的位置, 如 `cXy(0.2, 1080 / 1920)` 或 `cXy(0.2, 9 / 16)` 或 `cXy(0.2, '9:16')`.

上述示例的 `0.2` 是一个相对值, 是相对于当前设备屏幕宽度的, 因此第 2 个参数对应设备宽高比例值.<br>
如果使用绝对坐标值 (`X` 坐标值), 如 `384`, 则第 2 个参数对应的是设备屏幕高度值:

| 第 1 个参数 | 第 2 个参数 |        示例        |
|:-------:|:-------:|:----------------:|
| X 坐标百分比 |  设备宽高比  | cXy(0.2, '9:16') |
|  X 坐标值  |  设备高度值  |  cXy(384, 2560)  |

### cXy(coordinateX, baseY)

**`6.2.0`** **`Global`** **`Overload [1(A)]/3`**

- **coordinateX** { [number](dataTypes#number) } - 横坐标值
- **[ baseY = 1280 ]** { [number](dataTypes#number) } - 纵坐标基数
- <ins>**returns**</ins> { [number](dataTypes#number) }

由纵坐标基数换算后得到的横坐标值.

例如在一个设备高度为 `2560` 设备上的 `512` 像素宽度, 在其他不同高度的设备上将转换为不同的值:

```js
/* 在高度为 2560 像素的设备上. */
cXy(512, 2560); // 512

/* 在高度为 1920 像素的设备上. */
cXy(512, 2560); // 384

/* 在高度为 1280 像素的设备上. */
cXy(512, 2560); // 256

/* 在高度为 960 像素的设备上. */
cXy(512, 2560); // 192
```

上述示例的 `2560` 为基数, 默认基数为 `1280`, 如需设置默认基数, 可使用以下方法:

```js
cXy(512); /* 相当于 cXy(512, 1280). */
setScaleBaseY(2560);
cXy(512); /* 相当于 cXy(512, 2560). */
```

默认基数只能修改最多一次.

### cXy(percentX, ratio)

**`6.2.0`** **`Global`** **`Overload [1(B)]/3`**

- **percentX** { [number](dataTypes#number) } - 横坐标百分比
- **[ ratio = '9:16' ]** { [number](dataTypes#number) | [string](dataTypes#string) } - 设备宽高比
- <ins>**returns**</ins> { [number](dataTypes#number) }

由设备宽高比换算后得到的新横坐标值.

例如在一个设备高度与宽度分别为 `1096` 和 `2560` 的设备上的 `548` 像素宽度, 即 `0.5` 倍的屏幕宽度, 在其他不同高度的设备上将转换为不同的值:

```js
/* 在高度为 2560 像素的设备上. */
cXy(0.5, 1096 / 2560); // 548

/* 在高度为 1920 像素的设备上. */
cXy(0.5, 1096 / 2560); // 411

/* 在高度为 1280 像素的设备上. */
cXy(0.5, 1096 / 2560); // 274

/* 在高度为 960 像素的设备上. */
cXy(0.5, 1096 / 2560); // 206
```

上述示例的 `1096 / 2560` 为基数, 默认基数为 `720 / 1280`, 如需设置默认基数, 可使用以下方法:

```js
cXy(0.5); /* 相当于 cXy(0.5, 720 / 1280). */
setScaleBases(1096, 2560);
cXy(0.5); /* 相当于 cXy(0.5, 1096 / 2560). */
```

默认基数只能修改最多一次.

### cXy(x, isRatio)

**`6.2.0`** **`Global`** **`Overload 2/3`**

- **x** { [number](dataTypes#number) } - 绝对坐标值或屏幕宽度百分比
- **[ isRatio = 'auto' ]** { `'auto'` | [boolean](dataTypes#boolean) } - 是否将 `x` 参数强制作为百分比
- <ins>**returns**</ins> { [number](dataTypes#number) }

`isRatio` 参数默认为 `auto`, 即由 `x` 参数的范围自动决定 `x` 是否视为百分比,<br>
即当参数 `x` 满足 `-1 < x < 1` 时, `x` 将视为屏幕宽度百分比, 否则将视为绝对坐标值.

`isRatio` 参数为 `true` 时, `x` 参数将强制视为百分比, 如 `cXy(2, true)` 意味着两倍屏幕宽度, `2` 的意义不再是像素值.

`isRatio` 参数为 `false` 时, `x` 参数将强制视为绝对坐标值, 如 `cXy(0.5, false)` 意味着 `0.5` 像素值, 其意义不再是百分比.

### cXy(x)

**`6.2.0`** **`Global`** **`Overload 3/3`**

- **x** { [number](dataTypes#number) } - 绝对坐标值或屏幕宽度百分比
- <ins>**returns**</ins> { [number](dataTypes#number) }

当参数 `x` 满足 `-1 < x < 1` 时, 相当于 `cXy(x, /* isRatio = */ true)`, 即 `x` 将视为屏幕宽度百分比.

当参数 `x` 满足 `x <= -1 | x >= 1` 时, 相当于 `cXy(x, /* base = */ 1280)`, 即 `x` 将视为绝对坐标值, 另 `base` 参数可能由 `setScaleBaseY` 等方法修改, `1280` 为其默认值.

```js
cXy(0.3); /* 相当于 cXy(0.3, '9:16'). */
cXy(384); /* 相当于 cXy(384, 1280). */
```

## [m+] species

`species` 与 `$species` 指向同一个可调用对象.

### species(o)

**`Global`**

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [string](dataTypes#string) }

查看任意对象的 "种类", 如 `Object`, `Array`, `Number`, `String`, `RegExp` 等.

内部实现代码摘要:

```js
Object.prototype.toString.call(o).slice('[Object\x20'.length, ']'.length * -1);
```

示例:

```js
species('xyz'); // String
species(20); // Number
species(20n); // BigInt
species(true); // Boolean
species(undefined); // Undefined
species(null); // Null
species(() => null); // Function
species({ a: 'Apple' }); // Object
species([ 5, 10, 15 ]); // Array
species(/^\d{8,11}$/); // RegExp
species(new Date()); // Date
species(new TypeError()); // Error
species(new Map()); // Map
species(new Set()); // Set
species(<text/>); // XML
species(org.autojs.autojs6); // JavaPackage
species(org.autojs.autojs6.R); // JavaClass
```

如需判断某个对象是否为特定的 "种类", 可使用形如 `species.isXxx` 的扩展方法:

```js
species.isObject(23); // false
species.isNumber(23); // true
species.isRegExp(/test$/); // true
```

### [m] isArray

#### isArray(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `Array`.

### [m] isArrayBuffer

#### isArrayBuffer(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `ArrayBuffer`.

### [m] isBigInt

#### isBigInt(o)

**`Global`**

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `BigInt`.

### [m] isBoolean

#### isBoolean(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `Boolean`.

### [m] isContinuation

#### isContinuation(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `Continuation`.

### [m] isDataView

#### isDataView(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `DataView`.

### [m] isDate

#### isDate(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `Date`.

### [m] isError

#### isError(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `Error`.

### [m] isFloat32Array

#### isFloat32Array(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `Float32Array`.

### [m] isFloat64Array

#### isFloat64Array(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `Float64Array`.

### [m] isFunction

#### isFunction(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `Function`.

### [m] isHTMLDocument

#### isHTMLDocument(o)

**`6.8.0`**

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `HTMLDocument`.

### [m] isInt16Array

#### isInt16Array(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `Int16Array`.

### [m] isInt32Array

#### isInt32Array(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `Int32Array`.

### [m] isInt8Array

#### isInt8Array(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `Int8Array`.

### [m] isJavaObject

#### isJavaObject(o)

**`Global`**

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `JavaObject`.

### [m] isJavaClass

#### isJavaClass(o)

**`Global`**

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `JavaClass`.

可省略 `species` 对象直接调用 `isJavaClass(o)`.

### [m] isJavaPackage

#### isJavaPackage(o)

**`Global`**

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `JavaPackage`.

可省略 `species` 对象直接调用 `isJavaPackage(o)`.

### [m] isMap

#### isMap(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `Map`.

### [m] isNamespace

#### isNamespace(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `Namespace`.

### [m] isNull

#### isNull(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `Null`.

### [m] isNumber

#### isNumber(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `Number`.

### [m] isObject

#### isObject(o)

**`Global`**

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `Object`.

可省略 `species` 对象直接调用 `isObject(o)`.

### [m] isQName

#### isQName(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `QName`.

### [m] isRegExp

#### isRegExp(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `RegExp`.

### [m] isSet

#### isSet(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `Set`.

### [m] isString

#### isString(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `String`.

### [m] isUint16Array

#### isUint16Array(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `Uint16Array`.

### [m] isUint32Array

#### isUint32Array(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `Uint32Array`.

### [m] isUint8Array

#### isUint8Array(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `Uint8Array`.

### [m] isUint8ClampedArray

#### isUint8ClampedArray(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `Uint8ClampedArray`.

### [m] isUndefined

#### isUndefined(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `Undefined`.

### [m] isWeakMap

#### isWeakMap(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `WeakMap`.

### [m] isWeakSet

#### isWeakSet(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `WeakSet`.

### [m] isWindow

#### isWindow(o)

**`6.8.0`**

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `Window`.

### [m] isXML

#### isXML(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `XML`.

### [m] isXMLList

#### isXMLList(o)

- **o** { [any](dataTypes#any) } - 任意对象
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

判断对象的 "种类" 是否为 `XMLList`.

## [p] WIDTH

**`6.2.0`** **`Global`** **`Getter`**

- { [number](dataTypes#number) }

[device.width](device#p-width) 的别名属性.

## [p] HEIGHT

**`6.2.0`** **`Global`** **`Getter`**

- { [number](dataTypes#number) }

[device.height](device#p-height) 的别名属性.

## 全局 Java 类代理

AutoJs6 将一组常用 Java 类作为惰性全局属性公开. 首次访问名称时, 属性解析为 Rhino `NativeJavaClass`, 可直接访问静态成员或调用构造方法.

当前 Android SDK 类代理:

```text
Manifest
GestureResultCallback
Notification
NotificationManager
PendingIntent
ComponentName
Context
Intent
PackageManager
ColorStateList
Bitmap
BitmapFactory
Paint
PorterDuff
Typeface
ColorDrawable
Uri
Build
Handler
Looper
Settings
TextToSpeech
InputType
TextWatcher
Linkify
Base64
Log
TypedValue
ContextThemeWrapper
Gravity
KeyEvent
MotionEvent
ScaleGestureDetector
WindowManager
LayoutParams
MimeTypeMap
WebChromeClient
WebView
WebViewClient
Toast
```

其中 `LayoutParams` 对应 `android.view.WindowManager.LayoutParams`.

当前 AndroidX 及第三方类代理:

```text
BigTextStyle
NotificationCompat
FileProvider
ImageViewCompat
Snackbar
MaterialDialog
LogConfigurator
Version
```

当前 Java 标准库类代理:

```text
ByteArrayOutputStream
File
Runnable
SecurityException
System
Thread
Throwable
URI
StandardCharsets
TimeUnit
Locale
AtomicLong
ReentrantLock
```

当前 OkHttp 和 Log4j 类代理:

```text
Callback
FormBody
MediaType
MultipartBody
OkHttpClient
Request
RequestBody
Level
LogManager
```

当前 AutoJs6 类代理:

```text
GlobalAppContext
AccessibilityBridge
UiSelector
ApkBuilder
UiObject
UiObjectCollection
Crypto
EventEmitter
MutableOkHttp
ColorDetector
ColorTable
ImageWrapper
Mat
DynamicLayoutInflater
ContinuationResult
ContinuationCreator
JavaScriptEngine
PFile
Pref
ProxyJavaObject
ProxyObject
ScriptRuntime
AppUtils
ScreenMetrics
Shell
ScriptInterruptedException
JavaScriptSource
ThemeColor
App
AndroidUtils
ArrayUtils
ColorUtils
ConsoleUtils
DeviceUtils
DisplayUtils
IntentUtils
JavaUtils
NetworkUtils
NotificationUtils
RhinoUtils
RootMode
RootUtils
StringUtils
TextUtils
BuildConfig
VolatileBox
TopLevelScope
ScriptEngineService
```

当前 OpenCV, Rhino 和兼容别名类代理:

```text
Imgproc
Imgcodecs
CvType
EvaluatorException
Image
```

`Image` 是 `ImageWrapper` 的兼容别名.

当前 UI 控件类代理:

```text
JsAppBarLayout
JsButton
JsCanvasView
JsCardView
JsCheckBox
JsConsoleView
JsDatePicker
JsDrawerLayout
JsEditText
JsFloatingActionButton
JsFrameLayout
JsGridView
JsImageButton
JsImageView
JsLinearLayout
JsListView
JsProgressBar
JsRadioButton
JsRadioGroup
JsRatingBar
JsRelativeLayout
JsScrollView
JsSeekBar
JsSpinner
JsSwitch
JsTabLayout
JsTextClock
JsTextView
JsTimePicker
JsToggleButton
JsToolbar
JsViewPager
JsWebView
```

`JsTextView` 在 Android API 级别低于 `26` 时解析为兼容实现 `JsTextViewLegacy`, 其他版本解析为 `JsTextView`.

## [p+] R

在代码中使用 R 类的子类中的静态整数可访问 [应用资源](glossaries#应用资源), 详情参阅 [资源 ID](glossaries#资源-ID) 术语.

### [p+] anim

**`6.2.0`** **`Global`**

动画资源.

定义了预先确定的动画.<br>
补间动画保存在 `res/anim/` 中, 可通过 `R.anim` 属性访问.<br>
帧动画保存在 `res/drawable/` 中, 可通过 `R.drawable` 属性访问.

```js
'ui';

ui.layout(<vertical id="main">
    <vertical width="100" height="100" bg="#00695C"></vertical>
</vertical>);

const AnimationUtils = android.view.animation.AnimationUtils;

const mContentContainer = ui.main;
const mSlideDownAnimation = AnimationUtils.loadAnimation(context, R.anim.slide_down);
mSlideDownAnimation.setDuration(2000);
mContentContainer.startAnimation(mSlideDownAnimation);
```

### [p+] array

**`6.2.0`** **`Global`**

静态资源.

提供数组的 XML 资源.

```js
dialogs.build({
    title: R.string.text_pinch_to_zoom,
    items: R.array.values_editor_pinch_to_zoom_strategy,
    itemsSelectMode: 'single',
    itemsSelectedIndex: defSelectedIndex,
    positive: 'OK',
}).on('single_choice', function (idx, item) {
    toastLog(`${idx}: ${item}`);
}).show();
```

### [p+] bool

**`6.2.0`** **`Global`**

静态资源.

包含布尔值的 XML 资源.

```js
console.log(context.getResources().getBoolean(R.bool.pref_auto_check_for_updates));
```

### [p+] color

**`6.2.0`** **`Global`**

静态资源.

包含颜色值 (十六进制颜色) 的 XML 资源.

```js
console.log(colors.toString(context.getColor(R.color.console_view_warn), 6)); // #1976D2
```

### [p+] dimen

**`6.2.0`** **`Global`**

静态资源.

包含尺寸值 (及度量单位) 的 XML 资源.

```js
console.log(context.getResources().getDimensionPixelSize(R.dimen.textSize_item_property)); // e.g. 28
```

### [p+] drawable

**`6.2.0`** **`Global`**

可绘制资源.

使用位图或 XML 定义各种图形.<br>
保存在 `res/drawable/` 中, 可通过 `R.drawable` 属性访问.

```js
/* 绘制一个淡绿色的铃铛图标. */

'ui';

ui.layout(<vertical bg="#FFFFFF">
    <img id="img" tint="#9CCC65"/>
</vertical>);

ui.img.setImageResource(R.drawable.ic_ali_notification);
```

### [p+] id

**`6.2.0`** **`Global`**

静态资源.

为应用资源和组件提供唯一标识符的 XML 资源.

```js
'ui';

ui.layout(<vertical bg="#FFFFFF">
    <text id="txt" size="30"/>
</vertical>);

let childCount = ui.txt.getRootView().findViewById(R.id.action_bar_root).getChildCount(); // e.g 2
ui.txt.setText(`Child count is ${childCount}`);
```

### [p+] integer

**`6.2.0`** **`Global`**

静态资源.

包含整数值的 XML 资源.

```js
console.log(context.getResources().getInteger(R.integer.layout_node_info_view_decoration_line)); // 2
```

### [p+] layout

**`6.2.0`** **`Global`**

布局资源.

定义应用界面的布局.<br>
保存在 `res/layout/` 中, 可通过 `R.layout` 属性访问.

```js
'ui';

activity.setContentView(R.layout.activity_log);
```

### [p+] menu

**`6.2.0`** **`Global`**

菜单资源.

定义应用菜单的内容.<br>
保存在 `res/menu/` 中, 可通过 `R.menu` 属性访问.

```js
'ui';

ui.layout(<vertical bg="#FFFFFF">
    <text id="txt" size="30"/>
</vertical>);

const PopupMenu = android.widget.PopupMenu;

let childCount = ui.txt.getRootView().findViewById(R.id.action_bar_root).getChildCount(); // e.g 2
ui.txt.setText(`Child count is ${childCount}`);

let popupMenu = new PopupMenu(context, ui.txt);
popupMenu.inflate(R.menu.menu_script_options);
popupMenu.show();
```

### [p+] plurals

**`6.2.0`** **`Global`**

静态资源.

定义资源复数形式.

```js
console.log(context.getResources().getQuantityString(
    R.plurals.text_already_stop_n_scripts,
    new java.lang.Integer(1),
    new java.lang.Integer(1))); // e.g. 1 script stopped
console.log(context.getResources().getQuantityString(
    R.plurals.text_already_stop_n_scripts,
    new java.lang.Integer(3),
    new java.lang.Integer(3))); // e.g. 3 scripts stopped
```

### [p+] string

**`6.2.0`** **`Global`**

字符串资源.

定义字符串.<br>
保存在 `res/values/` 中, 可通过 `R.string` 属性访问.

```js
console.log(context.getString(R.string.app_name)); // AutoJs6
```

### [p+] strings

**`6.2.0`** **`Global`**

字符串资源.

同 [R.string](#p-string).<br>
因 `TypeScript Declarations (TS 声明文件)` 中, `string` 为保留关键字, 不能作为类名使用, 为了使 `IDE` 实现智能补全, 特提供 `R.strings` 别名类.

```js
console.log(context.getString(R.strings.app_name)); // AutoJs6
console.log(context.getString(R.string.app_name)); /* 同上, 但 IDE 无法智能补全. */
```

### [p+] style

**`6.2.0`** **`Global`**

样式资源.

定义界面元素的外观和格式.<br>
保存在 `res/values/` 中, 可通过 `R.style` 属性访问.

```js
'ui';

const MaterialDialog = com.afollestad.materialdialogs.MaterialDialog;
const ContextThemeWrapper = android.view.ContextThemeWrapper;

new MaterialDialog.Builder(new ContextThemeWrapper(activity, R.style.Material3DarkTheme))
    .title('Hello')
    .content('This is a test for showing a dialog with material 3 dark theme.')
    .positiveText('OK')
    .onPositive(() => ui.finish())
    .cancelable(false)
    .build()
    .show();
```
