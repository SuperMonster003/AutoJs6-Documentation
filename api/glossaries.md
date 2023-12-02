# 术语 (Glossaries)

---

<p style="font: italic 1em sans-serif; color: #78909C">此章节待补充或完善...</p>
<p style="font: italic 1em sans-serif; color: #78909C">Marked by SuperMonster003 on Oct 22, 2022.</p>

---

## 内置模块

AutoJs6 内置模块指脚本可全局使用的 JavaScript 模块.  
这些模块多数已在文档中列出, 如 `app`, `images`, `device` 等.

### 查看内置模块源代码

除 [直接查看开源代码](http://project.autojs6.com/tree/master/app/src/main/assets/modules) 外, 还可以将内置模块解压到本地存储后查看:  
下载 [AutoJs6 APK](http://download.autojs6.com) 并使用压缩软件将 APK 内的 `\assets\modules` 文件夹解压到本地.  
模块通常以 `__%name%__.js` 格式命名, 其中 `%name%` 对应模块名.  
可使用文本编辑器等软件查看模块源代码.

### 修改或增加内置模块

> 注: 此小节内容可能需要用户具备一定的编程基础及开发经验.

> 注: 此操作需要重新打包生成 `新的 AutoJs6 APK` (下文作 `新生 APK`).  
> 因 `新生 APK` 包名发生变化, 需卸载已安装的 `开源 AutoJs6 APK` (下文作 `开源 APK`) 后再安装 `新生 APK`.  
> 当 `开源 APK` 出现新版本时, 同样需卸载 `新生 APK` 才能安装新版本的 `开源 APK`.  
> 此时, 修改或增加的内置模块将失效.  
> 如欲将自己的代码整合到 `开源 APK` 中, 可向开源项目提交 [Pull Request (PR)](http://pr.autojs6.com).

克隆 (Clone) [AutoJs6 源码](http://project.autojs6.com).  
使用 [Android Studio](https://developer.android.com/studio/archive) 打开并完成项目构建 (Build).  
定位 `\app\src\main\assets\modules` 目录.

#### 修改模块

修改目录中的模块代码后直接打包生成新的 APK.

#### 增加模块

以增加一个 date 模块为例, 该模块有一个 `date.toFullTimeString()` 方法.

在 `\app\src\main\assets\modules` 目录新建 `__date__.js` 文件, 此文件将作为增加的内置模块.

供参考的文件内容:

```js
module.exports = function () {
    return {
        toFullTimeString() {
            let now = new Date();
            let pad = x => x.toString().padStart(2, '0');
            return [ now.getHours(), now.getMinutes(), now.getSeconds() ].map(pad).join(':');
        },
    };
};
```

打开 "初始化脚本", 即 `\app\src\main\assets\init.js`.  
将 date 模块添加到 "初始化脚本" 中:

```js
/* ... */

let $ = {
    /* ... */
    bindModules() {
        _.bind([
            /* ... */

            [ 'date', 'RootAutomator', 'floaty', /* 其他模块... */ ],

            /* ... */
        ]);
    },
    /* ... */
};

/* ... */
```

添加完成后即可打包生成新的 APK.

## 编译器

语法编译器是一个能够逐行读取代码的程序.  
它了解代码如何匹配编程语言所定义的语法, 以及代码应该做什么.

## JavaScript 引擎

JavaScript 引擎是一个计算机程序.  
它接收 JavaScript 源代码并将其编译成 CPU 可以理解的二进制指令 (机器码).

### 引擎与运行环境

运行环境也称为运行时环境, 引擎需要在运行环境中

JavaScript 引擎通常由浏览器供应商开发, 主流浏览器通常有自己开发的引擎:

- Chrome - V8
- Firefox - SpiderMonkey
- IE - Chakra

## 运行时

即 `Runtime`.

Runtime 是一个通用术语, 指代码运行所需的 [ 库 / 框架 / 平台 ].

> 参阅: [runtime](runtime) (全局对象)

## 上下文

Context.

> 参阅: [context](context) (全局对象)

## 字符串模式

表示需要匹配指定正则表达式的字符串.

如字符串模式为 `/\d/`, 则要求给定的字符串 `str` 满足以下语句:

```js
/\d/.test(str) === true;
```

因此以下示例均满足要求:  
`'1'`, `'1a'`, `'a1'`, `"hello 2011"`.

字符串模式支持正则表达式的 [标记参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions#%E9%80%9A%E8%BF%87%E6%A0%87%E5%BF%97%E8%BF%9B%E8%A1%8C%E9%AB%98%E7%BA%A7%E6%90%9C%E7%B4%A2), 如 `/hello/i`.

## NaN

NaN 表示 "不是一个数字", 即 **N**ot **A** **N**umber.

NaN 是一个数值, 在 JavaScript 中可以使用 `isNaN` 或 `Number.isNaN` 检测:

```js
let n = 0 / 0;
isNaN(n); // true
Number.isNaN(n); // true

let m = null;
isNaN(m); // false
Number.isNaN(m); // false

let l = undefined;
isNaN(l); // true
Number.isNaN(l); // false
```

> 参阅: [MDN #术语](https://developer.mozilla.org/zh-CN/docs/Glossary/NaN/) / [MDN #全局对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN/) / [isNaN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isNaN) / [Number.isNaN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN)

## 正则表达式

也作 [ 正则 / Regular Expression / RegEx / REGEX / RegExp / REX (非正式) ] 等.

正则表达式字面量在 JavaScript 中用一对 `/` 符号表示,  
如 `/\d/`, `/^[0-9a-f]{6}$/`, `/[bc]+?(?=y{2,})/i` 等.

> 参阅: [MDN #指南](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)

## Truthy

Truthy (真值) 指 `Boolean(truthy)` 返回 `true` 的值.  
从另一个角度看, [Falsy (假值)](#falsy) 以外的任何值都为真值.

> 参阅: [MDN #术语](https://developer.mozilla.org/zh-CN/docs/Glossary/Truthy/)

## Falsy

目前 (2022/08), JavaScript 共有 8 个 Falsy (假值):

1. false ([boolean](dataTypes#boolean))
2. 0 ([number](dataTypes#number))
3. -0 ([number](dataTypes#number))
4. 0n ([bigint](#bigint))
5. [空字符串](#空字符串)
6. [null](dataTypes#null)
7. [undefined](dataTypes#undefined)
8. [NaN](#nan)

需留意 `0` 与 `-0` 是不同的值:

```js
0 === -0; // true
Object.is(0, -0); // false
Object.is(0n, -0n); // true

let n = -0;
n.toString(); // "0"
Object.is(n, -0) ? `-${n}` : `${n}`; // "-0"
```

> 参阅: [MDN #术语](https://developer.mozilla.org/zh-CN/docs/Glossary/Falsy/) / [Object.is](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

## 空字符串

通常用 `""` 表示空字符串, 它是一个长度为 0 的 string 类型数据.

以下几种表示方式均可代表空字符串:

```js
[ "", '', ``, String() ];
```

## BigInt

一种可以表示任意精度格式整数的数字类型.

如 `3n`, `16777216n`, `-1n` 均合法.  
如 `3.1n`, `2ne5`, `2e5n` 均不合法.

> 参阅: [MDN #术语](https://developer.mozilla.org/zh-CN/docs/Glossary/BigInt) / [MDN #全局对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

## 枚举

枚举是组织收集有关联变量的一种方式, 许多程序语言如 [ C / C# / Java ] 等都有枚举数据类型.

## 内置对象

又称 [ 原生对象 / 标准内置对象 ], 内置对象与宿主无关, 是独立于宿主环境的 ECMAScript 实现提供的对象.  
它们在 ECMAScript 程序开始执行前就存在, 本身就是实例化内置对象, 开发者无需再去实例化.  
内置对象是原生对象的子集, 如常用的 [ Object / Function / Array / String / Boolean / Number / Date / RegExp / Error / Math / JSON ] 等都是内置对象.

> 参阅: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects)

## 内置对象扩展

对 [内置对象](#内置对象) 的扩展主要有两种类型, 属性扩展及原型扩展.

属性扩展:

```js
Object.saySomething = function (content) {
    console.log(content);
};

Math.sum = function (x, y) {
    return +x + +y;
};
```

调用时直接使用 `A.b` 形式:

```js
Object.saySomething("hello"); /* print "hello". */
console.log(Math.sum(2, 3)); // 5
```

原型扩展:

```js
Array.prototype.sorted = function () {
    return this.slice().sort();
};
Number.prototype.toFixedNum = function (fraction) {
    return +this.toFixed(fraction);
};
```

调用时可在相应对象实例上使用:

```js
let arr = [ 1, 2, 9, 3 ];
console.log(arr.sorted()); // [ 1, 2, 3, 9 ]
console.log(arr); // [ 1, 2, 9, 3 ]

let num = 375.201;
console.log(num.toFixed(2)); // "375.20"
console.log(num.toFixedNum(2)); // 375.2
```

上述扩展均为自定义扩展, 它们实现了自定义的属性或方法, 往往是针对个人项目使用的.  
而针对 ECMAScript 规范中的新功能的扩展, 则被称为 [填泥 (Polyfill)](#polyfill).

> 注: 扩展内置对象往往是 **危险** 的.
>
> 扩展 JavaScript 原生对象意味着将属性或方法添加到其原型或内置对象上,  
> 其潜在的危险包括但不限于以下几种情况:
>
> 1. 无意中修改或覆盖了 JavaScript 标准的内置方法
> 2. 自定义扩展方法被定义者或合作开发者修改后需修改大量依赖代码甚至出错
> 3. 导入库时可能存在与本地同名扩展方法冲突
> 4. 导入多个库时可能存在库之间的同名扩展方法冲突
> 5. 未来标准更新后可能与已有扩展方法冲突
>
> 因此建议使用模块化编程替代对象扩展.  
> 如确实有对象扩展需求, 建议新建一个与原生对象名称相似但不同的对象进行扩展, 如下文示例.

上述扩展方式均可采用更安全 (但使用起来可能相对复杂) 的方式实现:

```js
let Objectx = {};

Objectx.saySomething = function (content) {
    console.log(content);
};

Objectx.saySomething("hello"); /* print "hello". */

let Mathx = {};

Mathx.sum = function (x, y) {
    return +x + +y;
};

console.log(Mathx.sum(2, 3)); // 5

let Arrayx = {};

Arrayx.sorted = function (arr) {
    return arr.slice().sort();
};

let arr = [ 1, 2, 9, 3 ];
console.log(Arrayx.sorted(arr)); // [ 1, 2, 3, 9 ]

let Numberx = {};

Numberx.toFixedNum = function (num, fraction) {
    return +num.toFixed(fraction);
};

let num = 375.201;
console.log(Numberx.toFixedNum(num, 2)); // 375.2
```

AutoJs6 默认提供了一些内置对象扩展, 如 [ [Arrayx](arrayx), [Numberx](numberx), [Mathx](mathx) ] 等.

这些扩展默认是安全的, 统一为 `Ax.b` 的调用方式,  
如 `Arrayx.intersect`, `Mathx.sum`, `Numberx.clamp`.

```js
console.log(Arrayx.intersect([ 1, 2, 3, 4 ], [ 1, 3, 5 ])); // [ 1, 3 ] 
console.log(Numberx.clamp(Math.random(), [ 0.3, 0.5 ])); // e.g. 0.4251169347959409 
```

而另一种不安全的扩展, 即直接扩展内置对象, 可实现更为便捷的调用:

```js
console.log([ 1, 2, 3, 4 ].intersect([ 1, 3, 5 ])); // [ 1, 3 ]
console.log(Math.random().clamp([ 0.3, 0.5 ])); // e.g. 0.4251169347959409
```

如需默认进行直接扩展, 可选择以下任一方式:

- 在脚本中加入代码片段: `plugins.extendAll();`
- AutoJs6 应用设置 - 扩展性 - JavaScript 内置对象扩展 - [ 启用 ]

进行直接扩展后, 所有扩展属性和方法会按需附加到内置对象或其原型上, 详情参考每个扩展对象的小节内容.  
直接扩展是不安全的, 需谨慎使用.

> 参阅: [StackOverflow](https://stackoverflow.com/questions/14034180/why-is-extending-native-objects-a-bad-practice) / [lucybain.com](https://lucybain.com/blog/2014/js-extending-built-in-objects/)

## Polyfill

又称 [ 代码填泥 / 填泥 / 腻子 / 泥子 ], 是一个完整的代码块, 用于为不支持原生 ECMAScript 新功能的环境提供功能支持.  
详见 [代码填泥](polyfill) 章节.

## Shim

又称 [ 代码垫片 / 垫片 / 填隙片 ], 是一种小型函数库, 可以用来截取 API 调用或修改传入参数, 最后自行处理对应操作或者将操作交由其它地方执行.  
垫片可以在新环境中支持老 API, 也可以在老环境里支持新 API.  
一些程序并没有针对某些平台开发, 也可以通过使用垫片来辅助运行.

Shim 与 Polyfill 的不同, 可参阅 [代码填泥](polyfill) 章节.

## 应用资源

应用资源指代码使用的附加文件和静态内容, 如 [ 位图 / 布局定义 / 界面字符串 / 动画说明 ] 等.

通常, 应用资源与代码是分离的, 以便于独立维护.  
资源可进行分组并放入专门命名的资源目录中, 如 [ animator / color / drawable / layout / values / menu ] 等.  
在运行时, Android 会根据当前配置使用合适的资源, 如根据屏幕尺寸提供不同的界面布局或根据语言设置提供不同的字符串.

将应用资源分离之后, 可使用项目的 R 类中生成的 [资源 ID](#资源-ID) 对其进行访问.

```js
console.log(context.getString(R.string.text_app_name_powerpoint)); // PowerPoint
console.log(R.id.explorer_item_list); /* e.g. 2131296535 */
console.log(`0x${java.lang.Integer.toHexString(R.id.explorer_item_list)}`); /* e.g. 0x7f090117 */
```

> 参阅: [Android Docs](https://developer.android.com/guide/topics/resources/providing-resources?hl=zh-cn)

## 资源 ID

在代码中使用 R 类的子类中的静态整数可访问 [应用资源](#应用资源):

```js
/* 资源 ID 是一个整数. */
console.log(R.string.text_app_name_autojspro); /* e.g. 2131887020 */
```

根据资源类型获取类型值 (string):

```js
console.log(context.getString(R.string.text_app_name_autojspro)); /* e.g. AutoJsPro */
```

根据资源类型获取类型值 (drawable):

```js
/* 绘制一个淡绿色的铃铛图标. */

'ui';

ui.layout(<vertical bg="#FFFFFF">
    <img id="img" tint="#9CCC65"/>
</vertical>);

ui.img.setImageResource(R.drawable.ic_ali_notification);
```

在 XML 中也可访问 `资源 ID`:

```js
/* 绘制一个淡绿色的铃铛图标. */

'ui';

ui.layout(<vertical bg="#FFFFFF">
    <img id="img" tint="#9CCC65" src="@drawable/ic_ali_notification"/>
</vertical>);
```

将 `资源 ID` 的十六进制值与 `0x` 前缀组合, 可作为控件的 [idHex](uiObjectType#m-idhex) 信息:

```js
/* 直接对资源 ID 值组合. */
console.log(`0x${java.lang.Integer.toHexString(R.id.explorer_item_list)}`); /* e.g. 0x7f090117 */

/* 在 AutoJs6 主页找到对应控件并获取其 idHex 值. */
console.log(idMatch(/explorer_item_list/).findOnce().idHex()); /* e.g. 0x7f090117 */
```

## 控件层级

类似 HTML 的层级绘制, 安卓的视图 (View) 嵌套也会形成层级, 外部视图成为其内部视图的父控件 (Parent Node), 内部视图成为外部视图的子控件 (Child Node).

在 AutoJs6 中, 控件由 [UiObject](uiObjectType) 表示.

以下方式可获取当前窗口的控件层级:

- 使用 AutoJs6 获取
    - AutoJs6 主页侧拉抽屉 -> 悬浮窗 [开启] -> 悬浮图标 [点击]
        - 方案 A: 蓝色按钮 [点击] -> (布局范围分析) -> 控件图示 [点击] -> 在布局层次中查看
        - 方案 B: 蓝色按钮 [长按] -> 布局层次分析 [点击]

- 使用 uiautomatorviewer 工具获取
    - 位置 (以 Windows 为例): `"%ANDROID_HOME%\tools\bin\uiautomatorviewer.bat"`

- 使用 Android Studio 的 Layout Inspector 工具获取
    - Android Studio -> Tools -> Layout Inspector

- 使用 ADB Shell 的 dumpsys 指令获取
    - 使用 AutoJs6 执行代码 `console.log(shell('dumpsys activity top').result);`

## 信息集控件

信息集控件指拥有一个非 null 的 [无障碍节点信息集 (AccessibilityNodeInfo.CollectionInfo)](https://developer.android.com/reference/android/view/accessibility/AccessibilityNodeInfo.CollectionInfo) 实例的控件.

```js
let info = w.getCollectionInfo();
console.log(info);
```

信息集控件包含一系列子控件, 它们类似 HTML 表格那样按行列方式分布.  
例如垂直列表是一个信息集控件, 它有一列多行作为子控件; 表格也是一个信息集控件, 它有多列多行作为子控件.  
这些子控件均拥有非 null 的 [无障碍节点子项信息集 (AccessibilityNodeInfo.CollectionItemInfo)](https://developer.android.com/reference/android/view/accessibility/AccessibilityNodeInfo.CollectionItemInfo):

```js
/* 通常, 在 AutoJs6 主页即可获取到至少一个信息集控件. */
scrollable().find().some((w) => {
    let info = w.getCollectionInfo();
    if (info !== null) {

        /* 展示常用的信息集实例属性或方法. */

        console.log(`rowCount: ${info.getRowCount()}`); /* 对应 w.rowCount() 封装方法. */
        console.log(`columnCount: ${info.getColumnCount()}`); /* 对应 w.columnCount() 封装方法. */

        w.children().forEach((c) => {
            let itemInfo = c.getCollectionItemInfo();
            if (itemInfo !== null) {

                /* 展示常用的子项信息集实例属性或方法. */

                console.log(c.bounds());
                console.log(`rowIndex: ${itemInfo.getRowIndex()}`); /* 对应 w.row() 封装方法. */
                console.log(`columnIndex: ${itemInfo.getColumnIndex()}`); /* 对应 w.column() 封装方法. */
                console.log(`rowSpan: ${itemInfo.getRowSpan()}`); /* 对应 w.rowSpan() 封装方法. */
                console.log(`columnSpan: ${itemInfo.getColumnSpan()}`); /* 对应 w.columnSpan() 封装方法. */
                console.log(`selected: ${itemInfo.isSelected()}`);
                console.log(`rowTitle: ${itemInfo.getRowTitle()}`);
                console.log(`columnTitle: ${itemInfo.getColumnTitle()}`);
                console.log('-'.repeat(33));
            }
        });

        return /* @some */ true;
    }
});
```

部分属性或方法:

- `[m#]` getRowCount / `[p#]` rowCount
- `[m#]` getColumnCount / `[p#]` columnCount

常见与信息集存在关联的类:

- android.widget.GridView
- android.widget.ListView
- android.widget.RadioGroup
- com.android.systemui.qs.TileLayout
- androidx.recyclerview.widget.RecyclerView

## 子项信息集控件

子项信息集控件指拥有 [无障碍节点子项信息集 (AccessibilityNodeInfo.CollectionItemInfo)](https://developer.android.com/reference/android/view/accessibility/AccessibilityNodeInfo.CollectionItemInfo) 实例的一组控件, 它们共同属于同一个 [信息集控件](#信息集控件).

部分属性或方法:

- `[m#]` getRowIndex / `[p#]` rowIndex
- `[m#]` getColumnIndex / `[p#]` columnIndex
- `[m#]` getRowSpan / `[p#]` rowSpan
- `[m#]` getColumnSpan / `[p#]` columnSpan
- `[m#]` isSelected / `[p#]` selected
- `[m#]` getRowTitle / `[p#]` rowTitle
- `[m#]` getColumnTitle / `[p#]` columnTitle

## 控件矩形外展

[控件矩形](androidRectType) 边界为非整数时, 外展将对各个边界做如下取整操作:

- left - 左边界左移, 即向下取整, 类似 JavaScript 语言的 Math.floor(left)
- top - 上边界上移, 即向下取整, 类似 JavaScript 语言的 Math.floor(top)
- right - 右边界右移, 即向上取整, 类似 JavaScript 语言的 Math.ceil(right)
- bottom - 下边界下移, 即向上取整, 类似 JavaScript 语言的 Math.ceil(bottom)

例如:

`Rect(10.9, 12.6 - 120.37, 1882.02)` 外展后得到  
`Rect(10, 12, 121, 1883)`

> 注: "外展" 源自健身术语.

## 控件矩形内收

[控件矩形](androidRectType) 边界为非整数时, 外展将对各个边界做如下取整操作:

- left - 左边界右移, 即向上取整, 类似 JavaScript 语言的 Math.ceil(left)
- top - 上边界下移, 即向上取整, 类似 JavaScript 语言的 Math.ceil(top)
- right - 右边界左移, 即向下取整, 类似 JavaScript 语言的 Math.floor(right)
- bottom - 下边界上移, 即向下取整, 类似 JavaScript 语言的 Math.floor(bottom)

例如:

`Rect(10.9, 12.6 - 120.37, 1882.02)` 内收后得到  
`Rect(11, 13, 120, 1882)`

> 注: "内收" 源自健身术语.

## 阈值

阈值, 英文 threshold, 也称 "临界值".  
阈值是令对象发生某种变化所需某种条件的值.

在 AutoJs6 中, 图像与颜色相关的许多方法, 均支持通过参数传入不同类型和数值的阈值.

阈值的范围通常为 `IntRange[0..255]` 和 `Range[0..1]`.

### 相似度

阈值通常可与 `相似度 (Similarity)` 进行转换, 作为参数时通常也支持互相替代:

```text
%Similarity% = 1 - %Threshold% / 255
%Threshold% = (1 - %Similarity%) * 255
```

`阈值 0` 等效于 `相似度 1` (完全匹配, 不允许丝毫误差)  
`阈值 4` 约等效于 `相似度 0.984` (匹配时可以容忍一点误差)  
`阈值 128` 等效于 `相似度 0.5` (匹配时误差容忍相对宽松)  
`阈值 255` 等效于 `相似度 0` (完全容忍, 不常用)

### 颜色匹配阈值

取值范围: IntRange[0..255]

参数类型与此类阈值相关的常用方法:

- [colors.isSimilar](color#m-issimilar)
- images.findColor
- images.findColorInRegion
- images.findMultiColors
- images.detectsColor

### 图像匹配阈值

取值范围: Range[0..1]

参数类型与此类阈值相关的常用方法:

- images.findImage
- images.findImageInRegion
- images.matchTemplate

### 图像阈值化阈值

取值范围: IntRange[0..255]

参数类型与此类阈值相关的常用方法:

- images.threshold(a, b, <i><strong>threshold</strong></i>, c)
- images.adaptiveThreshold ... (此处内容待完善)

## 亮度

亮度既可指物理上对于光的量度, 也可指颜色上色彩的明亮程度.

Luminance, Lightness 和 Brightness 都与 "亮度" 有关.

|            术语             | 常用译名 | 性质  | 可测量或计算 |
|:-------------------------:|:----:|:---:|:------:|
|  [Luminance](#luminance)  |  亮度  | 物理量 |   √    |
| [Brightness](#brightness) | 视亮度  | 感知量 |   ×    |
|  [Lightness](#lightness)  |  明度  | 感知量 |   ×    |

### Luminance

在光度学和色度学中, 亮度 (luminance) 表示人眼对光强度实际感受的物理量, 即单位面积看上去有多明亮.

国际单位制规定亮度的符号是 `Lv`, 单位为 `坎德拉每平方米 (cd/m²)`, 另一个常用非国际单位为 `尼特 (nit)`.  
亮度是一个物理量, 它可被测量及计算.

[Lightness](#lightness) 和 [Brightness](#brightness) 用于表示人眼对光亮的实际感受.  
这个感受是一个感知量, 与物理量不同, 感知量不可测量, 也不可计算.

相同的食盐, 不同人品尝有不同的咸度感受; 同样地, 相同的颜色, 不同人观察也会有不同的亮度感受.

与 Luminance 相关的参考资料:

- 亮度 (Luminance) - [Wikipedia (英)](https://en.wikipedia.org/wiki/Luminance)

### Brightness

视亮度 (Brightness) 是对于光源或物体表面明暗的视知觉特性, 是一个感知量.  
视亮度是视觉的特性, 对视觉目标的辐射或反射的光亮度的感知.  
这种感知对于光的亮度不是线性的, 而是依赖于视觉环境.

与 Brightness 相关的参考资料:

- 视亮度 (Brightness) - [Wikipedia (英)](https://en.wikipedia.org/wiki/Brightness)
- 芒克-怀特错觉 (White's Illusion) - [Wikipedia (英)](https://en.wikipedia.org/wiki/White%27s_illusion)
- 侧抑制 (Lateral Inhibition) - [Wikipedia (英)](https://en.wikipedia.org/wiki/Lateral_inhibition)

### Lightness

明度 (Lightness) 是一个物体与同样亮的白色物体相比后的明亮程度.

与 Lightness 相关的参考资料:

- 明度 (Lightness) - [Wikipedia (英)](https://en.wikipedia.org/wiki/Lightness)

## 注入

代码注入 (Code Injection) 是因处理无效数据的而引发的非预期运行结果.

代码注入可被攻击者用来导入代码到某特定的计算机程序, 以改变程序的执行进程或目的.

常用的代码注入包含 [ 脚本注入 (XSS) / SQL 注入 / PHP 注入 / ASP 注入 ] 等.

> 参阅: [Wikipedia (英)](https://en.wikipedia.org/wiki/Code_injection) / [Wikipedia (中)](https://zh.wikipedia.org/wiki/%E4%BB%A3%E7%A2%BC%E6%B3%A8%E5%85%A5)

## 占位符替换参数

AutoJs6 提供了简化的占位符格式化参数功能, 类似 Java 语言的 `String.format` 方法.

```js
console.log('%s 获得了 %d 个奖章', '大卫', 23);
```

上述示例中 `console.log` 方法提供了占位符格式化参数支持, 运行后控制台将显示一条消息, "大卫 获得了 23 个奖章".

其中, `%s` 和 `%d` 是占位符, 分别表示接受字符串类型和数字类型的参数, 因此后面的剩余参数将依次进行占位符替换, 替换时, JavaScript 将进行参数的隐式转换.

AutoJs6 支持的所有占位符如下:

| <span style="white-space:nowrap">占位符</span> | 简述                                                            | 示例                                                                          | 示例结果                                                                     |
|:-------------------------------------------:|---------------------------------------------------------------|-----------------------------------------------------------------------------|--------------------------------------------------------------------------|
|                     %s                      | <span style="white-space:nowrap">字符串占位符</span>                | <span style="white-space:nowrap">"状态: %s", "开启"<br/>"状态: %s", 100</span>    | <span style="white-space:nowrap">"状态: 开启"<br/>"状态: 100"</span>           |
|                     %d                      | <span style="white-space:nowrap">数字占位符</span>                 | <span style="white-space:nowrap">"数量: %d", 5<br/>"数量: %d", "hello"</span>   | <span style="white-space:nowrap">"数量: 5"<br/>"数量: NaN"</span>            |
|                     %j                      | <span style="white-space:nowrap">JSON 对象占位符</span>            | <span style="white-space:nowrap">"o: %j", { a: 1, b: 2 }</span>             | <span style="white-space:nowrap">'o: {"a":1,"b":2}'</span>               |
|                     %%                      | <span style="white-space:nowrap">转义 % 符号<br/>%% 将转换为 %</span> | <span style="white-space:nowrap">"1%% is 0.01"<br/>"1%%%% is 0.0001"</span> | <span style="white-space:nowrap">"1% is 0.01"<br/>"1%% is 0.0001"</span> |

JavaScript 的模板字符串也可以很好地完成占位符格式化功能:

```js
let person = 'John';
let score = 91;
let subject = 'Chinese';

/* 使用占位符替换参数. */
console.log('%s got a %s score of %d', person, subject, score);

/* 使用 JavaScript 模板字符串. */
console.log(`${person} got a ${subject} score of ${score}`);

/* 上述两种方法均可在控制台显示预期输出内容. */
// "John got a Chinese score of 91"
```

## HTTP 标头

参阅 [HTTP 标头](httpHeaderGlossary) 术语章节.

## MIME 类型

参阅 [MIME 类型](mimeTypeGlossary) 术语章节.
