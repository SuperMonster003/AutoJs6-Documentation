# 事件发射器 (EventEmitter)

EventEmitter 是 AutoJs6 Rhino 运行时中的 Java 事件发射器类型. `events`, `sensors` 以及多个异步结果对象都继承或使用此类型.

本页描述 `org.autojs.autojs.core.eventloop.EventEmitter`, 不描述 Node.js `events` 模块中的 JavaScript `EventEmitter`.

全局 Java 类 `EventEmitter` 的公开构造方法需要 AutoJs6 内部的 `ScriptBridges` 和可选 `Timer`, 因此不能使用 `new EventEmitter()` 创建无参实例. 普通脚本应使用 [events.emitter()](events#events-emitter) 创建实例.

```js
let emitter = events.emitter();

emitter.on('message', (text) => {
    console.log(text);
});

emitter.emit('message', 'hello');
```

事件名称必须是 [string](dataTypes#string). 此实现不支持以 `Symbol` 作为事件名称, 也没有 Node.js EventEmitter 的 `off` 或 `rawListeners` 方法. 名为 `error` 的事件没有特殊行为.

从 AutoJs6 6.8.0 起, 监听器参数接受 Rhino `Callable`, 包括使用 `Proxy` 包装的 JavaScript 函数. 单次监听器会在调用前移除, 因此递归触发或监听器抛出异常都不会使它再次执行.

## 调用线程

由 `events.emitter()` 创建的发射器不绑定 `Timer`. 它的监听器在调用 `emit` 的线程中按顺序直接执行.

由 `events.emitter(thread)` 或 AutoJs6 内部组件创建的发射器可能绑定 `Timer`. 此时 `emit` 会把监听器作为立即任务提交给对应事件循环. 因此调用是否同步不能只由 EventEmitter 类型判断, 可使用 [getTimer](#m-eventemittergettimer) 检查实例是否绑定计时器.

## 监听器上限

监听器上限按事件名称分别计算, 默认值为 `10`. 与 Node.js 只发出警告的行为不同, AutoJs6 达到上限后继续添加监听器会抛出由 `TooManyListenersException` 包装的脚本异常.

将上限设为 `0` 表示不限制. 设置较小上限不会删除已经存在的监听器, 但后续添加会按新上限检查.

---

## [p] EventEmitter.defaultMaxListeners

**`Getter/Setter`**

- [ `10` ] { [number](dataTypes#number) } - 新实例使用的默认单事件监听器上限

此静态字段只在创建 EventEmitter 实例时复制到实例. 修改它不会改变已经存在的实例.

源码同时提供了同名静态方法. Rhino 会把同名字段和方法包装为一个可调用成员. 赋值可修改字段, 读取数值时建议调用 [EventEmitter.defaultMaxListeners()](#eventemitterdefaultmaxlisteners).

```js
let previous = EventEmitter.defaultMaxListeners();

EventEmitter.defaultMaxListeners = 20;
let emitter = events.emitter();
console.log(emitter.getMaxListeners()); // 20

EventEmitter.defaultMaxListeners = previous;
```

## [m] EventEmitter.defaultMaxListeners

### EventEmitter.defaultMaxListeners()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前静态默认上限

读取 [EventEmitter.defaultMaxListeners](#p-eventemitterdefaultmaxlisteners) 静态字段.

---

## [m#] EventEmitter#addListener

### addListener(eventName, listener)

**`[6.8.0]`**

- **eventName** { [string](dataTypes#string) } - 事件名称
- **listener** { [Function](dataTypes#function) } - 事件监听器
- <ins>**returns**</ins> { [EventEmitter](#事件发射器-eventemitter) } - 当前发射器

[on](#m-eventemitteron) 的同义方法.

## [m#] EventEmitter#on

### on(eventName, listener)

**`[6.8.0]`**

- **eventName** { [string](dataTypes#string) } - 事件名称
- **listener** { [Function](dataTypes#function) } - 持续事件监听器
- <ins>**returns**</ins> { [EventEmitter](#事件发射器-eventemitter) } - 当前发射器

把监听器添加到指定事件监听器列表的末尾. 不检查重复项, 因此多次添加同一个函数会使它被调用多次.

如果此事件已经由 [emitSticky](#m-eventemitteremitsticky) 保存了参数, `listener` 会立即执行或被立即调度一次, 随后仍会注册以接收未来事件.

添加完成后触发 `newListener` 事件.

## [m#] EventEmitter#once

### once(eventName, listener)

**`[6.8.0]`**

- **eventName** { [string](dataTypes#string) } - 事件名称
- **listener** { [Function](dataTypes#function) } - 单次事件监听器
- <ins>**returns**</ins> { [EventEmitter](#事件发射器-eventemitter) } - 当前发射器

把单次监听器添加到指定事件监听器列表的末尾. 下一次触发时先移除监听器, 再执行它.

如果此事件已有粘性参数, `listener` 会立即执行或被立即调度一次, 且不会再加入监听器列表.

## [m#] EventEmitter#prependListener

### prependListener(eventName, listener)

**`[6.8.0]`**

- **eventName** { [string](dataTypes#string) } - 事件名称
- **listener** { [Function](dataTypes#function) } - 持续事件监听器
- <ins>**returns**</ins> { [EventEmitter](#事件发射器-eventemitter) } - 当前发射器

把监听器添加到指定事件监听器列表的开头. 此方法不重放 [emitSticky](#m-eventemitteremitsticky) 保存的参数.

## [m#] EventEmitter#prependOnceListener

### prependOnceListener(eventName, listener)

**`[6.8.0]`**

- **eventName** { [string](dataTypes#string) } - 事件名称
- **listener** { [Function](dataTypes#function) } - 单次事件监听器
- <ins>**returns**</ins> { [EventEmitter](#事件发射器-eventemitter) } - 当前发射器

把单次监听器添加到指定事件监听器列表的开头. 下一次触发时先移除监听器, 再执行它. 此方法不重放粘性参数.

## [m#] EventEmitter#emit

### emit(eventName, ...args)

- **eventName** { [string](dataTypes#string) } - 事件名称
- **...args** { [...](documentation#可变参数)[any](dataTypes#any)[[]](documentation#可变参数) } - 传给每个监听器的参数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 调用时是否存在至少一个监听器

按监听器列表顺序执行或调度当前事件的监听器. `prependListener` 和 `prependOnceListener` 添加的监听器位于普通监听器之前.

发射期间删除监听器不会从本次已经取得的监听器快照中移除它, 但会影响后续发射. 直接调用模式下, 监听器抛出的异常会向调用方传播, 且本次后续监听器不会继续执行.

```js
let emitter = events.emitter();

emitter.on('data', (value) => console.log(`second: ${value}`));
emitter.prependListener('data', (value) => console.log(`first: ${value}`));

console.log(emitter.emit('data', 1)); // true
console.log(emitter.emit('missing')); // false
```

## [m#] EventEmitter#emitSticky

### emitSticky(eventName, ...args)

- **eventName** { [string](dataTypes#string) } - 事件名称
- **...args** { [...](documentation#可变参数)[any](dataTypes#any)[[]](documentation#可变参数) } - 当前及后续监听器接收的参数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 调用时是否存在至少一个监听器

先按 [emit](#m-eventemitteremit) 的规则发射事件, 再保存本次参数. 后续通过 `on` 或 `once` 添加的监听器会收到最近一次保存的参数.

同一事件再次调用 `emitSticky` 会覆盖旧参数. 普通 `emit`, `removeListener` 和 `removeAllListeners` 都不会清除已保存的粘性参数. 当前没有清除粘性参数的公开方法.

在直接调用模式下, 如果现有监听器抛出异常, 调用会在保存参数之前中断.

## [m#] EventEmitter#eventNames

### eventNames()

- <ins>**returns**</ins> { [string](dataTypes#string)[[]](dataTypes#array) } - 内部已建立监听器列表的事件名称

返回值顺序未定义. [listeners](#m-eventemitterlisteners) 会为尚不存在的事件创建空列表, 因此返回值可能包含当前监听器数量为 `0` 的事件名称.

## [m#] EventEmitter#listenerCount

### listenerCount(eventName)

- **eventName** { [string](dataTypes#string) } - 事件名称
- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前监听器数量

## [m#] EventEmitter#listeners

### listeners(eventName)

- **eventName** { [string](dataTypes#string) } - 事件名称
- <ins>**returns**</ins> { [Function](dataTypes#function)[[]](dataTypes#array) } - 监听器数组副本

修改返回的数组不会改变发射器中的监听器. 查询尚不存在的事件会在内部建立一个空监听器列表.

## [m#] EventEmitter#removeListener

### removeListener(eventName, listener)

**`[6.8.0]`**

- **eventName** { [string](dataTypes#string) } - 事件名称
- **listener** { [Function](dataTypes#function) } - 要移除的监听器
- <ins>**returns**</ins> { [EventEmitter](#事件发射器-eventemitter) } - 当前发射器

按函数对象身份移除第一个匹配的监听器. 同一个函数被重复添加时, 每次调用最多移除一个注册项.

成功移除后触发 `removeListener` 事件. 没有匹配项时不触发.

## [m#] EventEmitter#removeAllListeners

### removeAllListeners()

**`Overload 1/2`**

- <ins>**returns**</ins> { [EventEmitter](#事件发射器-eventemitter) } - 当前发射器

移除全部事件的全部监听器. 每个被移除的注册项都会触发一次 `removeListener` 事件.

### removeAllListeners(eventName)

**`Overload 2/2`**

- **eventName** { [string](dataTypes#string) } - 事件名称
- <ins>**returns**</ins> { [EventEmitter](#事件发射器-eventemitter) } - 当前发射器

移除指定事件的全部监听器. 每个被移除的注册项都会触发一次 `removeListener` 事件.

两个重载都不会清除 [emitSticky](#m-eventemitteremitsticky) 保存的参数.

## [m#] EventEmitter#setMaxListeners

### setMaxListeners(maxListeners)

- **maxListeners** { [number](dataTypes#number) } - 每个事件允许的监听器数量上限
- <ins>**returns**</ins> { [EventEmitter](#事件发射器-eventemitter) } - 当前发射器

设置当前实例的硬性监听器上限. `0` 表示不限制.

应使用非负整数. 当前实现不会在设置时单独拒绝负数, 但负数会使后续任何监听器添加操作立即达到上限并抛出异常.

## [m#] EventEmitter#getMaxListeners

### getMaxListeners()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前实例的监听器上限

## [m#] EventEmitter#getTimer

### getTimer()

**`READONLY`**

- <ins>**returns**</ins> { org.autojs.autojs.core.looper.Timer | [null](dataTypes#null) } - 绑定的计时器, 未绑定时为 `null`

此方法主要用于检查监听器是直接执行还是提交给事件循环. 返回的 `Timer` 是 AutoJs6 内部运行时对象.

---

## newListener

- **eventName** { [string](dataTypes#string) } - 新监听器所属的事件名称
- **listener** { [Function](dataTypes#function) } - 新增的监听器

`on`, `once`, `prependListener` 或 `prependOnceListener` 处理监听器后触发. 普通注册中, 此事件发生在监听器加入列表之后, 与 Node.js EventEmitter 的触发顺序不同.

如果 `once` 遇到已经保存的粘性参数, 单次监听器会执行但不保留在列表中, 随后仍会触发 `newListener`.

## removeListener

- **eventName** { [string](dataTypes#string) } - 被移除监听器所属的事件名称
- **listener** { [Function](dataTypes#function) } - 被移除的监听器

`removeListener` 成功移除监听器后触发. `removeAllListeners` 也会为每个被移除的注册项触发此事件.
