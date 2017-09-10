# 全局变量与函数

全局变量和函数在所有模块中均可使用。 但以下变量的作用域只在模块内，详见 module文档：
* exports
* module
* require()
以下的对象是特定于 Auto.js 的。 有些内置对象是 JavaScript 语言本身的一部分，它们也是全局的。

一些模块中的函数为了使用方便也可以直接全局使用，这些函数在此不再赘述。例如timers模块的setInterval等函数。

## sleep([n])
* `n` {number} 毫秒数

暂停运行n**毫秒**的时间。1秒等于1000毫秒。

## launchPackage(packageName)
* `packageName` {string} 应用包名

运行包名为packageName的应用主界面(Launcher)。例如，打开微信为：
```
launchPackage("com.tencent.mm");
```
如果存在多个应用包名相同的情况（如双开应用），如何处理取决于操作系统。在MIUI中会弹出多开应用的选择界面。

## launchApp(appName)
* `appName` {String} 应用名称

运行应用名称为appName的应用主界面。当有应用名称相同时只运行其中某一个。  
例如，打开微信为：
```
launchApp("微信");
```

## currentPackage()
返回最近一次监测到的正在运行的应用的包名，一般可以认为就是当前正在运行的应用的包名。

## currentActivity()
返回最近一次监测到的正在运行的Activity的名称，一般可以认为就是当前正在运行的Activity的名称。

## getPackageName(appName)
* `appName` {string} 应用名称

获取应用的包名。例如getPackageName("QQ")为"com.tencent.mobileqq"。如果有相同名称的应用，只返回其中某一个的包名。如果不存在这个名称的应用，会返回null。

## getAppName(packageName)
* `packageName` {string} 应用包名

返回对应包名的应用的名称。如果应用不存在，返回null。

## openAppSetting(packageName)
* `packageName` {string} 应用包名

打开某个应用的应用详情页，也就是管理应用权限和可以停止其运行的页面。如果应用包名不存在，则返回false；否则返回true。

## setClip(text)
* `text` {string} 文本

设置剪贴板内容。此剪贴板即系统剪贴板，在一般应用的输入框中"粘贴"既可使用。

## getClip()

返回系统剪贴板的内容。


## toast(message)
* message {string\> | {Object} 要显示的信息

以气泡显示信息message几秒。(具体时间取决于安卓系统，一般都是2秒)

注意，信息的显示是"异步"执行的(不属于Looper循环)，并且，不会等待信息消失程序才继续执行。如果在循环中执行该命令，可能出现脚本停止运行后仍然有不断的气泡信息出现的情况。
例如:
```
for(var i = 0; i < 100; i++){
  toast(i);
}
```
运行这段程序以后，会很快执行完成，且不断弹出消息，在任务管理中关闭所有脚本也无法停止。
要保证气泡消息才继续执行可以用：
```
for(var i = 0; i < 100; i++){
  toast(i);
  sleep(2000);
}
```
或者修改toast函数：
```
var _toast_ = toast;
toast = function(message){
  _toast_(message);
  sleep(2000);
}
for(var i = 0; i < 100; i++){
  toast(i);
  sleep(2000);
}
```

## toastLog(message)
* message \<String\> | \<Object\> 要显示的信息

相当于`toast(message);log(message)`。显示信息message并在控制台中输出。参见console.log。

## waitForActivity(activity[, period = 200])
* `activity` Activity名称
* `period` 轮询等待间隔（毫秒）

等待指定的Activity出现，period为检查Activity的间隔。


## waitForPackage(package\[, period = 200\])
* `package` 包名
* `period` 轮询等待间隔（毫秒）

等待指定的应用出现。例如`waitForPackage("com.tencent.mm")`为等待当前界面为微信。

## exit()
立即停止脚本运行。

## random(min, max)
* `min` {number} 随机数产生的区间下界
* `max` {number} 随机数产生的区间上界

返回一个在\[min...max\]之间的随机数。例如random(0, 2)可能产生0, 1, 2.

## random()

返回在[0, 1)的随机浮点数。

## context

全局变量。一个android.content.Context对象。

注意该对象为ApplicationContext，因此不能用于界面、对话框等的创建。