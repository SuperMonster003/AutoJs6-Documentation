# 异常 (Exceptions)

当运行时发生错误, 新创建的 Error 对象会被抛出.  
除通用的 Error 构造器外, JavaScript 还有其它类型的错误构造器, 详见下述 [JavaScript 错误类型](#javascript) 小节.

> 注: Java 有 Error (错误) 和 Exception (异常) 之分, 它们都扩展自 Throwable 类.  
> JavaScript 有 Error (错误) 全局对象, 以及一系列细分 Error 对象 (如 TypeError 等).  
> 虽然 JavaScript 没有 Exception (异常) 对象, 但章节标题依然采用 "异常" (而非 "错误").

用 `try...catch` 语句可以捕获并处理异常, 详见下述 [异常处理](#trycatch-语句) 小节.

在 `catch {}` (即 `catch 块`) 中, `e` 对象可用于获取异常相关信息,  
而 Rhino 引擎重新包装了 `e` 对象, 通过 [`e.javaException`](#p-javaexception) 和 [`e.rhinoException`](#p-rhinoexception) 可获取更多异常信息,  
详见下述 [catch 块](#catch-块) 小节.

# 错误类型

## JavaScript

以下内置错误类型在 Rhino 引擎中均得以实现, 在 AutoJs6 支持全局调用.  
如需创建自定义错误类型, 参阅下述 [自定义错误类型](#自定义) 小节.

### Error

通用 Error 构造器.

内置错误类型 TypeError, RangeError 等均扩展自 Error 构造器.  
例如, 如果一个对象是 TypeError 的实例, 则也一定是 Error 的实例.

Error 实例的属性及方法可参阅 [Error 对象](#error-对象) 章节.

```js
try {
    android();
} catch (e) {
    console.log(e instanceof TypeError); // true
    console.log(e instanceof Error); // true
}
```

### RangeError

越界错误.

RangeError 实例代表了当一个值不在其所允许的范围或者集合中的错误.

```js
/* 创建或应用. */

const check = function (num) {
    const MIN = 1;
    const MAX = 500;
    if (num < MIN || num > MAX) {
        throw new RangeError(`Number ${num} must be between ${MIN} and ${MAX}.`);
    }
};

try {
    check(523);
} catch (e) {
    if (e instanceof RangeError) {
        console.error("发生越界错误.");
        throw e;
    }
}

/* 复现 (Array 构造器参数不合法). */

// RangeError: Inappropriate array length.
let a = Array(-1);

/* 复现 (Number 部分实例方法参数不合法). */

// RangeError: Precision -1 out of range. 
let n = (23).toExponential(-1);
// RangeError: Precision -2 out of range. 
let n = (23).toFixed(-2);
// RangeError: Precision -3 out of range.
let n = (23).toPrecision(-3);

```

### ReferenceError

引用错误.

ReferenceError 实例代表了当一个不存在或尚未初始化的变量被引用时发生的错误.

```js
/* 创建或应用. */

const f = function (num, options) {
    if (typeof options === 'undefined') {
        throw new ReferenceError("Invalid options.");
    }
    /* Other code... */
};
f(23);

/* 复现. */

// ReferenceError: a is not defined.
a;

```

### SyntaxError

语法错误.

SyntaxError 实例代表了当 Javascript 引擎发现 tokens 不合法或 token 顺序不合法时抛出的错误.

```badjs
/* 创建或应用. */

try {
    eval("...");
} catch (e) {
    if (e instanceof SyntaxError) {
        console.error("发生语法错误, 位于 eval.");
        throw e;
    }
}

/* 复现. */

// Firefox 103.0 - SyntaxError: expected expression, got '??'.
// Node.js 17.3.0 - SyntaxError: Unexpected token '??'.
// AutoJs6 - syntax error.
??
```

> 注: Rhino 内置了 token 解析器,  
> 因此多数语法错误会被重新解析后再抛出,  
> 而其他多数 JavaScript 引擎则直接抛出 SyntaxError.

> Rhino 相关类或文件:  
> [org.mozilla.javascript.Parser](https://github.com/mozilla/rhino/blob/master/src/org/mozilla/javascript/Parser.java)  
> [org.mozilla.javascript.TokenStream](https://github.com/mozilla/rhino/blob/master/src/org/mozilla/javascript/TokenStream.java)  
> [Messages.properties](https://github.com/mozilla/rhino/blob/master/src/org/mozilla/javascript/resources/Messages.properties)

### TypeError

类型错误.

TypeError 实例代表了当一个值的类型为非预期类型时发生的错误.

```js
/* 创建或应用. */

try {
    throw new TypeError('Hello', "someFile.js", 10);
} catch (e) {
    console.log(e instanceof TypeError); // true
    console.log(e.message); // "Hello"
    console.log(e.name); // "TypeError"
    console.log(e.fileName); // "someFile.js"
    console.log(e.lineNumber); // 10
}

/* 复现. */

// TypeError: Cannot call method "f" of null.
null.f();

// TypeError: java is not a function, it is object.
java();

// TypeError: day is not a function, it is string.
[].every("day");
```

### URIError

URI 错误.

URIError 实例代表了当以一种错误方式使用全局 URI 处理方法时产生的错误.

```js
/* 创建或应用. */

try {
    throw new URIError('Hello', 'someFile.js', 10);
} catch (e) {
    console.log(e instanceof URIError); // true
    console.log(e.message); // "Hello"
    console.log(e.name); // "URIError"
    console.log(e.fileName); // "someFile.js"
    console.log(e.lineNumber); // 10
}

/* 复现. */

// URIError: Malformed URI sequence.
decodeURIComponent('%');
```

### InternalError

内部错误.

InternalError 实例代表了出现在 JavaScript 引擎内部的错误.

```js
/* 创建或应用. */

try {
    console.log(App.HELLO);
} catch (e) {
    if (e instanceof InternalError) {
        console.error("发生内部错误: 未知的预置 App.");
        throw e;
    }
}

/* 复现. */

// InternalError: Java method "vibrate" cannot be assigned to.
runtime.device.vibrate = 1;
```

### EvalError

Eval 错误.

EvalError 实例代表了一个关于 [eval](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval) 方法的错误.

```js
/* 创建或应用. */

try {
    throw new EvalError('Hello', 'someFile.js', 10);
} catch (e) {
    console.log(e instanceof EvalError); // true
    console.log(e.message); // "Hello"
    console.log(e.name); // "EvalError"
    console.log(e.fileName); // "someFile.js"
    console.log(e.lineNumber); // 10
}

/* 复现. */

/* eval 抛出具体类型的错误, 而非 EvalError, 因此基本无法复现. */

// ReferenceError: "hello" is not defined.
eval("hello()");

/* 除非像上述 "创建 EvalError" 示例一样抛出错误, */
/* 或在 eval 中显式抛出 EvalError, */
/* 但这样做通常没有意义. */

// EvalError: test
eval("throw EvalError('test')");
```

> 注: EvalError 不在当前 (2022/07) ECMAScript 规范中使用, 因此不会被运行时抛出.  
> 但是对象本身仍然与规范的早期版本向后兼容.

## DOM

DOMException 接口代表访问 Web API 属性或执行 [DOM (文档对象模型)](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model/Introduction) 相关操作时发生的异常, 此异常通常是面对浏览器环境的.

当一个操作不可执行时, 如试图创建一个无效的 DOM 或通过一个不存在的节点作为参数节点操作方法, 会抛出 DOMException 异常:

```js
let node = document.getElementsByTagName('h1').item(0);
let refnode = node.nextSibling;
let newnode = document.createTextNode('test');
node.insertBefore(newnode, refnode); /* 抛出 DOMException 异常. */
```

DOMException 包含详细的名称分类, 如 [ "NotFoundError" / "InvalidStateError" / "NoModificationAllowedError" ] 等, 详情参阅 [Web IDL](https://webidl.spec.whatwg.org/#idl-DOMException-error-names).

## Java

Java 异常 (Exception) 类扩展自 Throwable 类, Exception 实例可使用 [throw 关键字](#throw-语句) 抛出.

Exception 可以被 [try...catch 语句](#trycatch-语句) 捕获并处理.

Error 类也扩展自 Throwable 类, 与 Exception 稍有不同, Error 往往是 Java 程序运行中不可预料且无法恢复的异常情况, 如 [ OutOfMemoryError / NoClassDefFoundError / StackOverflowError ] 等.

由 Java 方法抛出的原始异常, 指向 catch 块中异常对象的 [javaException](#p-javaexception) 属性.

常见的 Java 异常:

```text
Exception
│
├─ RuntimeException
│  │
│  ├─ NullPointerException
│  │
│  ├─ IndexOutOfBoundsException
│  │
│  ├─ SecurityException
│  │
│  └─ IllegalArgumentException
│     │
│     └─ NumberFormatException
│
├─ IOException
│  │
│  ├─ UnsupportedCharsetException
│  │
│  ├─ FileNotFoundException
│  │
│  └─ SocketException
│
├─ ParseException
│
├─ GeneralSecurityException
│
├─ SQLException
│
└─ TimeoutException
```

> 参阅: [廖雪峰](https://www.liaoxuefeng.com/wiki/1252599548343744/1264737765214592) / [GeeksForGeeks ](https://www.geeksforgeeks.org/errors-v-s-exceptions-in-java/)

## Rhino

Rhino 异常可以视为特殊的 [Java 异常](#java), 由 Rhino [运行时 (Runtime)](runtime) 包装为对象, 指向 catch 块中异常对象的 [rhinoException](#p-rhinoexception) 属性. 

## 自定义

本小节列举了几种自定义错误类型的方法.

- 借助标准内置对象 Error:

```js
function InvalidFruitError(msg) {
    Error.call(this);
    this.message = `Name of "${msg}" must end with "Fruit"`;
    this.name = this.constructor.name;
}

InvalidFruitError.prototype = Object.create(Error.prototype, {
    constructor: { value: InvalidFruitError },
});

function ensureFruitName(name) {
    if (!name.endsWith("Fruit")) {
        throw new InvalidFruitError(name);
    }
}

// InvalidFruitError: Name of "coconut" must end with "Fruit"...
[ "appleFruit", "bananaFruit", "coconut" ].forEach(ensureFruitName);
```

- 模拟标准内置对象 Error 的行为:

```js
function InvalidFruitError(msg) {
    this.message = `Name of "${msg}" must end with "Fruit"`;
    this.name = this.constructor.name;
    this.toString = () => `${this.name}: ${this.message}`;
}

function ensureFruitName(name) {
    if (!name.endsWith("Fruit")) {
        throw new InvalidFruitError(name);
    }
}

// InvalidFruitError: Name of "coconut" must end with "Fruit"...
[ "appleFruit", "bananaFruit", "coconut" ].forEach(ensureFruitName);
```

- 摘录自 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error) 的示例:

```js
function CustomError(foo, message, fileName, lineNumber) {
    var instance = new Error(message, fileName, lineNumber);
    instance.foo = foo;
    Object.setPrototypeOf(instance, CustomError.prototype);
    if (Error.captureStackTrace) {
        Error.captureStackTrace(instance, CustomError);
    }
    return instance;
}

Object.setPrototypeOf(CustomError.prototype, Error.prototype);

Object.setPrototypeOf(CustomError, Error);

CustomError.prototype.name = 'CustomError';

try {
    throw new CustomError('baz', 'bazMessage');
} catch (e) {
    console.error(e.name); // CustomError
    console.error(e.foo); // baz
    console.error(e.message); // bazMessage
}

```

# 异常处理

## throw 语句

使用 throw 语句抛出一个异常.  
此异常可以是一个含有值的表达式, 包括 [ 数字 / 字符串 / 布尔 / 对象 ] 等多种类型.

不同语言的语法存在差异:

```java
/* Java. */

/* new 不可省略. */
throw new Exception("foo");
```

```kotlin
/* Kotlin. */

/* Kotlin 语言无 new 关键字. */
throw Exception("foo");
``` 

```js
/* JavaScript. */

/* Error 实例. */
throw new Error("foo");

/* Error 实例 (new 关键字省略). */
throw Error("foo");

/* 数字或字符串等表达式. */
throw "foo"; /* 合法. */
throw 23; /* 合法. */
throw true; /* 合法. */

/* 对象. */
throw {
    name: "CustomError",
    message: "test",
    __proto__: Error.prototype,
};

/* 自定义 "类" 的实例. */
function TestError(msg) {
    this.message = msg;
    this.name = this.constructor.name;
    this.toString = () => `${this.name}: ${this.message}`;
}

throw new TestError("foo"); /* new 关键字不可省略. */

```

## try...catch 语句

try...catch 语句标记一块待尝试的语句, 若语句出现异常 (包括主动使用 throw 语句抛出的异常), 该异常会被 try...catch 语句捕获:

```js
try {
    throw new java.lang.RuntimeException("hello");
} catch (e) {
    console.log(e.message); // "hello"
}
```

try...catch 语句必须有 try 代码块, 最多 1 个 catch 代码块 (catch 代码块省略时, 则必须存在 finally 代码块).

## catch 块

又名 "捕捉块".

使用 catch 块处理在 try 代码块中产生的异常.  
catch 块中的语句只有 try 代码块中抛出异常时才会执行.

```js
try {
    0 === 1;
} catch (e) {
    /* 不会执行, 因为 try 块中无异常. */
    console.log(e.message);
}
```

catch 块中的异常信息对象 (通常用 e 或 ex 表示) 包含了异常的基本信息, 如 [ message / name / javaException / stack ] 等, 详见 [Error 对象](#error 对象) 章节.

Rhino 内置的 token 解析器可以解析像 Java 语言一样的多 catch 语句:

```badjs
function classForName(name) {
    try {
        return java.lang.Class.forName(name);
    } catch (e if e.javaException instanceof java.lang.ClassNotFoundException) {
        print(`Class ${name} not found`);
    } catch (e if e.javaException instanceof java.lang.NullPointerException) {
        print("Class name is null");
    }
}

classForName("NonExistingClass"); // Class NonExistingClass not found
classForName(null); // Class name is null
```

上述示例代码在 AutoJs6 可正常运行并返回预期结果, 但不符合 ECMAScript 语法, 且暂未发现任何可以解析此语法的 IDE, 使用后会造成 IDE 报错并在格式化代码时出现排版异常.

使用传统的单 catch 块语句可能会是更好的选择:

```js
try {
    return java.lang.Class.forName(name);
} catch (e) {
    if (e.javaException instanceof java.lang.ClassNotFoundException) {
        print(`Class ${name} not found`);
    } else if (e.javaException instanceof java.lang.NullPointerException) {
        print("Class name is null");
    }
}
```

## finally 块

finally 块中的语句无论 try 代码块是否抛出异常都会执行.

```js
try {
    /* 打开并写入文件, 此处可能出现异常. */
} catch (e) {
    /* 处理异常. */
} finally {
    /* 关闭文件, 释放资源. */
}
```

finally 块存在时, catch 块可省略:

```js
try {
    /* 打开并写入文件, 此处可能出现异常. */
} finally {
    /* 关闭文件, 释放资源, 然后将异常重新抛出 (因为没有 catch 块捕获异常). */
}
```

如果 finally 块有返回值, 该值会是整个 try...catch...finally 流程的返回值, 而不论在 try 和 catch 块中语句的返回值:

```js
function f() {
    try {
        console.log(0);
        throw "error";
    } catch (e) {
        console.log(1);
        return true; /* return 语句被暂时搁置, 直至 finally 块语句全部执行完成. */
        console.log(2); /* 不可达. */
    } finally {
        console.log(3);
        return false; /* 覆盖上一个 return 语句. */
        console.log(4); /* 不可达. */
    }
    /* `return false` 已执行. */
    console.log(5); /* 不可达. */
}

let res = f(); // 控制台打印 0, 1, 3
console.log(res); // false
```

# Error 对象

Error 对象是一个 JavaScript 构造函数, 它的实例通常由 [catch 块](#catch-块) 中的参数引用, 或通过 new 关键字产生相应的 Error 实例对象:

```js
try {
    let err = new Error("test");
    console.log(err instanceof Error); // true
    throw err;
} catch (e) {
    console.log(e instanceof Error); // true
}
```

对于 AutoJs6, catch 块中的引用对象 (通常用 e 或 ex 表示) 还由 Rhino 引擎额外封装了 [javaException](#p-javaexception) 和 [rhinoException](#p-rhinoexception) 两个对象.

---

<p style="font: bold 2em sans-serif; color: #FF7043">Error</p>

---

## [@] Error

## [p#] name

- { [string](dataTypes#string) }

表示 Error 类型的名称, 初始值为 "Error".

```js
console.log(new SyntaxError('hello').name); // "SyntaxError"

try {
    throw TypeError('world');
} catch (e) {
    console.log(e.name); // "TypeError"
}
```

## [p#] message

- { [string](dataTypes#string) }

错误相关信息的描述.

```js
console.log(new SyntaxError('hello').name); // "hello"

try {
    Math.random().toFixed(-1);
} catch (e) {
    console.log(e.message); // "精度 -1 超出范围."
}
```

## [p#] stack

- { [string](dataTypes#string) | [any](dataTypes#any) }

stack 属性描述了 Error 对象的 [栈追踪 (Stack Trace)](https://zh.wikipedia.org/wiki/%E6%A0%88%E8%BF%BD%E8%B8%AA) 信息.

栈追踪描述了程序运行过程中某个时间点上的活跃栈帧信息.  
用户在日志中可以查看程序出错时的栈追踪信息, 用以自行排查代码异常或将栈追踪信息反馈给开发者.

```js
try {
    !function test() {
        throw Error('hello');
    }();
} catch (e) {
    /* 打印栈追踪信息. */
    console.log(e.stack);
}
```

一个已格式化的栈追踪信息示例:

```text
ReferenceError: FAIL is not defined
   at Constraint.execute (deltablue.js:525:2)
   at Constraint.recalculate (deltablue.js:424:21)
   at Planner.addPropagate (deltablue.js:701:6)
   at Constraint.satisfy (deltablue.js:184:15)
   at Planner.incrementalAdd (deltablue.js:591:21)
   at Constraint.addConstraint (deltablue.js:162:10)
   at Constraint.BinaryConstraint (deltablue.js:346:7)
   at Constraint.EqualityConstraint (deltablue.js:515:38)
   at chainTest (deltablue.js:807:6)
   at deltaBlue (deltablue.js:879:2)
```

栈追踪的信息量由栈帧数量体现, 通过 [Error.stackTraceLimit](#p-stacktracelimit) 可设置栈帧数量.  
栈追踪信息可通过 [Error.captureStackTrace](#m-capturestacktrace) 附加到一个 JavaScript 对象 (如 obj) 上, 通过访问 obj.stack 可随时查看栈追踪信息.  
[Error.prepareStackTrace](#m-preparestacktrace) 还可以自定义栈追踪信息的输出格式.

stack 属性默认返回 string 类型, 如果设置了 prepareStackTrace 格式函数, 则 stack 类型将与格式函数的返回值类型一致:

```js
Error.prepareStackTrace = function (e, frames) {
    return frames.reduce((a, b) => a.concat([ b.getFunctionName() ]), []);
};
try {
    !function test() {
        throw Error('hello');
    }();
} catch (e) {
    /* 此时 stack 是一个数组. */
    console.log(Array.isArray(e.stack)); // true
}
```

## [p#] lineNumber

- { [number](dataTypes#number) }

表示抛出异常的代码在源文件中的行号.

```js
try {
    throw Error("hello");
} catch (e) {
    console.log(e.lineNumber); /* e.g. 5 */
}
```

## [p#] fileName

- { [string](dataTypes#string) }

表示抛出异常的代码所在源文件的文件路径.

```js
try {
    throw Error("hello");
} catch (e) {
    console.log(e.fileName); /* e.g. "/storage/emulated/0/Scripts/test.js" */
}
```

## [p#] javaException

- { [java.lang.Exception](#java) }

由 Java 方法抛出的原始异常.

```js
try {
    /* 一些其他代码, 可能会抛出异常. */
    /* ... */

    /* 启动一个不存在的 Activity. */
    app.startActivity({});
} catch (e) {
    // '[JavaException: android.content.ActivityNotFoundException: No Activity found to handle Intent { flg=0x10000000 }]'
    console.log(e);

    console.log(e.javaException !== undefined); // true

    /* 借助 e.javaException 类型处理不同的异常. */
    if (e.javaException instanceof org.json.JSONException) {
        console.error('JSON 解析错误');
        throw (e);
    }
    if (e.javaException instanceof android.content.ActivityNotFoundException) {
        console.error('指定的 Activity 不存在');
        throw (e);
    }
    if (e.javaException instanceof ScriptInterruptedException) {
        /* 忽略错误, 直接退出. */
        exit();
    }
    if (e.javaException instanceof java.lang.RuntimeException) {
        /* ... */
        throw (e);
    }
    /* ... */
}
```

## [p#] rhinoException

- { [java.lang.Exception](#java) }

由 Rhino 运行时 (Runtime) 包装的异常对象.

```js
try {
    f();
} catch (e) {
    // '[ReferenceError: "f" is not defined.]'
    console.log(e);

    /* e 是 ReferenceError 类型. */
    console.log(e instanceof ReferenceError); // true
    /* 同时也是 Error 类型. */
    console.log(e instanceof Error); // true

    /* 对象 e 是 Error 类型, 为 JavaScript 异常. */
    /* 但 e.rhinoException 是 java.lang.Exception 类型, 为 Java 异常. */
    console.log(e.rhinoException instanceof java.lang.Exception); // true
    console.log(e.rhinoException instanceof org.mozilla.javascript.EcmaError); // true
    console.log(e.rhinoException instanceof Error); // false
    
    /* 因为 try 代码块没有触发 Java 异常, 因此 e.javaException 是 undefined. */
    console.log(e.javaException); // undefined
}
```

## [m#] toString

### toString()

- <ins>**returns**</ins> { [string](dataTypes#string) }

返回一个表示指定 Error 对象的字符串.

```js
let errA = new Error('hello');
console.log(errA.toString()); // "Error: hello"

let errB = new TypeError('world');
console.log(errB.toString()); // "TypeError: world"

errB.name = 'Banana';
console.log(errB.toString()); // "Banana: world"

errB.message = "yellow";
console.log(errB.toString()); // "Banana: yellow"
```

## [m#] toSource

### toSource()

- <ins>**returns**</ins> { [string](dataTypes#string) }

返回表示 Error 对象源代码的字符串.

```js
let err = new Error('hello');
console.log(err.toSource()); // (new Error("hello", ""))

try {
    Math.random().toFixed(-1);
} catch (e) {
    console.log(e.toSource()); // (new RangeError("\u7cbe\u5ea6 -1 \u8d85\u51fa\u8303\u56f4.", "\u8fdc\u7a0b$Untitled-52js", 3))
    throw eval(e.toSource()); /* 可供 eval 作为参数接收. */
}
```

## [p] stackTraceLimit

- [ `Infinity` ] { [number](dataTypes#number) }

设置或读取收集的栈追踪信息的栈帧数量.

> 注: 该属性虽以 [数据描述符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#%E6%8F%8F%E8%BF%B0) 描述, 但通常以 [存取描述符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#%E6%8F%8F%E8%BF%B0) 方式使用, 且 setter 更具有实际意义.

栈帧默认值为 Infinity, 即无数量限制:

```js
console.log(Error.stackTraceLimit); // Infinity
```

设置一个数量限制:

```js
Error.stackTraceLimit = 23;
console.log(Error.stackTraceLimit); // 23
```

恢复默认的数量限制值 (Infinity) 有多种方式:

```js
/* 直接设置 Infinity. */
Error.stackTraceLimit = Infinity;

/* 设置 NaN. */
Error.stackTraceLimit = NaN;

/* 设置负数. */
Error.stackTraceLimit = -1;

/* 设置无法转换为非 NaN 的 number 类型. */
Error.stackTraceLimit = "hello";
```

注意与 0 的区分, 将数量限制设置为 0 表示不显示栈追踪信息, 即禁用栈追踪收集.

```js
let infoA = {};
let infoB = {};

try {
    throw Error("hello");
} catch (e) {
    Error.captureStackTrace(infoA);

    Error.stackTraceLimit = 0;
    Error.captureStackTrace(infoB);

    console.log(infoA.stack); /* 打印栈追踪信息. */
    console.log(infoB.stack); /* 打印空字符串. */

    Error.stackTraceLimit = Infinity;
    Error.captureStackTrace(infoB);
    console.log(infoB.stack); /* 打印栈追踪信息. */
}
```

> 参阅: [V8 Dev](https://v8.dev/docs/stack-trace-api)

## [m] prepareStackTrace

用于自定义栈追踪信息格式, 该属性以函数形式发挥作用, 因此文档称之为 "格式函数".

> 注: 该属性虽以 [数据描述符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#%E6%8F%8F%E8%BF%B0) 描述, 但通常以 [存取描述符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#%E6%8F%8F%E8%BF%B0) 方式使用, 且 setter 更具有实际意义.

格式函数默认值为 undefined, 即使用默认格式输出栈追踪信息:

```js
console.log(Error.prepareStackTrace); // undefined
```

设置自定义格式函数:

```js
Error.prepareStackTrace = function (e, frames) {
    /* ... */
};
```

恢复默认的格式函数:

```js
/* 直接设置 null 或 undefined. */
Error.prepareStackTrace = undefined;

/* 除函数, null 和 undefined 外, 赋值其他类型的操作将被忽略, 不会有任何效果. */
Error.prepareStackTrace = "hello"; /* 无任何效果. */
```

> 参阅: [V8 Dev](https://v8.dev/docs/stack-trace-api)

### prepareStackTrace(errorObj, stackTraces)

- **errorObj** { [Error](#error 对象) } - 异常对象的引用
- **stackTraces** { [NodeJS.CallSite](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules__types_node_globals_d_.nodejs.callsite.html)[[]](dataTypes#array) } - 栈追踪数组 (栈帧组)
- <ins>**returns**</ins> { [any](dataTypes#any) }

设置或查看用于自定义栈追踪信息的格式函数.

```js
Error.prepareStackTrace = function (e, frames) {
    /* ... */
};
```

上述示例中的 frames (以及方法签名中的 stackTraces) 表示栈帧组, 每一个栈帧都是 [NodeJS.CallSite](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules__types_node_globals_d_.nodejs.callsite.html) 类型.

下面列出了部分栈帧可用的属性或方法:

- `[m#]` getColumnNumber
- `[m#]` getEvalOrigin
- `[m#]` getFileName
- `[m#]` getFunction
- `[m#]` getFunctionName
- `[m#]` getLineNumber
- `[m#]` getMethodName
- `[m#]` getThis
- `[m#]` getTypeName
- `[m#]` isConstructor
- `[m#]` isEval
- `[m#]` isNative
- `[m#]` isToplevel

格式函数的返回值决定了 stack 属性的类型值.

```js
/* 格式函数返回值为 string 类型. */
Error.prepareStackTrace = function (e, frames) {
    return frames.map(f => `${f.getFunctionName()}: ${f.getLineNumber()}`).join('\n');
};
try {
    !function test() {
        throw Error('hello');
    }();
} catch (e) {
    /* 与格式函数返回值同为 string 类型. */
    console.log(e.stack);
}
```

## [m] captureStackTrace

附加 stack 属性 (栈追踪信息) 到任意对象上.

> 参阅: [V8 Dev](https://v8.dev/docs/stack-trace-api)

### captureStackTrace(errorObj, constructorOpt)

- **errorObj** { [object](dataTypes#object) } - 用于附加 stack 属性的任意对象
- **constructorOpt** { [Function](dataTypes#function) } - 用于在栈追踪信息中触发隐藏的函数
- <ins>**returns**</ins> { [void](dataTypes#void) }

附加 stack 属性 (栈追踪信息) 到任意对象上, 并支持在栈追踪信息中隐藏以指定的调用函数为起点的栈帧信息.

```js
let info = {};
try {
    function a() {
        Error.captureStackTrace(info);
        return (0.5).toFixed(-1);
    }

    function b() {
        a();
    }

    !function c() {
        b();
    }();
} catch (e) {
    /* info 对象被附加了 stack 属性. */
    /* stack 信息中包含函数 a, b, c 的栈帧信息, 顺序为 a (栈顶) -> b -> c (栈底). */
    console.log(info.stack);
}
```

部分信息对于用户或开发者可能没有参考意义, 此时可使用 constructorOpt 参数隐藏部分栈帧信息:

```js
let info = {};
try {
    function a() {
        /* b (含) 及其栈顶方向的所有函数调用均将隐藏. */
        Error.captureStackTrace(info, b);
        return (0.5).toFixed(-1);
    }

    function b() {
        a();
    }

    !function c() {
        b();
    }();
} catch (e) {
    /* stack 信息中 b 和 a 被隐藏, 仅 c 被保留. */
    console.log(info.stack);
}
```

上述示例中的 `b` 如果替换为 `c`, 则所有栈帧全部被隐藏, `info.stack` 将返回 `undefined` (即 stack 没有被附加到 info 对象上):

```js
let info = {};
try {
    function a() {
        /* 传入栈底方法 (c) 将不会触发 stack 属性的附加操作. */
        Error.captureStackTrace(info, c);
        return (0.5).toFixed(-1);
    }

    function b() {
        a();
    }

    !function c() {
        b();
    }();
} catch (e) {
    /* stack 信息未被附加. */
    console.log(info.stack); // undefined
    console.log("stack" in info); // false
}
```

如果传入一个栈帧中不存在的函数, 则 `info.stack` 将返回 `""` (空字符串):

```js
let info = {};
try {
    function irrelevant() {
        // Empty body.
    }

    function a() {
        /* 传入一个与所有栈帧无关的函数, 将导致 stack 属性值变为空字符串. */
        Error.captureStackTrace(info, irrelevant);
        return (0.5).toFixed(-1);
    }

    function b() {
        a();
    }

    !function c() {
        b();
    }();
} catch (e) {
    console.log(info.stack); // ""
}
```