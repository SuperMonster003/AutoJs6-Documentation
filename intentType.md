# 意图 (Intent)

---

<p style="font: italic 1em sans-serif; color: #78909C">此章节待补充或完善...</p>
<p style="font: italic 1em sans-serif; color: #78909C">Marked by SuperMonster003 on Nov 18, 2022.</p>

---

作为概念, Intent (意图) 是一个消息传递对象.

在 AutoJs6 中, Intent 作为全局对象, 支持全局调用:

```js
/* 仅用作示例展示. */
app.startActivity(new Intent()
    .setAction("x")
    .setData('x')
    .setClass('x')
    .setFlags(0));

/* app.intent 方法返回 Intent 类型数据. */
console.log(app.intent({ data: 'protocol://data' }) instanceof Intent); // true

/* Intent 是 android.conent.Intent 的别名. */
console.log(Intent === android.content.Intent); // true
```

您可以使用它从其他应用组件请求操作. 尽管 Intent 可以通过多种方式促进组件之间的通信, 但其基本用例主要包括以下三个：

* 启动活动(Activity)：
  Activity 表示应用中的一个"屏幕". 例如应用主入口都是一个Activity, 应用的功能通常也以Activity的形式独立, 例如微信的主界面、朋友圈、聊天窗口都是不同的Activity. 通过将 Intent 传递给 startActivity(), 您可以启动新的 Activity 实例. Intent 描述了要启动的 Activity, 并携带了任何必要的数据.

* 启动服务(Service)：
  Service 是一个不使用用户界面而在后台执行操作的组件. 通过将 Intent 传递给 startService(), 您可以启动服务执行一次性操作（例如, 下载文件）. Intent 描述了要启动的服务, 并携带了任何必要的数据.

* 传递广播：
  广播是任何应用均可接收的消息. 系统将针对系统事件（例如：系统启动或设备开始充电时）传递各种广播. 通过将 Intent 传递给 sendBroadcast()、sendOrderedBroadcast() 或 sendStickyBroadcast(), 您可以将广播传递给其他应用.

本模块提供了构建Intent的函数(`app.intent()`), 启动Activity的函数`app.startActivity()`, 发送广播的函数`app.sendBroadcast()`.

使用这些方法可以用来方便的调用其他应用. 例如直接打开某个QQ号的个人卡片页, 打开某个QQ号的聊天窗口等.

```js
let qq = "2732014414";
app.startActivity({
    action: "android.intent.action.VIEW",
    data: "mqq://im/chat?chat_type=wpa&version=1&src_type=web&uin=" + qq,
    packageName: "com.tencent.mobileqq",
});

```