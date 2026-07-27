# 事件监听 (Events)

---

<aside class="doc-status doc-status--incomplete" data-marked-by="SuperMonster003" data-marked-on="2022-10-22">
<p><strong>文档状态:</strong> 此章节仍在补充或完善中.</p>
</aside>

events 模块提供了监听手机通知, 按键, 触摸的接口. 您可以用他配合自动操作函数完成自动化工作.

events 本身是一个 [EventEmitter](#events_eventemitter), 但内置了一些事件, 包括按键事件, 通知事件, Toast 事件等.

需要注意的是, 事件的处理是单线程的, 并且仍然在原线程执行, 如果脚本主体或者其他事件处理中有耗时操作, 轮询等, 则事件将无法得到及时处理 (会进入事件队列等待脚本主体或其他事件处理完成才执行). 例如:

```
auto();
events.observeNotification();
events.on('toast', function(t){
    // 这段代码将得不到执行.
    log(t);
});
while(true){
    // 死循环.
}
```

## events.emitter()

返回一个新的 [EventEmitter](#events_eventemitter). 这个 EventEmitter 没有内置任何事件.

## events.observeKey()

启用按键监听, 例如音量键, Home 键. 按键监听使用无障碍服务实现, 如果无障碍服务未启用会抛出异常并提示开启.

只有这个函数成功执行后, `onKeyDown`, `onKeyUp` 等按键事件的监听才有效.

该函数在安卓 4.3 以上才能使用.

## events.onKeyDown(keyName, listener)

- **keyName** { [string](dataTypes#string) } 要监听的按键名称
- **listener** { [Function](dataTypes#function) } 按键监听器. 参数为一个 [KeyEvent](#events_keyevent).

注册一个按键监听函数, 当有 keyName 对应的按键被按下会调用该函数. 可用的按键名称参见 [Keys](keys).

例如:

```
// 启用按键监听.
events.observeKey();
// 监听音量上键按下.
events.onKeyDown("volume_up", function(event){
    toast("音量上键被按下了");
});
// 监听菜单键按下.
events.onKeyDown("menu", function(event){
    toast("菜单键被按下了");
    exit();
});
```

## events.onKeyUp(keyName, listener)

- **keyName** { [string](dataTypes#string) } 要监听的按键名称
- **listener** { [Function](dataTypes#function) } 按键监听器. 参数为一个 [KeyEvent](#events_keyevent).

注册一个按键监听函数, 当有 keyName 对应的按键弹起会调用该函数. 可用的按键名称参见 [Keys](keys).

一次完整的按键动作包括了按键按下和弹起. 按下事件会在手指按下一个按键的 "瞬间" 触发, 弹起事件则在手指放开这个按键时触发.

例如:

```
// 启用按键监听.
events.observeKey();
// 监听音量下键弹起.
events.onKeyDown("volume_down", function(event){
    toast("音量上键弹起");
});
// 监听 Home 键弹起.
events.onKeyDown("home", function(event){
    toast("Home 键弹起");
    exit();
});
```

## events.onceKeyDown(keyName, listener)

- **keyName** { [string](dataTypes#string) } 要监听的按键名称
- **listener** { [Function](dataTypes#function) } 按键监听器. 参数为一个 [KeyEvent](#events_keyevent)

注册一个按键监听函数, 当有 keyName 对应的按键被按下时会调用该函数, 之后会注销该按键监听器.

也就是 listener 只有在 onceKeyDown 调用后的第一次按键事件被调用一次.

## events.onceKeyUp(keyName, listener)

- **keyName** { [string](dataTypes#string) } 要监听的按键名称
- **listener** { [Function](dataTypes#function) } 按键监听器. 参数为一个 [KeyEvent](#events_keyevent)

注册一个按键监听函数, 当有 keyName 对应的按键弹起时会调用该函数, 之后会注销该按键监听器.

也就是 listener 只有在 onceKeyUp 调用后的第一次按键事件被调用一次.

## events.removeAllKeyDownListeners(keyName)

- **keyName** { [string](dataTypes#string) } 按键名称

删除该按键的 KeyDown (按下) 事件的所有监听.

## events.removeAllKeyUpListeners(keyName)

- **keyName** { [string](dataTypes#string) } 按键名称

删除该按键的 KeyUp (弹起) 事件的所有监听.

## events.setKeyInterceptionEnabled([key, ]enabled)

- **enabled** { [boolean](dataTypes#boolean) }
- **key** { [string](dataTypes#string) } 要屏蔽的按键

设置按键屏蔽是否启用. 所谓按键屏蔽指的是, 屏蔽原有按键的功能, 例如使得音量键不再能调节音量, 但此时仍然能通过按键事件监听按键.

如果不加参数 key 则会屏蔽所有按键.

例如, 调用 `events.setKeyInterceptionEnabled(true)` 会使系统的音量, Home, 返回等键不再具有调节音量, 回到主页, 返回的作用, 但此时仍然能通过按键事件监听按键.

该函数通常于按键监听结合, 例如想监听音量键并使音量键按下时不弹出音量调节框则为:

```
events.setKeyInterceptionEnabled("volume_up", true);
events.observeKey();
events.onKeyDown("volume_up", ()=>{
    log("音量上键被按下");
});
```

只要有一个脚本屏蔽了某个按键, 该按键便会被屏蔽; 当脚本退出时, 会自动解除所有按键屏蔽.

## events.observeTouch()

启用屏幕触摸监听 (需要 root 权限).

只有这个函数被成功执行后, 触摸事件的监听才有效.

没有 root 权限调用该函数则什么也不会发生.

## events.setTouchEventTimeout(timeout)

- **timeout** { [number](dataTypes#number) } 两个触摸事件的最小间隔. 单位毫秒. 默认为 10 毫秒. 如果 number 小于 0, 视为 0 处理.

设置两个触摸事件分发的最小时间间隔.

例如间隔为 10 毫秒的话, 前一个触摸事件发生并被注册的监听器处理后, 至少要过 10 毫秒才能分发和处理下一个触摸事件, 这 10 毫秒之间的触摸将会被忽略.

建议在满足需要的情况下尽量提高这个间隔. 一个简单滑动动作可能会连续触发上百个触摸事件, 如果 timeout 设置过低可能造成事件拥堵. 强烈建议不要设置 timeout 为 0.

## events.getTouchEventTimeout()

返回触摸事件的最小时间间隔.

## events.onTouch(listener)

- **listener** { [Function](dataTypes#function) } - 回调参数为 [android.graphics.Point](https://developer.android.com/reference/android/graphics/Point)

注册一个触摸监听函数. 相当于 `on("touch", listener)`.

例如:

```
// 启用触摸监听.
events.observeTouch();
// 注册触摸监听器.
events.onTouch(function(p){
    // 触摸事件发生时, 打印出触摸的点的坐标.
    log(p.x + ", " + p.y);
});
```

## events.removeAllTouchListeners()

删除所有事件监听函数.

## 事件: 'key'

- **keyCode** { [number](dataTypes#number) } 键值
- **event** {KeyEvent} 事件

当有按键被按下或弹起时会触发该事件.
例如:

```
auto();
events.observeKey();
events.on("key", function(keyCode, event){
    // 处理按键事件.
});
```

其中监听器的参数 KeyCode 包括:

* `keys.home` 主页键
* `keys.back` 返回键
* `keys.menu` 菜单键
* `keys.volume_up` 音量上键
* `keys.volume_down` 音量下键

例如:

```
auto();
events.observeKey();
events.on("key", function(keyCode, event){
    if(keyCode == keys.menu && event.getAction() == event.ACTION_UP){
        toast("菜单键按下");
    }
});
```

## 事件: 'key_down'

- **keyCode** { [number](dataTypes#number) } 键值
- **event** {KeyEvent} 事件

当有按键被按下时会触发该事件.

```
auto();
events.observeKey();
events.on("key_down", function(keyCode, event){
    // 处理按键按下事件.
});
```

## 事件: 'key_up'

- **keyCode** { [number](dataTypes#number) } 键值
- **event** {KeyEvent} 事件

当有按键弹起时会触发该事件.

```
auto();
events.observeKey();
events.on("key_up", function(keyCode, event){
    // 处理按键弹起事件.
});
```

## 事件: 'exit'

当脚本正常或者异常退出时会触发该事件. 事件处理中如果有异常抛出, 则立即中止 exit 事件的处理 (即使 exit 事件有多个处理函数) 并在控制台和日志中打印该异常.

一个脚本停止运行时, 会关闭该脚本的所有悬浮窗, 触发 exit 事件, 之后再回收资源. 如果 exit 事件的处理中有死循环, 则后续资源无法得到及时回收.
此时脚本会停留在任务列表, 如果在任务列表中关闭, 则会强制结束 exit 事件的处理并回收后续资源.

```
log("开始运行")
events.on("exit", function(){
    log("结束运行");
});
log("即将结束运行");
```

## events.observeNotification()

开启通知监听. 例如 QQ 消息, 微信消息, 推送等通知.

通知监听依赖于通知服务, 如果通知服务没有运行, 会抛出异常并跳转到通知权限开启界面 (有时即使通知权限已经开启通知服务也没有运行, 这时需要关闭权限再重新开启一次).

例如:

```
events.observeNotification();
events.onNotification(function(notification){
    log(notification.getText());
});
```

## events.observeToast()

开启 Toast 监听.

Toast 监听依赖于无障碍服务, 因此此函数会确保无障碍服务运行.

## 事件: 'toast'

- **toast** { [Object](dataTypes#object) }
    * `getText()` 获取 Toast 的文本内容
    * `getPackageName()` 获取发出 Toast 的应用包名

当有应用发出 toast (气泡消息) 时会触发该事件. 但 AutoJs6 软件本身的 toast 除外.

例如, 要记录发出所有 toast 的应用:

```
events.observeToast();
events.onToast(function(toast){
    log("Toast 内容: " + toast.getText() + " 包名: " + toast.getPackageName());
});
```

## 事件: 'notification'

* `notification` [Notification](#events_notification) 通知对象

当有应用发出通知时会触发该事件, 参数为 [Notification](#events_notification).

例如:

```
events.observeNotification();
events.on("notification", function(n){
    log("收到新通知:\n标题: %s, 内容: %s,\n包名: %s", n.getTitle(), n.getText(), n.getPackageName());
});
```

# Notification

通知对象, 可以获取通知详情, 包括通知标题, 内容, 发出通知的包名, 时间等, 也可以对通知进行操作, 比如点击, 删除.

## Notification.number

- { [number](dataTypes#number) }

通知数量. 例如 QQ 连续收到两条消息时 number 为 2.

## Notification.when

- { [number](dataTypes#number) }

通知发出时间的时间戳, 可以用于构造 `Date` 对象. 例如:

```
events.observeNotification();
events.on("notification", function(n){
    log("通知时间: " + new Date(n.when));
});
```

## Notification.getPackageName()

- <ins>**returns**</ins> { [string](dataTypes#string) }

获取发出通知的应用包名.

## Notification.getTitle()

- <ins>**returns**</ins> { [string](dataTypes#string) }

获取通知的标题.

## Notification.getText()

- <ins>**returns**</ins> { [string](dataTypes#string) }

获取通知的内容.

## Notification.click()

点击该通知. 例如对于一条 QQ 消息, 点击会进入具体的聊天界面.

## Notification.delete()

删除该通知. 该通知将从通知栏中消失.

# KeyEvent

## KeyEvent.getAction()

返回事件的动作. 包括:

* `KeyEvent.ACTION_DOWN` 按下事件
* `KeyEvent.ACTION_UP` 弹起事件

## KeyEvent.getKeyCode()

返回按键的键值. 包括:

* `KeyEvent.KEYCODE_HOME` 主页键
* `KeyEvent.KEYCODE_BACK` 返回键
* `KeyEvent.KEYCODE_MENU` 菜单键
* `KeyEvent.KEYCODE_VOLUME_UP` 音量上键
* `KeyEvent.KEYCODE_VOLUME_DOWN` 音量下键

## KeyEvent.getEventTime()

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回事件发生的时间戳.

## KeyEvent.getDownTime()

返回最近一次按下事件的时间戳. 如果本身是按下事件, 则与 `getEventTime()` 相同.

## KeyEvent.keyCodeToString(keyCode)

把键值转换为字符串. 例如 KEYCODE_HOME 转换为 "KEYCODE_HOME".

# 按键代码

按键监听器接收的键码可与 [keys](keys) 对象中的 Android `KeyEvent.KEYCODE_*` 常量比较. 按键代码属性, 无障碍全局动作和 Shell 按键指令统一在 [Keys - 按键](keys) 章节说明.

# EventEmitter

`events`, `events.broadcast` 及本页返回的多个监听对象使用 AutoJs6 EventEmitter 能力. 事件名称, 监听器上限, 粘性事件, Timer 调度和全部实例成员统一参阅 [EventEmitter - 事件发射器](eventEmitterType).

# events.broadcast: 脚本间广播

`events.broadcast` 是当前脚本运行时持有的进程内广播发射器. 它继承 [EventEmitter](eventEmitterType), 但重写了 `emit`.

同一 AutoJs6 进程中, 每个尚未回收或注销的脚本广播发射器都会收到广播. 监听器通过各脚本的主 Timer 调度, 不会在发送广播的线程中直接执行. 此机制不跨越 Android 进程, 也不是系统广播.

---

<p style="font: bold 1em sans-serif; color: #FF7043">events.broadcast</p>

---

## [m] emit

### emit(eventName, ...args)

- **eventName** { [string](dataTypes#string) } - 广播事件名称
- **...args** { [...](documentation#可变参数)[any](dataTypes#any)[[]](documentation#可变参数) } - 传给每个监听器的参数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 固定为 `true`

向当前进程的全部已注册脚本广播事件, 包括发送方自身.

发送脚本:

```js
events.broadcast.emit('message', 'hello');
```

接收脚本:

```js
events.broadcast.on('message', function (text) {
    console.log(text);
});
```

## [m] unregister

### unregister()

- <ins>**returns**</ins> { [void](dataTypes#void) }

从进程内广播列表注销当前发射器. 注销后仍可发送广播, 但不再接收广播. 脚本运行时回收时会自动调用此方法.
