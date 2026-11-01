# 类语法

AutoJs6 的 Rhino 引擎支持 ECMAScript 的 `class` 语法, 包括字段, 静态块, 私有名, 内建类型的子类化, 并可继承 Java 类与接口.

> 注: 本章内容需要 AutoJs6 6.8.0 及以上版本 (Rhino 引擎). Node.js, Bun 等其他运行时使用各自引擎的 `class` 实现, 不适用本章的 Java 类继承.

## 语法支持范围

```js
class Shape {
    static count = 0; /* 静态字段. */
    name = 'shape'; /* 实例字段. */
    #secret = 1; /* 私有字段. */

    static { Shape.ready = true; } /* 静态块. */

    constructor(name) {
        this.name = name;
        Shape.count++;
        console.log(new.target.name); /* 实际构造的类名. */
    }

    get label() { return `shape ${this.name}`; } /* 访问器. */
    set label(value) { this.name = value; }

    describe() { return this.name; } /* 方法. */
    static create(name) { return new this(name); } /* 静态方法. */

    #hide() { return this.#secret; } /* 私有方法. */
    static isShape(o) { return #secret in o; } /* 私有名的 in 判断. */
}

class Circle extends Shape {
    constructor(radius) {
        super('circle'); /* 调用父类构造器. */
        this.radius = radius;
    }
    describe() { return `${super.describe()}: ${this.radius}`; } /* 调用父类方法. */
}

Circle.create(2) instanceof Shape; // true
```

| 语法 | 支持情况 |
|---|---|
| `class` 声明与表达式, `extends`, `super`, `new.target` | 支持 |
| 实例与静态的字段, 方法, 访问器, 计算属性名 | 支持 |
| 静态块 `static { }` | 支持 |
| 私有字段, 私有方法, 私有访问器, `#x in o` | 支持 |
| 生成器方法 `*gen() { }` | 支持 |
| `async` 方法与 `async` 生成器方法 | 不支持, 解析时报错 |
| 装饰器 (decorators) | 不支持 |

- `class` 体内的代码始终是严格模式, 不加 `new` 调用类时报 TypeError.
- `typeof` 的结果是 `function`, `String(Foo)` 返回类定义的源码片段.

## 内建类型的子类化

`extends` 可以继承内建构造器, `new` 按实际的类创建对象, 内建方法返回子类实例.

```js
class AppError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'AppError';
        this.code = code;
    }
}

class Stack extends Array {
    peek() { return this[this.length - 1]; }
}

class Counter extends Map {
    bump(key) { return this.set(key, (this.get(key) ?? 0) + 1); }
}

let stack = new Stack();
stack.push(1, 2);
stack.map(x => x * 2) instanceof Stack; // true

new Counter().bump('a').bump('a').get('a'); // 2
new AppError('boom', 7) instanceof Error; // true
```

支持的内建构造器包括 `Object`, `Function`, `Array`, `Error` 及其子类型, `Boolean`, `Number`, `String`, `Date`, `RegExp`, `Map`, `Set`, `WeakMap`, `WeakSet`, `Promise`, `ArrayBuffer`, `DataView` 及各 TypedArray.

## 继承 Java 类

`extends` 的目标可以是 Java 类或接口. 类中与 Java 方法同名的函数覆盖该方法, `super(...)` 调用 Java 构造器, `super.m()` 调用 Java 父类的实现.

```js
class Worker extends java.lang.Thread {
    count = 0;
    constructor(name) {
        super(name); /* 调用 Thread(String). */
    }
    run() {
        this.count++;
        console.log(`${this.getName()} runs`);
    }
}

let worker = new Worker('w1');
worker.start();
worker.join();
worker.count; // 1
worker instanceof Worker; // true
worker instanceof java.lang.Thread; // true
```

### 实现接口

继承单个接口时直接写接口名. 同时实现多个接口时写 `extends JavaAdapter(Base, I1, I2)`, 第一个实参是类时作为父类, 其余实参是接口.

```js
class Task extends java.lang.Runnable {
    run() { console.log('run'); }
}
new java.lang.Thread(new Task()).start();

class Item extends JavaAdapter(java.lang.Object, java.lang.Runnable, java.lang.Comparable) {
    value = 0;
    run() { this.value++; }
    compareTo(other) { return this.value - other.value; }
}
```

### 回调与线程

类的实例可以直接传给 Java API, Java 拿到的是适配器对象, 回到脚本时还原为同一个实例, 字段与私有名都在.

```js
class Inbox extends android.os.Handler {
    handleMessage(message) {
        console.log(`what: ${message.what}`);
    }
}
new Inbox(android.os.Looper.getMainLooper()).sendEmptyMessage(7);
```

