# Events

> Stability: 2 - Stable

events模块提供了监听手机通知、按键、触摸的接口。您可以用他配合自动操作函数完成自动化工作。

events本身是一个[EventEmiiter](#events_eventemitter), 但内置了一些事件、包括按键事件、通知事件、Toast事件等。

## events.emitter()

返回一个新的[EventEmitter][]。这个EventEmitter没有内置任何事件。

## events.observeKey()

启用按键监听，例如音量键、Home键。此函数使用无障碍服务实现，因此此函数会调用auto()确保无障碍服务启用。

只有这个函数成功执行后, [onKeyDown][], [onKeyUp][]等按键事件的监听才有效。

该函数在安卓4.3以上才能使用。

## events.onKeyDown(keyName, listener)
* `keyName` {string} 要监听的按键名称
* `listener` {Function} 按键监听器。参数为一个[KeyEvent](#events_keyevent)。

注册一个按键监听函数，当有keyName对应的按键被按下会调用该函数。可用的按键名称参见[Keys][]。

例如:
```
//启用按键监听
events.observeKey();
//监听音量上键按下
events.onKeyDown("volume_up", function(event){
    toast("音量上键被按下了");
});
//监听菜单键按下
events.onKeyDown("menu", function(event){
    toast("菜单键被按下了");
    exit();
});
```

## events.onKeyUp(keyName, listener)
* `keyName` {string} 要监听的按键名称
* `listener` {Function} 按键监听器。参数为一个[KeyEvent](#events_keyevent)。

注册一个按键监听函数，当有keyName对应的按键弹起会调用该函数。可用的按键名称参见[Keys](#events_keys)。

一次完整的按键动作包括了按键按下和弹起。按下事件会在手指按下一个按键的"瞬间"触发, 弹起事件则在手指放开这个按键时触发。

例如:
```
//启用按键监听
events.observeKey();
//监听音量下键弹起
events.onKeyDown("volume_down", function(event){
    toast("音量上键弹起");
});
//监听Home键弹起
events.onKeyDown("home", function(event){
    toast("Home键弹起");
    exit();
});
```

## events.onceKeyDown(keyName, listener)
* `keyName` {string} 要监听的按键名称
* `listener` {Function} 按键监听器。参数为一个[KeyEvent](#events_keyevent)

注册一个按键监听函数，当有keyName对应的按键被按下时会调用该函数，之后会注销该按键监听器。

也就是listener只有在onceKeyDown调用后的第一次按键事件被调用一次。

## events.onceKeyUp(keyName, listener)
* `keyName` {string} 要监听的按键名称
* `listener` {Function} 按键监听器。参数为一个[KeyEvent](#events_keyevent)

注册一个按键监听函数，当有keyName对应的按键弹起时会调用该函数，之后会注销该按键监听器。

也就是listener只有在onceKeyUp调用后的第一次按键事件被调用一次。

## events.removeAllKeyDownListeners(keyName)
* `keyName` {string} 按键名称

删除该按键的KeyDown(按下)事件的所有监听。

## events.removeAllKeyUpListeners(keyName)
* `keyName` {string} 按键名称

删除该按键的KeyUp(弹起)事件的所有监听。

## events.observeTouch()

启用屏幕触摸监听。（需要root权限）

只有这个函数被成功执行后, 触摸事件的监听才有效。

没有root权限调用该函数则什么也不会发生。(**注意**: 这个行为未来可能会更改为抛出异常)

## events.setTouchEventTimeout(timeout)
* `timeout` {number} 两个触摸事件的最小间隔。单位毫秒。默认为10毫秒。如果number小于0，视为0处理。

设置两个触摸事件分发的最小时间间隔。

例如间隔为10毫秒的话，前一个触摸事件发生并被注册的监听器处理后，至少要过10毫秒才能分发和处理下一个触摸事件，这10毫秒之间的触摸将会被忽略。

建议在满足需要的情况下尽量提高这个间隔。一个简单滑动动作可能会连续触发上百个触摸事件，如果timeout设置过低可能造成事件拥堵。强烈建议不要设置timeout为0。

## events.getTouchEventTimeout()

返回触摸事件的最小时间间隔。

## events.onTouch(listener)
* `listener` {Function} 参数为[Point][]的函数

注册一个触摸监听函数。相当于`on("touch", listener)`。

例如:
```
//启用触摸监听
events.observeTouch();
//注册触摸监听器
events.onTouch(function(p){
    //触摸事件发生时, 打印出触摸的点的坐标
    log(p.x + ", " + p.y);
});
```

## events.removeAllTouchListeners()

删除所有事件监听函数。

## 事件: 'key'
* `keyCode` {number} 键值
* `event` {KeyEvent} 事件

当有按键被按下或弹起时会触发该事件。
例如：
```
auto();
events.observeKey();
events.on("key", function(keyCode, event){
    //处理按键事件
});
```
其中监听器的参数KeyCode包括：
* `KeyEvent.KEYCODE_HOME` 主页键
* `KeyEvent.KEYCODE_BACK` 返回键
* `KeyEvent.KEYCODE_MENU` 菜单键
* `KeyEvent.KEYCODE_VOLUMEUP` 音量上键
* `KeyEvent.KEYCODE_VOLUMEDOWN` 音量下键

## 事件: 'key_down'
* `keyCode` {number} 键值
* `event` {KeyEvent} 事件

当有按键被按下时会触发该事件。
```
auto();
events.observeKey();
events.on("key_down", function(keyCode, event){
    //处理按键按下事件
});
```

## 事件: 'key_up'
* `keyCode` {number} 键值
* `event` {KeyEvent} 事件

当有按键弹起时会触发该事件。
```
auto();
events.observeKey();
events.on("key_up", function(keyCode, event){
    //处理按键弹起事件
});
```


## obverseNotification()
开启通知(包括Toast)监听。

通知与Toast监听依赖于无障碍服务，因此这个函数会调用`auto()`来确保无障碍服务启用。

例如：
```
events.obverseNotification();
events.onNotification(function(notification){
    log(notification.getText());
});
events.onToast(function(toast){
    log(toast.getText());
});
```

## 事件: 'toast'
* `toast` {Object}
    * `getText()` 获取Toast的文本内容
    * `getPackageName()` 获取发出Toast的应用包名

当有应用发出toast(气泡消息)时会触发该事件。但Auto.js软件本身的toast除外。
例如，要记录发出所有toast的应用：
```
events.obverseNotification();
events.onToast(function(toast){
    log("Toast内容: " + toast.getText() + " 包名: " + toast.getPackageName());
});
```

## 事件: 'notification'
* `notification` {Object} 通知

当有应用发出通知时会触发该事件。

例如：
```
events.observeNotification();
events.on("notification", function(notification){
    log(notification);
});

```

**注意**: 这是一个实验性功能。实测只有某些情况下的通知才能被正确捕捉。

# EventEmitter

> Stability: 2 - Stable

## EventEmitter.defaultMaxListeners

每个事件默认可以注册最多 10 个监听器。 单个 EventEmitter 实例的限制可以使用 emitter.setMaxListeners(n) 方法改变。 所有 EventEmitter 实例的默认值可以使用 EventEmitter.defaultMaxListeners 属性改变。 

设置 EventEmitter.defaultMaxListeners 要谨慎，因为会影响所有 EventEmitter 实例，包括之前创建的。 因而，调用 emitter.setMaxListeners(n) 优先于 EventEmitter.defaultMaxListeners。

注意，与Node.js不同，**这是一个硬性限制**。 EventEmitter 实例不允许添加更多的监听器，监听器超过最大数量时会抛出TooManyListenersException。
```
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // 做些操作
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```
## EventEmitter.addListener(eventName, listener)
* `eventName` {any}
* `listener` {Function}

emitter.on(eventName, listener) 的别名。

## EventEmitter.emit(eventName[, ...args])
* `eventName` {any}
* `args` {any}

按监听器的注册顺序，同步地调用每个注册到名为 eventName 事件的监听器，并传入提供的参数。

如果事件有监听器，则返回 true ，否则返回 false。

## EventEmitter.eventNames()

返回一个列出触发器已注册监听器的事件的数组。 数组中的值为字符串或符号。
```
const myEE = events.emitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// 打印: [ 'foo', 'bar', Symbol(symbol) ]
```
## EventEmitter.getMaxListeners()

返回 EventEmitter 当前的最大监听器限制值，该值可以通过 emitter.setMaxListeners(n) 设置或默认为 EventEmitter.defaultMaxListeners。

## EventEmitter.listenerCount(eventName)
* `eventName` {string} 正在被监听的事件名

返回正在监听名为 eventName 的事件的监听器的数量。

## EventEmitter.listeners(eventName)
* `eventName` {string}

返回名为 eventName 的事件的监听器数组的副本。
```
server.on('connection', (stream) => {
  console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
// 打印: [ [Function] ]
```

## EventEmitter.on(eventName, listener)
* `eventName` {any} 事件名
* `listener` {Function} 回调函数

添加 listener 函数到名为 eventName 的事件的监听器数组的末尾。 不会检查 listener 是否已被添加。 多次调用并传入相同的 eventName 和 listener 会导致 listener 被添加与调用多次。
```
server.on('connection', (stream) => {
  console.log('有连接！');
});
```
返回一个 EventEmitter 引用，可以链式调用。

默认情况下，事件监听器会按照添加的顺序依次调用。 emitter.prependListener() 方法可用于将事件监听器添加到监听器数组的开头。
```
const myEE = events.emitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// 打印:
//   b
//   a
```


## EventEmitter.once(eventName, listener)#
* `eventName` {any} 事件名
* `listener` {Function} 回调函数

添加一个单次 listener 函数到名为 eventName 的事件。 下次触发 eventName 事件时，监听器会被移除，然后调用。
```
server.once('connection', (stream) => {
  console.log('首次调用！');
});
```
返回一个 EventEmitter 引用，可以链式调用。

默认情况下，事件监听器会按照添加的顺序依次调用。 emitter.prependOnceListener() 方法可用于将事件监听器添加到监听器数组的开头。
```
const myEE = events.emitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// 打印:
//   b
//   a
```

## EventEmitter.prependListener(eventName, listener)
* `eventName` {any} 事件名
* `listener` {Function} 回调函数

添加 listener 函数到名为 eventName 的事件的监听器数组的开头。 不会检查 listener 是否已被添加。 多次调用并传入相同的 eventName 和 listener 会导致 listener 被添加与调用多次。
```
server.prependListener('connection', (stream) => {
  console.log('有连接！');
});
```
返回一个 EventEmitter 引用，可以链式调用。

## EventEmitter.prependOnceListener(eventName, listener)
* `eventName` {any} 事件名
* `listener` {Function} 回调函数

添加一个单次 listener 函数到名为 eventName 的事件的监听器数组的开头。 下次触发 eventName 事件时，监听器会被移除，然后调用。
```
server.prependOnceListener('connection', (stream) => {
  console.log('首次调用！');
});
```
返回一个 EventEmitter 引用，可以链式调用。

## EventEmitter.removeAllListeners(\[eventName\])
* `eventName` {any}

移除全部或指定 eventName 的监听器。

注意，在代码中移除其他地方添加的监听器是一个不好的做法，尤其是当 EventEmitter 实例是其他组件或模块创建的。

返回一个 EventEmitter 引用，可以链式调用。

## EventEmitter.removeListener(eventName, listener)
* `eventName` {any}
* `listener` {Function}

从名为 eventName 的事件的监听器数组中移除指定的 listener。
```
const callback = (stream) => {
  console.log('有连接！');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```
removeListener 最多只会从监听器数组里移除一个监听器实例。 如果任何单一的监听器被多次添加到指定 eventName 的监听器数组中，则必须多次调用 removeListener 才能移除每个实例。


注意，一旦一个事件被触发，所有绑定到它的监听器都会按顺序依次触发。 这意味着，在事件触发后、最后一个监听器完成执行前，任何 removeListener() 或 removeAllListeners() 调用都不会从 emit() 中移除它们。 随后的事件会像预期的那样发生。
```
const myEmitter = events.emitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA 移除了监听器 callbackB，但它依然会被调用。
// 触发是内部的监听器数组为 [callbackA, callbackB]
myEmitter.emit('event');
// 打印:
//   A
//   B

// callbackB 被移除了。
// 内部监听器数组为 [callbackA]
myEmitter.emit('event');
// 打印:
//   A
```
因为监听器是使用内部数组进行管理的，所以调用它会改变在监听器被移除后注册的任何监听器的位置索引。 虽然这不会影响监听器的调用顺序，但意味着由 emitter.listeners() 方法返回的监听器数组副本需要被重新创建。

返回一个 EventEmitter 引用，可以链式调用。

## EventEmitter.setMaxListeners(n)
* `n` {number}

默认情况下，如果为特定事件添加了超过 10 个监听器，则 EventEmitter 会打印一个警告。 此限制有助于寻找内存泄露。 但是，并不是所有的事件都要被限为 10 个。 emitter.setMaxListeners() 方法允许修改指定的 EventEmitter 实例的限制。 值设为 Infinity（或 0）表明不限制监听器的数量。

返回一个 EventEmitter 引用，可以链式调用。

# KeyEvent

> Stability: 2 - Stable

## KeyEvent.getAction()

返回事件的动作。包括：
* `KeyEvent.ACTION_DOWN` 按下事件
* `KeyEvent.ACTION_UP` 弹起事件

## KeyEvent.getKeyCode()

返回按键的键值。包括：
* `KeyEvent.KEYCODE_HOME` 主页键
* `KeyEvent.KEYCODE_BACK` 返回键
* `KeyEvent.KEYCODE_MENU` 菜单键
* `KeyEvent.KEYCODE_VOLUME_UP` 音量上键
* `KeyEvent.KEYCODE_VOLUME_DOWN` 音量下键

## KeyEvent.getEventTime()

返回事件发生的时间戳。返回值的类型是number。

## KeyEvent.getDownTime()

返回最近一次按下事件的时间戳。如果本身是按下事件，则与getEventTime()相同。

## KeyEvent.keyCodeToString(keyCode)

把键值转换为字符串。例如KEYCODE_HOME转换为"KEYCODE_HOME"。

# Keys

> Stability: 2 - Stable

按键事件中所有可用的按键名称为：
* `volume_up`  音量上键
* `volume_down` 音量下键
* `home` 主屏幕键
* `back` 返回键
* `menu` 菜单键
