# Console

> Stability: 2 - Stable

控制台模块提供了一个和Web浏览器中相似的用于调试的控制台。用于输出一些调试信息、中间结果等。
console模块中的一些函数也可以直接作为全局函数使用，例如log, print等。

## console.show()

显示控制台。这会显示一个控制台的悬浮窗(需要悬浮窗权限)。

## console.hide()

隐藏控制台悬浮窗。

## console.clear()

清空控制台。

## console.log([data][, ...args])#
* `data` <any>
* `...args` <any>

打印到控制台，并带上换行符。 可以传入多个参数，第一个参数作为主要信息，其他参数作为类似于 [printf(3)](http://man7.org/linux/man-pages/man3/printf.3.html) 中的代替值（参数都会传给 util.format()）。

```
const count = 5;
console.log('count: %d', count);
// 打印: count: 5 到 stdout
console.log('count:', count);
// 打印: count: 5 到 stdout
```

详见 util.format()。

该函数也可以作为全局函数使用。

## console.verbose([data][, ...args])
* `data` <any>
* `...args` <any>

与console.log类似，但输出结果以灰色字体显示。输出优先级低于log，用于输出观察性质的信息。

## console.info([data][, ...args])
* `data` <any>
* `...args` <any>

与console.log类似，但输出结果以绿色字体显示。输出优先级高于log, 用于输出重要信息。

## console.warn([data][, ...args])
* `data` <any>
* `...args` <any>

与console.log类似，但输出结果以蓝色字体显示。输出优先级高于info, 用于输出警告信息。

## console.error([data][, ...args])
* `data` <any>
* `...args` <any>

与console.log类似，但输出结果以红色字体显示。输出优先级高于warn, 用于输出错误信息。

## console.assert(value, message)
* value {any} 要断言的布尔值
* message {string} value为false时要输出的信息

断言。如果value为false则输出错误信息message并停止脚本运行。

```
var a = 1 + 1;
console.assert(a == 2, "加法出错啦");
```

## console.input(data[, ...args])
* `data` <any>
* `...args` <any>

与console.log一样输出信息，并在控制台显示输入框等待输入。按控制台的确认按钮后会将输入的字符串用eval计算后返回。

**部分机型可能会有控制台不显示输入框的情况，属于bug。**

例如：
```
var n = console.input("请输入一个数字:"); 
//输入123之后：
toast(n + 1);
//显示124
```

## console.rawInput(data[, ...args])
* `data` <any>
* `...args` <any>

与console.log一样输出信息，并在控制台显示输入框等待输入。按控制台的确认按钮后会将输入的字符串直接返回。

部分机型可能会有控制台不显示输入框的情况，属于bug。

例如：
```
var n = console.rawInput("请输入一个数字:"); 
//输入123之后：
toast(n + 1);
//显示1231
```

## console.setSize(w, h)
* `w` {number} 宽度
* `h` {number} 高度

设置控制台的大小，单位像素。
```
console.show();
//设置控制台大小为屏幕的四分之一
console.setSize(device.width / 2, device.height / 2);
```

## console.setPosition(x, y)
* `x` {number} 横坐标
* `y` {number} 纵坐标

设置控制台的位置，单位像素。

```
console.show();
console.setPosition(100, 100);
```

## print(text)
* text {string} | {Object} 要打印到控制台的信息

相当于`log(text)`。


