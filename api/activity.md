# 活动 (Activity)

Activity 是 Android 的关键组件.

Activity 的启动和组合方式是 Android 应用模型的基本组成部分.  

Android 系统通过调用与其生命周期特定阶段相对应的特定回调方法来启动 Activity 实例中的代码. 当一个应用调用另一个应用时, 调用方会调用另一个应用中的 Activity, 而非整个应用. 通过这种方式, Activity 充当了应用与用户互动的入口点.  

Activity 提供窗口用于界面的绘制. 此窗口通常会填满屏幕并浮动于其他所有窗口之上. 

一个 Activity 通常用于实现应用中的一个屏幕. 例如, 一个 Activity 实现 "设置" 屏幕, 另一个 Activity 实现 "选择文件" 屏幕. 

大多数应用包含多个屏幕, 即多个 Activity. 通常, 应用中的一个 Activity 会被指定为主 Activity, 这是应用启动时出现的首个屏幕. 每个 Activity 可启动另一个 Activity 以执行不同操作.

在 AutoJs6 的 UI 模式下, 存在一个全局可用的 activity 对象:

```js
'ui';
typeof activity === 'object'; // true
species(activity); // JavaObject
util.getClassName(activity); // org.autojs.autojs.execution.ScriptExecuteActivity
```

activity 是一个 `ScriptExecuteActivity` 实例, 同时也是一个 `Activity` 实例, 详见 [数据类型](dataTypes#scriptexecuteactivity) 章节.