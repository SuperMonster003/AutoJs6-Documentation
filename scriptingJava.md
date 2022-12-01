# 脚本化 Java

Rhino 引擎提供了脚本化 Java 的便捷性.

> 注: 此章节参考并修改自 [Auto.js Pro](https://pro.autojs.org/) 及 [Scripting Java](http://udn.realityripple.com/docs/Mozilla/Projects/Rhino/Scripting_Java/).

> 注: ECMA 标准并未包含与 Java 的交互, 本章节所有功能均作为扩展功能而非语言标准使用.

## 访问 Java 包和类

Rhino 定义了顶层变量 `Packages`, 可用于访问顶层 Java 包 (如 [ java / com ] 等).

```js
typeof Packages === 'object'; // true
typeof Packages.java === 'object'; // true
```

为了便于访问, Rhino 提供了顶层包名前缀的快捷访问方式.

```js
Packages.java === java; // true
```

> 注: AutoJs6 顶层化的包名前缀包括 [ android / androidx / java / javax / org / com / net / de / ezy / kotlin / okhttp3 ].

顶层方法 `importPackage` 及 `importClass` 可以像 `import` 语句一样导入包或类.

```js
importPackage(java.io);
typeof File === 'object'; // true
```

上述示例相当于 Java 的导入声明语句 `import java.io.*;`

```js
importClass(java.io.File);
typeof File === 'object'; // true
```

上述示例相当于 Java 的导入声明语句 `import java.io.File;`

```js
const File = java.io.File;
typeof File === 'object'; // true
```

上述示例也可使用解构赋值方式导入 File 类: `const {File} = java.io;`

> 注: 配合 TypeScript Declarations 的 IDE 可能对解构赋值变量无法进行类型识别和代码智能提示.  
> 因此建议使用原始变量声明方式导入需要使用的类.  
> 对于 importClass 和 importPackage, 目前还未能实现类型识别和代码智能提示 (截至 2022 年 7 月).

## 访问扩展的包及类

AutoJs6 的项目扩展库及项目依赖包均可直接访问.

```js
/* 依赖包: implementation("joda-time:joda-time:2.10.14") */
typeof org.joda.time.LocalDateTime.now; // "function"

/* 扩展库: implementation(project(":libs:org.opencv-4.5.5")) */
typeof org.opencv.core.Point; // "function"
```

## 与 Java 协作

Rhino 提供了在 JavaScript 代码中 [ 创建 Java 类 / 调用 Java 方法 / 访问变量 ] 等能力.

### Java 类及方法

```js
let builder = new java.lang.StringBuilder();
builder.append('foo');
builder.append('bar');
builder.toString(); // "foobar"
```

### Java 类的静态方法及字段

```js
java.lang.Math.PI; // 3.141592653589793
java.lang.Math.cos(0); // 1
```

### Java 重载方法签名

```js
new java.io.File("foo").listFiles.toString();

/* 代码结果 (共 5 行) */

// function listFiles() {/*
//     java.io.File[] listFiles(java.io.FileFilter)
//     java.io.File[] listFiles(java.io.FilenameFilter)
//     java.io.File[] listFiles()
// */}
```

### JavaBean 属性

读写方法符合以下命名规范的类称为 JavaBean:

```java
/* 读方法 */
getXyz(): Type
/* 写方法 */
setXyz(Type value): void
```

以下 JavaBean 示例 (Student) 定义了 age 和 sex 属性:

```java
public class Student {

    private int mAge;  
    
    public int getAge() { return mAge; }  
    public void setAge(int anAge) { mAge = anAge; }
      
    public String getSex() { return "male"; }
      
};
```

其中 age 属性可读写, 而 sex 属性只读.

在 JavaScript 代码中可通过实例成员访问属性及方法:

```js
let stu = new Student();
stu.sex; // "male" - 相当于 stu.getSex();
stu.age = 33; /* 相当于 stu.setAge(33); */
stu.age; // 33
stu.getAge(); // 33
```

同样地, 对于属性类型为 boolean 类型的 JavaBean:

```java
public class Student {

    private boolean mMale;  
    
    public boolean isMale() { return mMale; }  
    public String setMale(boolean value) { mMale = value; }
      
};
```

JavaScript 使用方式:

```js
let stu = new Student();
stu.male; // false - 相当于 stu.isMale();
stu.male = true; /* 相当于 stu.setMale(true); */
stu.male; // true
stu.isMale(); // true
```

## 实现 Java 接口

### 函数转换

```js
"ui";

ui.layout(
    <frame>
        <button id="btn" text="BUTTON"/>
    </frame>
);

let listener = new android.view.View.OnClickListener(function (view) {
    toastLog("clicked");
});
ui.btn.setOnClickListener(listener);
```

上述示例将 JavaScript 函数作为 Java 接口传入 `OnClickListener` 方法.  
将函数作为接口使用的条件: 接口只有一个方法 (不可为 0 或多于 1 个) 且参数类型依次匹配.

### 对象转换

若 Java 接口有多个方法, 则可传入一个 JavaScript 对象:

```java
public interface OnAttachStateChangeListener {
    public void onViewAttachedToWindow(View v);
    public void onViewDetachedFromWindow(View v);
}
```

JavaScript 代码实现:

```js
new android.view.View.OnAttachStateChangeListener({
    onViewAttachedToWindow(view) {
        toastLog('attached');
    },
    onViewDetachedFromWindow(view) {
        toastLog('detached');
    },
});
```

## JavaAdapter 构造器

### 实现 Java 接口

```js
new JavaAdapter(android.view.View.OnAttachStateChangeListener, {
    onViewAttachedToWindow(view) {
        toastLog('attached');
    },
    onViewDetachedFromWindow(view) {
        toastLog('detached');
    }
});
```

### 实现多个 Java 接口

```js
/* 语法: new JavaAdapter(javaIntfOrClass, [javaIntf, ..., javaIntf,] javascriptObject) */

new JavaAdapter(android.view.View.OnAttachStateChangeListener, java.lang.Runnable, {
    onViewAttachedToWindow(view) {
        toastLog('attached');
    },
    onViewDetachedFromWindow(view) {
        toastLog('detached');
    },
    run() {
        toastLog('run');
    }
});
```

### 继承 Java 类并重写方法

```js
"ui";

ui.layout(
    <vertical>
        <frame id="container"/>
    </vertical>
);

let paint = new Paint();
/* android.view.View 构造器的参数. */
let viewParam = activity;
let view = new JavaAdapter(android.view.View, {
    onDraw(canvas) {
        /* 调用父类 View 的 onDraw 方法. */
        this.super$onDraw(canvas);
        canvas.drawRect(500, 500, 1000, 1000, paint);
    },
}, viewParam);

ui.container.addView(view);
```
