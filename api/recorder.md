# 记录器 (Recorder)

`recorder` 模块用于保存时间戳, 计算时间差, 以及测量同步函数的运行时间.

`recorder` 与 `$recorder` 引用同一个可调用模块对象.

记录数据只保存在当前脚本引擎的内存中. 不同脚本引擎之间不共享记录, 脚本引擎结束后记录随之丢失.

## 记录模型

记录器包含 2 类相互独立的记录:

- 命名记录以字符串作为键. 同名记录只保留最后一次保存的时间戳.
- 匿名记录保存在后进先出栈中. `save()` 压入一条记录, `load()` 弹出最近的一条记录.

时间戳和时间差的单位均为毫秒. `save` 和 `load` 的时间戳被省略, 或传入 `null` 或 `undefined` 时, 使用 `System.currentTimeMillis()` 取得当前系统时间.

`save` 和 `load` 的显式时间戳, 以及 `isLessThan` 和 `isGreaterThan` 的比较值, 会转换为有符号 64 位整数. 小数部分向 `0` 截断. `NaN`, 无穷值及超出 64 位整数范围的值会导致异常.

`save`, `load`, `isLessThan`, `isGreaterThan`, `has` 和 `remove` 是 Java 方法. 对这些方法显式传入 `undefined` 作为 `key` 时, Rhino 会将其转换为字符串 `'undefined'`, 而不是匿名记录. 在需要同时指定匿名记录和其他参数时, 应将 `key` 显式设为 `null`.

> 注: 记录器使用系统墙上时钟, 而非单调时钟. 脚本运行期间调整系统时间可能导致时间差跳变或出现负值.

---

<p style="font: bold 2em sans-serif; color: #FF7043">recorder</p>

---

## [@] recorder

### recorder()

**`6.0.3`** **`Overload 1/5`**