Java 线程调用被覆盖的方法时运行在该线程上, 与 `new JavaAdapter` 的回调相同. 这类线程不属于脚本线程, 需要由脚本负责结束, 一般情况下优先使用 [线程 (Threads)](threads) 模块.

### 继承 View 类

继承 View 类的实例除了 Java 成员, 还带有控件对象的扩展方法 (如 `attr`, `on`, `click`) 与按 id 取子控件的能力. 这些方法以实例为 `this`, 返回控件自身时得到的仍是该实例, 可以继续链式调用.

```js
"ui";

class Badge extends android.widget.TextView {
    onDraw(canvas) {
        super.onDraw(canvas);
        /* 自定义绘制. */
    }
}

ui.layout(
    <vertical id="holder"/>
);

let badge = new Badge(activity);
ui.holder.addView(badge);

badge.attr('text', 'hello');
badge.on('click', view => console.log(view === badge)); // true
```

成员的查找顺序是 类中定义的成员 > Java 成员 > 控件扩展. 因此与 Java 方法同名的扩展不生效, 例如 `class P extends android.graphics.Paint` 的实例上 `setColor` 是 Java 方法, 不接受颜色字符串.

### 继承加载的类

继承 `runtime.loadDex` 或 `runtime.loadJar` 加载的类时, 先加载再定义类. 自 AutoJs6 6.8.0 起, Android 7 / 7.1 (API 24 / 25) 的 `runtime.loadJar` 也由 D8 转换, 可以加载 Java 8 (类文件版本 52) 及以上编译的类.

```js
runtime.loadJar('./library.jar');

class Local extends Packages.com.example.Base {
    greet() { return `${super.greet()}!`; }
}
```

### 限制

- 不能继承 final 类, 非 public 类, 基本类型或数组, 类定义时报 TypeError. 不能覆盖 final 方法, 首次构造时报 TypeError.
- 未实现的抽象方法在被调用时报 TypeError, 定义类和构造时都不检查.
- `super()` 之前不能读 `this`, Java 对象由 `super()` 创建. Java 构造器运行期间调用被覆盖的方法时, 实例字段尚未初始化, 控件扩展也不可用.
- Java 只看到构造时已存在的覆盖. 之后加到原型或实例上的新方法名只对脚本可见, 已覆盖的方法名每次调用都重新查找.
- 给可写的 Java 字段和有 setter 的 bean 属性赋值时写到 Java 对象, 其他名字成为实例的自有属性, 只对脚本可见.
- 覆盖控件扩展方法时不能用 `super.attr(...)` 调用它, 写 `super.attr.call(this, ...)`.
- `Object.keys`, `for...in` 与 `JSON.stringify` 只看到实例字段, 不含 Java 成员.
- 每次脚本运行中, 每种 "父类, 接口与覆盖的方法名" 的组合首次构造时生成一个适配器类并转换为 dex, 同一次运行内之后的构造不再转换, 耗时与 `new JavaAdapter` 相同 (手机上暖机后约 100 ms).

## 与 JavaAdapter 的关系

[JavaAdapter 构造器](scriptingJava#JavaAdapter-构造器) 的写法不变, 两种写法生成同样的适配器类, 可以按需选用.

| 对比项 | `class X extends JavaClass` | `new JavaAdapter(JavaClass, {...}, args)` |
|---|---|---|
| 结果 | 类, 可多次 `new`, 可再被继承 | 单个适配器对象 |
| 调用父类方法 | `super.m()` | `this.super$m()` |
| 字段与私有名 | 支持 | 不支持 |
| `instanceof` 脚本类 | 支持 | 不适用 |
| 构造器实参 | `super(args)` | `JavaAdapter` 末尾的实参 |
| 多个接口 | `extends JavaAdapter(Base, I1, I2)` | `new JavaAdapter(Base, I1, I2, {...})` |

## 严格模式下的行为

`class` 体内是严格模式, 下列写法在 `class` 体内与其他严格模式代码中报 TypeError, 而不是静默失败.

- Proxy 的 `set` trap 要返回 `true`. 返回 `false` (包括没有写 `return` 时的 `undefined`) 时, 严格模式下的赋值报 TypeError.

```js
class Store {
    data = new Proxy({}, {
        set(target, key, value) {
            target[key] = value;
            return true; /* 严格模式下必须返回 true. */
        },
    });
    put(key, value) {
        this.data[key] = value;
    }
}
```

- 给只读属性或 `set: undefined` 的访问器赋值时报 TypeError.
