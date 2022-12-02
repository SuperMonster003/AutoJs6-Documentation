# 全局对象 (Global)

---

<p style="font: italic 1em sans-serif; color: #78909C">此章节待补充或完善...</p>
<p style="font: italic 1em sans-serif; color: #78909C">Marked by SuperMonster003 on Nov 20, 2022.</p>

---

在 JavaScript 中, [几乎一切都是对象](https://stackoverflow.com/questions/9108925/how-is-almost-everything-in-javascript-an-object/).  
此处的全局 "对象" 包括 [ 变量 / 方法 / 构造器 ] 等.  
全局对象随处可用, 包括 ECMA 标准内置对象 (如 [ Number / RegExp / String ] 等).

AutoJs6 的内置模块均支持全局使用, 如 `app`, `images`, `device` 等.

为便于使用, 一些 AutoJs6 模块中的方法也被全局化,  
如 `images.captureScreen()`, `dialogs.alert()`, `app.launch()` 等.  
全局化方法均以 `Global` 标签标注.

脚本文件可直接运行使用, 也可作为模块被导入使用 (`require` 方法).  
当作为模块使用时, `exports` 和 `module` 可作为全局对象使用.  
另在 UI 模式下也有一些专属全局对象, 如 `activity`.

## 覆写保护

AutoJs6 对部分全局对象及内置模块增加了覆写保护.  
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

`runtime.topLevelScope` 本身有 `"global"` 属性, 因此全局对象 `global` 也一样拥有:

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

如果 global 对象被意外重写 (虽然概率很低),  
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

## [m] sleep

### sleep(millis)

**`Overload 1/3`** **`Non-UI`**

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

**`6.2.0`** **`Overload 2/3`** **`Non-UI`**

- **millisMin** { [number](dataTypes#number) } - 休眠时间下限 (毫秒)
- **millisMax** { [number](dataTypes#number) } - 休眠时间上限 (毫秒)
- <ins>**returns**</ins> { [void](dataTypes#void) }

使当前线程休眠一段时间, 该时间随机落在 millisMin 和 millisMax 之间.

```js
/* 随机休眠 3 - 5 秒钟. */
sleep(3e3, 5e3);
```

### sleep(millis, bounds)

**`6.2.0`** **`Overload 3/3`** **`Non-UI`**

- **millis** { [number](dataTypes#number) } - 休眠时间 (毫秒)
- **bounds** { [NumberString](dataTypes#NumberString) | [string](dataTypes#string) } - 浮动值
- <ins>**returns**</ins> { [void](dataTypes#void) }

使当前线程休眠一段时间, 该时间随机落在 millis ± bounds 之间.  
bounds 参数为 [数字字符串](dataTypes#NumberString) 类型 (如 "12"), 或在字符串开头附加 "±" 明确参数含义 (如 "±12").

```js
/* 随机休眠 3 - 5 秒钟 (即 4 ± 1 秒钟). */
sleep(4e3, "1e3");
sleep(4e3, "±1e3"); /* 同上. */
```

---

## [m] currentPackage

### currentPackage()

**`A11Y`**

- <ins>**returns**</ins> { [string](dataTypes#string) }

获取最近一次监测到的应用包名, 并视为当前正在运行的应用包名.

---

## [m] currentActivity

### currentActivity()

**`A11Y`**

- <ins>**returns**</ins> { [string](dataTypes#string) }

获取最近一次监测到的活动名称, 并视为当前正在运行的活动名称.

---

## [m] setClip

### setClip(text)

- **text** { [string](dataTypes#string) } - 剪贴板内容
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置系统剪贴板内容.

> 参阅: [getClip](#m-getclip)

---

## [m] getClip

### getClip()

- <ins>**returns**</ins> { [string](dataTypes#string) } - 系统剪贴板内容

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

---

## [m+] toast

### toast(text)

**`Overload 1/4`** **`Async`**

- **text** { [string](dataTypes#string) } - 消息内容
- <ins>**returns**</ins> { [void](dataTypes#void) }

显示一个 [消息浮动框](https://developer.android.com/guide/topics/ui/notifiers/toasts?hl=zh-cn).

消息框的显示默认是依次进行的:

```js
/* 显示消息框 2 秒钟. */
toast("hello");
/* 显示消息框 2 秒钟, 且在前一个消息框消失后才显示. */
toast("world");
/* 显示消息框 2 秒钟, 且在前一个消息框消失后才显示. */
toast("hello world");
```

### toast(text, isLong)

**`Overload 2/4`** **`Async`**

- **text** { [string](dataTypes#string) } - 消息内容
- **isLong = false** { "long" | "l" | "short" | "s" | [boolean](dataTypes#boolean) } - 是否以较长时间显示
- <ins>**returns**</ins> { [void](dataTypes#void) }

控制单个消息框显示时长:

```js
toast("hello", 'long'); /* 显示消息框 3.5 秒钟. */
toast("hello", true); /* 同上. */
```

> 注: 仅有 [ 长 / 短 ] 两种时长, 此时长由安卓系统决定.  
> 通常, 短时为 2 秒, 长时为 3.5 秒.

### toast(text, isLong, isForcible)

**`Overload 3/4`** **`Async`**

- **text** { [string](dataTypes#string) } - 消息内容
- **isLong = false** { "long" | "l" | "short" | "s" | [boolean](dataTypes#boolean) } - 是否以较长时间显示
- **isForcible = false** { "forcible" | "f" | [boolean](dataTypes#boolean) } - 是否强制覆盖显示
- <ins>**returns**</ins> { [void](dataTypes#void) }

使用 "强制覆盖显示" 参数可立即显示消息框:

```js
toast("hello");
/* 显示消息框 2 秒钟, 且立即显示, 前一个消息框 "hello" 被 "覆盖". */
toast("world", "short", "forcible");
```

> 注: 强制覆盖仅对当前脚本有效, 对其他脚本及应用程序无效.

### toast(text, isForcible)

**`Overload 4/4`** **`Async`**

- **text** { [string](dataTypes#string) } - 消息内容
- **isForcible** { "forcible" | "f" } - 强制覆盖显示 (字符标识)
- <ins>**returns**</ins> { [void](dataTypes#void) }

此方法相当于忽略 isLong 参数:

```js
toast("hello");
/* 显示消息框 2 秒钟, 且立即显示, 前一个消息框 "hello" 被 "覆盖". */
toast("world", "forcible");
```

> 注: 此方法的 isForcible 参数只能为具有明确意义的字符标识, 不能为 boolean 类型或其他类型, 否则 isForcible 将被视为 isLong.

### toast.dismissAll()

- <ins>**returns**</ins> { [void](dataTypes#void) }

强制取消显示所有消息框.

```js
toast("hello");
toast("world");
toast("of");
toast("JavaScript");

sleep(1e3);

/* "hello" 显示 1 秒后消失, "world" 及其他消息框均不再显示. */
/* 若无 sleep 语句, 由于 toast 是异步的, 上述消息框均不会显示. */
toast.dismissAll();

/* dismissAll 仅对已在队列中的消息框有效, 因此下述消息框正常显示. */
toast("forcibly dismissed");
```

> 注: 强制取消显示仅对当前脚本有效, 对其他脚本及应用程序无效.

---

## [m] toastLog

显示消息浮动框并在控制台打印消息.  
相当于以下代码组合:

```js
toast(text, ...args);
console.log(text);
```

因此, 方法重载与 [toast](#m-toast) 完全一致.

> 注: 虽然 toast 方法异步, 但 console.log 方法同步, 因此 toastLog 方法也为同步.

### toastLog(text)

**`Overload 1/4`**

- **text** { [string](dataTypes#string) } - 消息内容
- <ins>**returns**</ins> { [void](dataTypes#void) }

> 参阅: [toast(text)](#toasttext)

### toastLog(text, isLong)

**`Overload 2/4`**

- **text** { [string](dataTypes#string) } - 消息内容
- **isLong = false** { "long" | "l" | "short" | "s" | [boolean](dataTypes#boolean) } - 是否以较长时间显示
- <ins>**returns**</ins> { [void](dataTypes#void) }

> 参阅: [toast(text, isLong)](#toasttext-islong)

### toastLog(text, isLong, isForcible)

**`Overload 3/4`**

- **text** { [string](dataTypes#string) } - 消息内容
- **isLong = false** { "long" | "l" | "short" | "s" | [boolean](dataTypes#boolean) } - 是否以较长时间显示
- **isForcible = false** { "forcible" | "f" | [boolean](dataTypes#boolean) } - 是否强制覆盖显示
- <ins>**returns**</ins> { [void](dataTypes#void) }

> 参阅: [toast(text, isLong, isForcible)](#toasttext-islong-isforcible)

### toastLog(text, isForcible)

**`Overload 4/4`**

- **text** { [string](dataTypes#string) } - 消息内容
- **isForcible** { "forcible" | "f" } - 强制覆盖显示 (字符标识)
- <ins>**returns**</ins> { [void](dataTypes#void) }

> 参阅: [toast(text, isForcible)](#toasttext-isforcible)

---

## [m] wait

### wait(condition)

**`6.2.0`** **`Overload 1/6`** **`A11Y?`** **`Non-UI`**

- **condition** { [(() => any)](dataTypes#function) | [PickupSelector](dataTypes#pickupselector) } - 结束等待条件
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

阻塞等待, 直到条件满足.  
默认等待时间为 10 秒, 条件检查间隔为 200 毫秒.  
若超时, 放弃等待, 并返回特定的条件超时结果 (如 false).  
若超时之前条件得以满足, 结束等待, 并返回特定的条件满足结果 (如 true).

> 注: 不同于 while 和 for 等循环语句的 "条件",  
> 该方法的条件是结束等待条件, 只要不满足条件, 就一直等待.  
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
wait("立即开始");
wait(content("立即开始")); /* 同上. */
wait({ content: "立即开始" }); /* 同上. */

/* 对比上述函数方式. */
wait(() => content("立即开始").exists());
wait(() => pickup("立即开始", "?")); /* 同上. */
```

等待条件的满足与否, 与函数返回值有关.  
例如当函数返回 true 时, 等待条件即满足.

下面列出不满足条件的几种返回值:  
[ [false](dataTypes#boolean) / [null](dataTypes#null) / [undefined](dataTypes#undefined) / [NaN](https://developer.mozilla.org/zh-CN/docs/Glossary/NaN/) ]  
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

**`6.2.0`** **`Overload 2/6`** **`A11Y?`** **`Non-UI`**

- **condition** { [(() => any)](dataTypes#function) | [PickupSelector](uiSelectorType#m-pickup) } - 结束等待条件
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

[wait(condition)](#waitcondition) 增加条件检测限制.  
达到限制后, 表示等待超时, 并放弃等待.  
限制分为 "次数限制" (limit < 100) 和 "时间限制" (limit >= 100).

```js
/* 等待屏幕关闭, 最多检测屏幕状态 20 次. */
wait(() => device.isScreenOff(), 20); /* limit < 100, 视为次数限制. */
/* 等待屏幕关闭, 最多检测屏幕状态 5 秒钟. */
wait(() => device.isScreenOff(), 5e3); /* limit >= 100, 视为时间限制. */
```

### wait(condition, limit, interval)

**`6.2.0`** **`Overload 3/6`** **`A11Y?`** **`Non-UI`**

- **condition** { [(() => any)](dataTypes#function) | [PickupSelector](uiSelectorType#m-pickup) } - 结束等待条件
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- **interval** { [number](dataTypes#number) } - 等待条件检测间隔
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

[wait(condition, limit)](#waitcondition-limit) 增加条件检测间隔.  
只要条件不满足, wait() 方法会持续检测, 直到条件满足或达到检测限制.  
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

> 注: 在最后一次条件检查之后, 将不再发生间歇.  
> 包括条件满足或达到检测限制.
>
> 例如在第三次检查时, 条件满足:  
> 检查 (×) - 间歇 - 检查 (×) - 间歇 - 检查 (√) - 立即结束 wait()

### wait(condition, callback)

**`6.2.0`** **`Overload 4/6`** **`A11Y?`** **`Non-UI`**

- **condition** { [(() => T)](dataTypes#function) | [PickupSelector](uiSelectorType#m-pickup) } - 结束等待条件
- **callback** {{
    - then?(result?: [T](dataTypes#generic)): [R](dataTypes#generic)
    - else?(result?: [T](dataTypes#generic)): [R](dataTypes#generic)
- }} - 等待结束回调对象
- <ins>**returns**</ins> { [R](dataTypes#generic) extends [void](dataTypes#void) ? [boolean](dataTypes#boolean) : [R](dataTypes#generic) }
- <ins>**template**</ins> [T](dataTypes#generic), [R](dataTypes#generic)

[wait(condition)](#waitcondition) 增加回调对象.

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

> 注: else 回调方法的参数只能是 [ [false](dataTypes#boolean) / [null](dataTypes#null) / [undefined](dataTypes#undefined) / [NaN](https://developer.mozilla.org/zh-CN/docs/Glossary/NaN/) ],  
> 因此 else 的参数几乎不会用到.

需特别注意, 回调方法的返回值具有穿透性.  
在回调方法内使用 return 语句, 将直接影响 wait() 的返回值 (undefined 除外).

上述示例中, then 和 else 回调都没有返回值, 因此 wait() 返回值是 boolean 类型, 表示等待条件是否满足.  
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

上述示例如果等待条件满足, 则返回 then 的返回值 (number 类型),  
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

**`6.2.0`** **`Overload 5/6`** **`A11Y?`** **`Non-UI`**

- **condition** { [(() => T)](dataTypes#function) | [PickupSelector](uiSelectorType#m-pickup) } - 结束等待条件
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- **callback** {{
    - then?(result?: [T](dataTypes#generic)): [R](dataTypes#generic)
    - else?(result?: [T](dataTypes#generic)): [R](dataTypes#generic)
- }} - 等待结束回调对象
- <ins>**returns**</ins> { [R](dataTypes#generic) extends [void](dataTypes#void) ? [boolean](dataTypes#boolean) : [R](dataTypes#generic) }
- <ins>**template**</ins> [T](dataTypes#generic), [R](dataTypes#generic)

[wait(condition, callback)](#waitcondition-callback) 增加条件检测限制.

> 参阅: [wait(condition, limit)](#waitcondition-limit)

### wait(condition, limit, interval, callback)

**`6.2.0`** **`Overload 6/6`** **`A11Y?`** **`Non-UI`**

- **condition** { [(() => T)](dataTypes#function) | [PickupSelector](uiSelectorType#m-pickup) } - 结束等待条件
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- **interval** { [number](dataTypes#number) } - 等待条件检测间隔
- **callback** {{
    - then?(result?: [T](dataTypes#generic)): [R](dataTypes#generic)
    - else?(result?: [T](dataTypes#generic)): [R](dataTypes#generic)
- }} - 等待结束回调对象
- <ins>**returns**</ins> { [R](dataTypes#generic) extends [void](dataTypes#void) ? [boolean](dataTypes#boolean) : [R](dataTypes#generic) }
- <ins>**template**</ins> [T](dataTypes#generic), [R](dataTypes#generic)

[wait(condition, limit, callback)](#waitcondition-callback) 增加条件检测间隔.

> 参阅: [wait(condition, limit, interval)](#waitcondition-limit-interval)

---

## [m] waitForActivity

等待指定名称的 Activity 出现 (前置).  
此方法相当于 `wait(() => currentActivity() === activityName, ...args)`,  
因此其所有重载方法的结构与 wait 一致.  
为节约篇幅, 将仅列出方法签名等重要信息.

### waitForActivity(activityName)

**`6.2.0`** **`Overload 1/6`** **`A11Y?`** **`Non-UI`**

- **activityName** { [string](dataTypes#string) } - 目标活动名称
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

> 参阅:[wait(condition)](#waitcondition)

### waitForActivity(activityName, limit)

**`6.2.0`** **`Overload 2/6`** **`A11Y?`** **`Non-UI`**

- **activityName** { [string](dataTypes#string) } - 目标活动名称
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

> 参阅:[wait(condition, limit)](#waitcondition-limit)

### waitForActivity(activityName, limit, interval)

**`6.2.0`** **`Overload 3/6`** **`A11Y?`** **`Non-UI`**

- **activityName** { [string](dataTypes#string) } - 目标活动名称
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- **interval** { [number](dataTypes#number) } - 等待条件检测间隔
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

> 参阅:[wait(condition, limit, interval)](#waitcondition-limit-interval)

### waitForActivity(activityName, callback)

**`6.2.0`** **`Overload 4/6`** **`A11Y?`** **`Non-UI`**

- **activityName** { [string](dataTypes#string) } - 目标活动名称
- **callback** {{
    - then?(result?: [T](dataTypes#generic)): [R](dataTypes#generic)
    - else?(result?: [T](dataTypes#generic)): [R](dataTypes#generic)
- }} - 等待结束回调对象
- <ins>**returns**</ins> { [R](dataTypes#generic) extends [void](dataTypes#void) ? [boolean](dataTypes#boolean) : [R](dataTypes#generic) }
- <ins>**template**</ins> [T](dataTypes#generic), [R](dataTypes#generic)

> 参阅: [wait(condition, callback)](#waitcondition-callback)

### waitForActivity(activityName, limit, callback)

**`6.2.0`** **`Overload 5/6`** **`A11Y?`** **`Non-UI`**

- **activityName** { [string](dataTypes#string) } - 目标活动名称
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- **callback** {{
    - then?(result?: [T](dataTypes#generic)): [R](dataTypes#generic)
    - else?(result?: [T](dataTypes#generic)): [R](dataTypes#generic)
- }} - 等待结束回调对象
- <ins>**returns**</ins> { [R](dataTypes#generic) extends [void](dataTypes#void) ? [boolean](dataTypes#boolean) : [R](dataTypes#generic) }
- <ins>**template**</ins> [T](dataTypes#generic), [R](dataTypes#generic)

> 参阅: [wait(condition, limit, callback)](#waitcondition-limit-callback)

### waitForActivity(activityName, limit, interval, callback)

**`6.2.0`** **`Overload 6/6`** **`A11Y?`** **`Non-UI`**

- **activityName** { [string](dataTypes#string) } - 目标活动名称
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- **interval** { [number](dataTypes#number) } - 等待条件检测间隔
- **callback** {{
    - then?(result?: [T](dataTypes#generic)): [R](dataTypes#generic)
    - else?(result?: [T](dataTypes#generic)): [R](dataTypes#generic)
- }} - 等待结束回调对象
- <ins>**returns**</ins> { [R](dataTypes#generic) extends [void](dataTypes#void) ? [boolean](dataTypes#boolean) : [R](dataTypes#generic) }
- <ins>**template**</ins> [T](dataTypes#generic), [R](dataTypes#generic)

> 参阅: [wait(condition, limit, interval, callback)](#waitcondition-limit-interval-callback)

---

## [m] waitForPackage

等待指定包名的应用出现 (前置).  
此方法相当于 `wait(() => currentPackage() === packageName, ...args)`,  
因此其所有重载方法的结构与 wait 一致.  
为节约篇幅, 将仅列出方法签名等重要信息.

### waitForPackage(packageName)

**`6.2.0`** **`Overload 1/6`** **`A11Y?`** **`Non-UI`**

- **packageName** { [string](dataTypes#string) } - 目标应用包名
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

> 参阅:[wait(condition)](#waitcondition)

### waitForPackage(packageName, limit)

**`6.2.0`** **`Overload 2/6`** **`A11Y?`** **`Non-UI`**

- **packageName** { [string](dataTypes#string) } - 目标应用包名
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

> 参阅:[wait(condition, limit)](#waitcondition-limit)

### waitForPackage(packageName, limit, interval)

**`6.2.0`** **`Overload 3/6`** **`A11Y?`** **`Non-UI`**

- **packageName** { [string](dataTypes#string) } - 目标应用包名
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- **interval** { [number](dataTypes#number) } - 等待条件检测间隔
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

> 参阅:[wait(condition, limit, interval)](#waitcondition-limit-interval)

### waitForPackage(packageName, callback)

**`6.2.0`** **`Overload 4/6`** **`A11Y?`** **`Non-UI`**

- **packageName** { [string](dataTypes#string) } - 目标应用包名
- **callback** {{
    - then?(result?: [T](dataTypes#generic)): [R](dataTypes#generic)
    - else?(result?: [T](dataTypes#generic)): [R](dataTypes#generic)
- }} - 等待结束回调对象
- <ins>**returns**</ins> { [R](dataTypes#generic) extends [void](dataTypes#void) ? [boolean](dataTypes#boolean) : [R](dataTypes#generic) }
- <ins>**template**</ins> [T](dataTypes#generic), [R](dataTypes#generic)

> 参阅: [wait(condition, callback)](#waitcondition-callback)

### waitForPackage(packageName, limit, callback)

**`6.2.0`** **`Overload 5/6`** **`A11Y?`** **`Non-UI`**

- **packageName** { [string](dataTypes#string) } - 目标应用包名
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- **callback** {{
    - then?(result?: [T](dataTypes#generic)): [R](dataTypes#generic)
    - else?(result?: [T](dataTypes#generic)): [R](dataTypes#generic)
- }} - 等待结束回调对象
- <ins>**returns**</ins> { [R](dataTypes#generic) extends [void](dataTypes#void) ? [boolean](dataTypes#boolean) : [R](dataTypes#generic) }
- <ins>**template**</ins> [T](dataTypes#generic), [R](dataTypes#generic)

> 参阅: [wait(condition, limit, callback)](#waitcondition-limit-callback)

### waitForPackage(packageName, limit, interval, callback)

**`6.2.0`** **`Overload 6/6`** **`A11Y?`** **`Non-UI`**

- **packageName** { [string](dataTypes#string) } - 目标应用包名
- **limit** { [number](dataTypes#number) } - 等待条件检测限制
- **interval** { [number](dataTypes#number) } - 等待条件检测间隔
- **callback** {{
    - then?(result?: [T](dataTypes#generic)): [R](dataTypes#generic)
    - else?(result?: [T](dataTypes#generic)): [R](dataTypes#generic)
- }} - 等待结束回调对象
- <ins>**returns**</ins> { [R](dataTypes#generic) extends [void](dataTypes#void) ? [boolean](dataTypes#boolean) : [R](dataTypes#generic) }
- <ins>**template**</ins> [T](dataTypes#generic), [R](dataTypes#generic)

> 参阅: [wait(condition, limit, interval, callback)](#waitcondition-limit-interval-callback)

---

## [m] exit

### exit()

停止脚本运行.

通过抛出 `ScriptInterruptedException` 异常实现脚本停止.  
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

如果编写的脚本对 "是否停止" 的状态十分敏感,  
即要求 exit() 之后的代码一定不被执行,  
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
    while (true) log("hello"); /* 控制台不会打印 "hello". */
}
```

除了 [isStopped](#isstopped), 还可通过 threads 或 engines 获取停止状态:

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

---

## [m] random

### random()

- <ins>**returns**</ins> { [number](dataTypes#number) }

与 Math.random() 相同, 返回落在 [0, 1) 区间的随机数字.

### random(min, max)

- **min** { [number](dataTypes#number) } - 随机数下限
- **max** { [number](dataTypes#number) } - 随机数上限
- <ins>**returns**</ins> { [number](dataTypes#number) }

返回落在 [min, max] 区间的随机数字.

> 注: random(min, max) 右边界闭合, 而 random() 右边界开放.

---

## [m] requiresApi

### requiresApi(api)

- **api** { [number](dataTypes#number) } - 安卓 API 级别

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
> - [util.versionCodes](util#versioncodes)

---

## [m] requiresAutojsVersion

### requiresAutojsVersion(versionName)

- **versionName** { [string](dataTypes#string) } - AutoJs6 版本名称
- <ins>**returns**</ins> { [void](dataTypes#void) }

脚本运行的最低 AutoJs6 版本要求 (版本名称).

```js
requiresAutojsVersion("6.2.0");
```

可通过 `autojs.versionName` 查看 AutoJs6 版本名称.

> 参阅: [autojs.versionName](autojs#versionname)

### requiresAutojsVersion(versionCode)

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

- **pkg** { ...( [string](dataTypes#string) | [object](dataTypes#object) ) } - 需导入的 Java 包
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

- **cls** { ...( [string](dataTypes#string) | [object](dataTypes#object) ) } - 需导入的 Java 类
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

## [m] isStopped

### isStopped()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

检测脚本当前线程是否已停止.

## [m] selector

### selector()

- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

构建一个 "空" [选择器](uiSelectorType).