- <ins>**returns**</ins> { [number](dataTypes#number) } - 保存的时间戳或经过的毫秒数

访问匿名记录的快捷方式.

匿名记录栈为空时, 保存当前时间戳并返回该时间戳. 栈不为空时, 弹出最近的匿名记录, 返回当前时间戳与记录时间戳之差.

`recorder(null)` 和 `recorder(undefined)` 与 `recorder()` 等价. 当第 1 个参数为 `null` 或 `undefined` 时, 第 2 个参数不会被使用.

```js
recorder();

sleep(200);

let elapsed = recorder();
console.log(elapsed);
```

### recorder(key)

**`6.0.3`** **`Overload 2/5`**

- **key** { [string](dataTypes#string) } - 记录名称
- <ins>**returns**</ins> { [number](dataTypes#number) } - 保存的时间戳或经过的毫秒数

访问命名记录的快捷方式.

`key` 不存在时, 保存当前时间戳并返回该时间戳. `key` 已存在时, 返回当前时间戳与记录时间戳之差.

读取不会删除命名记录. 如需重新开始计时, 可再次调用 [save(key)](#m-save). 如需让下一次快捷调用重新创建记录, 可先调用 [remove(key)](#m-remove).

```js
recorder('download');

sleep(200);

console.log(recorder('download'));
recorder.remove('download');
```

### recorder(key, timestamp)

**`6.0.3`** **`[6.6.0]`** **`Overload 3/5`**

- **key** { [string](dataTypes#string) } - 记录名称
- **timestamp** { [any](dataTypes#any) } - 兼容参数, 当前实现不使用此参数
- <ins>**returns**</ins> { [number](dataTypes#number) } - 保存的当前时间戳或经过的毫秒数

访问命名记录.

从 AutoJs6 6.6.0 起, 当前实现忽略 `timestamp`. 此重载与 [recorder(key)](#recorderkey) 等价: `key` 不存在时保存当前系统时间, `key` 已存在时以当前系统时间计算时间差.

如需保存或读取显式时间戳, 使用 [save(key, timestamp)](#savekey-timestamp) 和 [load(key, timestamp)](#loadkey-timestamp).

```js
let supplied = 1000;
let saved = recorder('manual', supplied);

console.log(saved === supplied); // false

recorder.remove('manual');
recorder.save('manual', 1000);
console.log(recorder.load('manual', 1450)); // 450
```

### recorder(func)

**`6.0.3`** **`[6.8.0]`** **`Overload 4/5`**

- **func** { [() =>](dataTypes#function) [void](dataTypes#void) } - 待测量的函数
- <ins>**returns**</ins> { [number](dataTypes#number) } - 函数调用经过的毫秒数

同步调用一次 `func`, 并返回本次调用经过的时间.

调用时不传入参数, 函数返回值会被忽略. `func` 抛出的异常会继续向外传播, 此时本次调用不返回耗时.

```js
function task() {
    sleep(200);
}

let elapsed = recorder(task);
console.log(elapsed);
```

> 注: 此重载只测量函数调用本身. 如果函数启动了异步任务, 返回值不包含异步任务后续执行的时间.

> 参阅: [recorder(func, thisType)](#recorderfunc-thistype)

### recorder(func, thisType)

**`6.0.3`** **`[6.8.0]`** **`Overload 5/5`**

- **func** { [() =>](dataTypes#function) [void](dataTypes#void) } - 待测量的函数
- **thisType** { [object](dataTypes#object) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - 调用 `func` 时使用的 `this` 值
- <ins>**returns**</ins> { [number](dataTypes#number) } - 函数调用经过的毫秒数

使用指定 `this` 值同步调用一次 `func`, 并返回本次调用经过的时间.

```js
let worker = {
    delay: 200,
    run: function () {
        sleep(this.delay);
    },
};

let elapsed = recorder(worker.run, worker);
console.log(elapsed);
```

从 AutoJs6 6.8.0 起, `func` 接受 Rhino `Callable` 实例. `thisType` 只有在它是非函数 JavaScript 对象时才会作为 `this` 值传入. `null`, `undefined` 及其他值均按未指定 `this` 处理.

## [m] save

### save()

**`6.0.3`** **`Overload 1/3`**

- <ins>**returns**</ins> { [number](dataTypes#number) } - 保存的当前时间戳

将当前时间戳压入匿名记录栈.

```js
let timestamp = recorder.save();

sleep(200);

console.log(timestamp);
console.log(recorder.load());
```

### save(key)

**`6.0.3`** **`Overload 2/3`**

- **key** { [string](dataTypes#string) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - 记录名称
- <ins>**returns**</ins> { [number](dataTypes#number) } - 保存的当前时间戳

以 `key` 保存当前时间戳并返回该时间戳.

保存已存在的 `key` 会覆盖原时间戳. `key` 为 `null` 时, 此重载按匿名记录处理, 等价于 [save()](#save). 显式传入 `undefined` 时, 使用名称 `'undefined'`.

```js
recorder.save('parse');

sleep(200);

console.log(recorder.load('parse'));
```

### save(key, timestamp)

**`6.0.3`** **`Overload 3/3`**

- **key** { [string](dataTypes#string) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - 记录名称
- **timestamp** { [number](dataTypes#number) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - 待保存的时间戳
- <ins>**returns**</ins> { [number](dataTypes#number) } - 保存后的时间戳

以 `key` 保存指定时间戳并返回保存结果.

`key` 为 `null` 时, 时间戳会压入匿名记录栈. 显式传入 `undefined` 时, 使用名称 `'undefined'`. `timestamp` 为 `null` 或 `undefined` 时, 使用当前系统时间.

```js
console.log(recorder.save('manual', 1000)); // 1000
console.log(recorder.load('manual', 1450)); // 450
```

## [m] load

### load()

**`6.0.3`** **`Overload 1/3`**

- <ins>**returns**</ins> { [number](dataTypes#number) } - 经过的毫秒数, 无匿名记录时为 `NaN`

弹出最近的匿名记录, 返回当前时间戳与记录时间戳之差.

匿名记录按后进先出顺序读取. 栈为空时不抛出异常, 而是返回 `NaN`.

```js
recorder.save();

sleep(200);

console.log(recorder.load());
console.log(isNaN(recorder.load())); // true
```

### load(key)

**`6.0.3`** **`[6.8.0]`** **`Overload 2/3`**

- **key** { [string](dataTypes#string) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - 记录名称
- <ins>**returns**</ins> { [number](dataTypes#number) } - 经过的毫秒数, 无匿名记录时为 `NaN`

返回当前时间戳与 `key` 对应时间戳之差.

读取命名记录不会删除该记录. 从 AutoJs6 6.8.0 起, 指定的命名记录不存在时抛出 `java.util.NoSuchElementException`.

`key` 为 `null` 时, 此重载按匿名记录处理, 等价于 [load()](#load). 显式传入 `undefined` 时, 读取名称 `'undefined'`.

```js
recorder.save('render');

sleep(200);

let elapsed = recorder.load('render');
console.log(elapsed);
```

### load(key, timestamp)

**`6.0.3`** **`[6.8.0]`** **`Overload 3/3`**

- **key** { [string](dataTypes#string) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - 记录名称
- **timestamp** { [number](dataTypes#number) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - 计算时间差时使用的结束时间戳
- <ins>**returns**</ins> { [number](dataTypes#number) } - 计算得到的毫秒数, 无匿名记录时为 `NaN`

返回 `timestamp` 与 `key` 对应时间戳之差.

读取命名记录不会删除该记录. 从 AutoJs6 6.8.0 起, 指定的命名记录不存在时抛出 `java.util.NoSuchElementException`.

`key` 为 `null` 时, 弹出最近的匿名记录. 显式传入 `undefined` 时, 读取名称 `'undefined'`. `timestamp` 为 `null` 或 `undefined` 时, 使用当前系统时间.

```js
recorder.save('manual', 1200);

console.log(recorder.load('manual', 1800)); // 600
console.log(recorder.has('manual')); // true
```

## [m] isLessThan

### isLessThan(key, compare)

**`6.0.3`** **`[6.8.0]`**

- **key** { [string](dataTypes#string) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - 记录名称
- **compare** { [number](dataTypes#number) } - 待比较的毫秒数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前时间差是否小于 `compare`

计算当前时间戳与记录时间戳之差, 并执行严格小于比较.

命名记录不存在时抛出 `java.util.NoSuchElementException`. `key` 为 `null` 时会弹出最近的匿名记录; 匿名记录不存在时, 计算结果为 `NaN`, 因而返回 `false`. 显式传入 `undefined` 时, 使用名称 `'undefined'`.

```js
recorder.save('timeout');

while (recorder.isLessThan('timeout', 1000)) {
    sleep(50);
}

console.log('timeout');
```

## [m] isGreaterThan

### isGreaterThan(key, compare)

**`6.0.3`** **`[6.8.0]`**

- **key** { [string](dataTypes#string) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - 记录名称
- **compare** { [number](dataTypes#number) } - 待比较的毫秒数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前时间差是否大于 `compare`

计算当前时间戳与记录时间戳之差, 并执行严格大于比较.

命名记录不存在时抛出 `java.util.NoSuchElementException`. `key` 为 `null` 时会弹出最近的匿名记录; 匿名记录不存在时, 计算结果为 `NaN`, 因而返回 `false`. 显式传入 `undefined` 时, 使用名称 `'undefined'`.

```js
recorder.save('request');

sleep(200);

if (recorder.isGreaterThan('request', 100)) {
    console.log('slow request');
}
```

## [m] has

### has(key)

**`6.0.3`**

- **key** { [string](dataTypes#string) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - 记录名称
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 命名记录是否存在

检查命名记录 `key` 是否存在.

此方法不检查匿名记录. `key` 为 `null` 时返回 `false`. 显式传入 `undefined` 时, 检查名称 `'undefined'`.

```js
console.log(recorder.has('task')); // false

recorder.save('task');

console.log(recorder.has('task')); // true
```

## [m] remove

### remove(key)

**`6.0.3`**

- **key** { [string](dataTypes#string) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - 记录名称
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否删除了命名记录

删除命名记录 `key`.

记录存在且已删除时返回 `true`. 记录不存在或 `key` 为 `null` 时返回 `false`. 显式传入 `undefined` 时, 删除名称 `'undefined'`. 此方法不删除匿名记录.

```js
recorder.save('temporary');

console.log(recorder.remove('temporary')); // true
console.log(recorder.remove('temporary')); // false
```

## [m] clear

### clear()

**`6.0.3`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

删除当前记录器中的全部命名记录和匿名记录.

```js
recorder.save('named');
recorder.save();
recorder.clear();

console.log(recorder.has('named')); // false
console.log(isNaN(recorder.load())); // true
```
