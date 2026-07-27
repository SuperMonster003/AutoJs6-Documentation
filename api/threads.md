# 线程 (Threads)

`threads` 模块在同一个 Rhino 脚本运行环境中创建和管理 Java 线程.
由不同线程执行的函数共享脚本作用域和 Java 对象, 但普通读写, 复合运算以及
JavaScript 容器并不会因此自动成为线程安全操作.

脚本主线程会等待仍在运行的子线程, 线程池任务和定时器. 脚本退出时, AutoJs6
会中断由当前运行环境创建的子线程, 并立即关闭其管理的线程池.

> 注: 本页描述 Rhino 脚本中的 `threads` API. `"nodejs"` 模式不提供此模块.

> 注: `join()`, `blockedGet()` 以及锁等待都会阻塞调用线程. 不应在 Android
> UI 线程中等待依赖 UI 线程完成的任务, 否则可能造成界面冻结或死锁.

---

<p style="font: bold 2em sans-serif; color: #FF7043">threads</p>

---

## [m] start

### threads.start(action)

- **action** { [Function](dataTypes#function) | [java.lang.Runnable](https://developer.android.com/reference/java/lang/Runnable) } - 在线程中执行的任务
- <ins>**returns**</ins> { [Thread](#thread) | [undefined](dataTypes#undefined) } - 已经启动的 TimerThread, 或未能启动时的 `undefined`

创建一个 TimerThread, 将其加入当前脚本运行环境的子线程集合, 然后立即启动.
线程名称采用当前脚本主线程名称加 `(Spawn-N)` 后缀, 其中 `N` 从 `0` 递增.

JavaScript 函数会在新线程的 Rhino 上下文中执行, 且不接收参数. 函数抛出的
未捕获异常会写入控制台并结束该线程. 脚本正在退出或启动过程因中断而终止时,
此方法返回 `undefined`; 其他启动异常会继续抛出.

```js
let worker = threads.start(() => {
    log("worker: " + threads.currentThread());
});

if (worker !== undefined) {
    worker.join();
}
```

## [m] interrupt

### threads.interrupt(thread)

- **thread** { [any](dataTypes#any) } - 待中断的对象
- <ins>**returns**</ins> { [void](dataTypes#void) }

当 `thread` 是仍存活的 AutoJs6 TimerThread 时调用其
[`interrupt()`](#threadinterrupt). 其他对象, 已结束的线程以及主线程代理均被忽略.

此方法也可中断由 [`threads.pool()`](#m-pool) 创建的 TimerThread, 但调用方需要
先在线程池任务内部取得相应线程句柄.

## [m] pool

### threads.pool(options?)

**`6.6.0`**

- **[ options = {} ]** {{
    - corePoolSize?: [number](dataTypes#number);
    - maxPoolSize?: [number](dataTypes#number);
    - keepAliveTime?: [number](dataTypes#number);
- }}
- <ins>**returns**</ins> { [java.util.concurrent.ThreadPoolExecutor](https://developer.android.com/reference/java/util/concurrent/ThreadPoolExecutor) } - 由当前脚本运行环境管理的线程池

创建使用 AutoJs6 TimerThread 作为工作线程的 `ThreadPoolExecutor`. 线程池任务
与创建它的脚本共享 Rhino 运行环境. 脚本退出时, 运行环境会对仍登记的线程池调用
`shutdownNow()`.

| 选项 | 默认值 | 约束与含义 |
| --- | ---: | --- |
| `corePoolSize` | `0` | 核心线程数, 转换为 Java `int`, 且不得小于 `0` |
| `maxPoolSize` | `0` | 最大线程数, 转换为 Java `int`, `0` 会传给执行器作为 `2147483647` |
| `keepAliveTime` | `60000` | 非核心线程空闲存活时间, 单位为毫秒, 且不得小于 `0` |

当前实现使用无界 `LinkedBlockingQueue`. 因此核心线程忙碌后, 新任务通常进入队列,
而不会为了接近 `maxPoolSize` 而继续创建工作线程. 默认配置会按需创建一个工作线程
并顺序消费队列.

当前参数校验要求 `corePoolSize <= maxPoolSize` 时仍使用选项中的原始
`maxPoolSize`. 因此显式或默认使用 `maxPoolSize: 0` 时,
`corePoolSize` 也必须为 `0`. 若需要多个核心工作线程, 应同时指定不小于它的正数
`maxPoolSize`.

```js
let pool = threads.pool({
    corePoolSize: 2,
    maxPoolSize: 2,
    keepAliveTime: 60000,
});

pool.execute(() => log("pool-1: " + threads.currentThread()));
pool.execute(() => log("pool-2: " + threads.currentThread()));
pool.shutdown();
pool.awaitTermination(5, TimeUnit.SECONDS);
```

调用者仍可使用返回对象的 `execute()`, `submit()`, `shutdown()` 和
`shutdownNow()` 等 Java API. 主动关闭线程池后, 该线程池会从当前脚本运行环境的
线程池集合中移除. 如果脚本主线程还需要等待已经提交的任务, 应像示例一样显式调用
`awaitTermination()`, 或等待各任务返回的 Future.

## [m] shutDownAll

### threads.shutDownAll()

- <ins>**returns**</ins> { [void](dataTypes#void) }

中断所有仍登记在当前脚本运行环境中, 且由 [`threads.start()`](#m-start) 创建的
子线程, 随后清空子线程集合.

此方法不关闭由 [`threads.pool()`](#m-pool) 创建的线程池. 如需关闭线程池, 应对
返回的 `ThreadPoolExecutor` 调用 `shutdown()` 或 `shutdownNow()`. 脚本整体退出时,
运行环境会自动对仍登记的线程池调用 `shutdownNow()`.

## [m] currentThread

### threads.currentThread()

- <ins>**returns**</ins> { [Thread](#thread) } - 当前调用线程的句柄

返回当前执行此调用的线程. 具体对象取决于调用位置:

| 调用位置 | 返回对象 | AutoJs6 扩展能力 |
| --- | --- | --- |
| 脚本主线程 | MainThreadProxy | 标准 Thread 兼容方法和主线程定时器委托 |
| `threads.start()` 任务 | TimerThread | 标准 Thread 方法, `safeJoin()`, `waitFor()` 和线程定时器委托 |
| `threads.pool()` 任务 | TimerThread | 与 `threads.start()` 线程相同 |
| Android UI 线程或其他 Java 线程 | 实际的 `java.lang.Thread` | 仅该 Java 线程本身提供的方法 |

主线程返回代理对象, 是为了让 `setTimeout()`, `setInterval()` 和
`setImmediate()` 委托到当前脚本的主定时器. 如需把当前线程交给
[`events.emitter()`](events), 应直接使用此方法的返回值.

## [m] disposable

### threads.disposable()

**`[6.7.0]`**

- <ins>**returns**</ins> { [Disposable](#disposable) } - 可阻塞等待通知的值容器

创建一个初始值为 `null` 的 Disposable. 它提供
[`blockedGet()`](#m-blockedget), [`blockedGetOrThrow()`](#m-blockedgetorthrow)
和 [`setAndNotify()`](#m-setandnotify), 适合在线程间传递一个结果或通知.

Disposable 的等待是阻塞式的, 不是 Promise. 当前实现也不限制
`setAndNotify()` 的调用次数.

从 AutoJs6 6.7.0 起, 返回值改为原生 JavaScript 对象, 避免 Rhino 在存取值时
对结果进行意外的 Java 装箱. 方法名称保持不变, 但等待细节以本页
[`Disposable`](#disposable) 章节为准.

## [m] atomic

### threads.atomic(initialValue?)

- **[ initialValue = 0 ]** { [number](dataTypes#number) } - 初始值, 按 Java `long` 转换
- <ins>**returns**</ins> { [java.util.concurrent.atomic.AtomicLong](https://developer.android.com/reference/java/util/concurrent/atomic/AtomicLong) } - 64 位原子整数

创建 `AtomicLong`. 使用其 `get()`, `set()`, `incrementAndGet()`,
`getAndIncrement()`, `compareAndSet()` 等 Java 方法执行原子整数操作.

```js
let counter = threads.atomic();
let worker = threads.start(() => {
    for (let i = 0; i < 1000; i += 1) {
        counter.incrementAndGet();
    }
});

for (let i = 0; i < 1000; i += 1) {
    counter.incrementAndGet();
}

worker.join();
log(counter.get()); // 2000
```

## [m] lock

### threads.lock()

- <ins>**returns**</ins> { [java.util.concurrent.locks.ReentrantLock](https://developer.android.com/reference/java/util/concurrent/locks/ReentrantLock) } - 新的非公平可重入锁

创建使用默认构造参数的 `ReentrantLock`. 默认锁不是公平锁. 需要在 `finally`
中释放已经取得的锁, 避免异常路径永久占用锁.

```js
let lock = threads.lock();
let values = [];

function append(value) {
    lock.lock();
    try {
        values.push(value);
    } finally {
        lock.unlock();
    }
}

let worker = threads.start(() => append("worker"));
append("main");
worker.join();
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">globalThis</p>

---

## [m] sync

### globalThis.sync(func, lock?)

**`Global`**

- **func** { [Function](dataTypes#function) } - 待同步的函数
- **[ lock ]** { [any](dataTypes#any) } - 作为 Java 监视器的共享锁对象
- <ins>**returns**</ins> { [Function](dataTypes#function) } - Rhino `Synchronizer` 包装函数

返回对 `func` 的同步包装. 每次调用包装函数时, Rhino 会先进入指定对象的 Java
监视器, 再调用原函数, 最后退出监视器. 多个包装函数传入同一个 `lock` 时会互斥.

省略 `lock` 时, 监视器取决于每次调用包装函数时的 `this` 值. 如果需要稳定地在
多个调用点之间互斥, 应显式传入同一个 Java 或 JavaScript 对象.

```js
let monitor = {};
let count = 0;
let increment = sync(() => {
    count += 1;
    return count;
}, monitor);
```

# Thread

本页的 Thread 表示 `threads.start()` 返回的 TimerThread,
`threads.currentThread()` 返回的 MainThreadProxy, 或其他实际
`java.lang.Thread` 对象. 三者并不具有完全相同的方法:

- 标准线程状态与元数据方法由 TimerThread 和 MainThreadProxy 共同提供.
- `safeJoin()`, `waitFor()` 和 `getLooper()` 仅由 AutoJs6 TimerThread 提供.
- 定时器委托由 TimerThread 和 MainThreadProxy 提供, 普通 Java Thread 不提供.
- `threads.start()` 返回线程前已经调用了 Java `start()`. 不应再次调用句柄的
  `start()` 或直接调用 `run()`.

## [m#] interrupt

### Thread#interrupt()

- <ins>**returns**</ins> { [void](dataTypes#void) }

请求中断线程. 对 TimerThread 调用时, AutoJs6 还会退出该线程的 Android Looper,
使其不再执行后续定时器回调.

中断不是任意代码的强制终止机制. 正在执行的 JavaScript 代码仍需到达可响应中断
的位置. `sleep()`, `join()`, `waitFor()` 和其他可中断等待可能抛出
`InterruptedException`, 并由 AutoJs6 转换为脚本中断流程.

## [m#] isInterrupted

### Thread#isInterrupted()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 线程是否已被中断

读取目标线程的中断状态, 但不清除该状态. TimerThread 还会检查 AutoJs6
`ThreadCompat` 记录的兼容中断状态.

## [m#] isAlive

### Thread#isAlive()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 线程是否已经启动且尚未结束

## [m#] join

### Thread#join()

**`Overload 1/3`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

阻塞当前调用线程, 直到目标线程结束.

### Thread#join(millis)

**`Overload 2/3`**

- **millis** { [number](dataTypes#number) } - 最长等待时间, 单位为毫秒
- <ins>**returns**</ins> { [void](dataTypes#void) }

`millis` 为 `0` 时无限等待, 大于 `0` 时最多等待指定时间.
对 TimerThread 传入负数时, Java `Thread.join()` 会抛出
`IllegalArgumentException`. MainThreadProxy 会先把负数调整为 `0`, 因而会无限等待.

### Thread#join(millis, nanos)

**`Overload 3/3`**

- **millis** { [number](dataTypes#number) } - 毫秒部分
- **nanos** { [number](dataTypes#number) } - 附加纳秒部分, Java Thread 要求位于 `0` 到 `999999`
- <ins>**returns**</ins> { [void](dataTypes#void) }

阻塞至线程结束或指定时间到期. MainThreadProxy 会先把两个负参数分别调整为 `0`;
TimerThread 使用 Java Thread 的原始参数校验.

## [m#] safeJoin

### Thread#safeJoin()

**`6.2.0`** **`Overload 1/3`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

仅 TimerThread 提供. 与无参数 [`join()`](#m-join) 相同, 等待线程结束.

### Thread#safeJoin(millis)

**`6.2.0`** **`Overload 2/3`**

- **millis** { [number](dataTypes#number) } - 最长等待时间, 单位为毫秒
- <ins>**returns**</ins> { [void](dataTypes#void) }

仅当 `millis > 0` 时调用 Java `join(millis)`. `millis <= 0` 时立即返回,
不会无限等待, 也不会因负数抛出参数异常.

### Thread#safeJoin(millis, nanos)

**`6.2.0`** **`Overload 3/3`**

- **millis** { [number](dataTypes#number) } - 毫秒部分
- **nanos** { [number](dataTypes#number) } - 附加纳秒部分
- <ins>**returns**</ins> { [void](dataTypes#void) }

仅当 `millis > 0` 时调用 Java `join(millis, nanos)`. `millis <= 0` 时忽略
`nanos` 并立即返回.

## [m#] waitFor

### Thread#waitFor()

- <ins>**returns**</ins> { [void](dataTypes#void) }

仅 TimerThread 提供. 阻塞调用线程, 直到目标线程已经准备 Rhino 上下文和线程定时器.
此时任务函数不一定已经开始执行. 等待过程被中断时会抛出
`InterruptedException`.

在调用 TimerThread 的定时器委托前, 可先调用此方法避免
`Thread is not alive` 异常.

## Thread 定时器委托

TimerThread 把定时器操作委托给该线程自己的 Timer. MainThreadProxy 把相同操作
委托给脚本主 Timer. 定时器回调会在对应线程的 Looper 上执行.

普通 `java.lang.Thread` 不具有这些方法. TimerThread 尚未完成启动或已经退出时,
访问其 Timer 会抛出 `IllegalStateException`.

取消方法接收的 ID 应由同一个 Thread Timer 创建. TimerThread 收到其他 Timer
编码的 ID 时会抛出 `IllegalArgumentException`.

## [m#] setTimeout

### Thread#setTimeout(callback)

**`Overload 1/2`**

- **callback** { [Function](dataTypes#function) } - 到期时执行的函数
- <ins>**returns**</ins> { [number](dataTypes#number) } - 线程 Timer 的定时器 ID

仅 TimerThread 提供此单参数重载, 延迟默认为 `1` 毫秒.

### Thread#setTimeout(callback, delay, ...args)

**`Overload 2/2`**

- **callback** { [Function](dataTypes#function) } - 到期时执行的函数
- **delay** { [number](dataTypes#number) } - 延迟时间, 单位为毫秒
- **...args** { [...](documentation#可变参数)[any](dataTypes#any)[[]](documentation#可变参数) } - 传给回调的参数
- <ins>**returns**</ins> { [number](dataTypes#number) } - 线程 Timer 的定时器 ID

创建一次性定时器. TimerThread 和 MainThreadProxy 均提供此重载.

## [m#] clearTimeout

### Thread#clearTimeout(id)

- **id** { [number](dataTypes#number) } - 同一 Thread Timer 创建的定时器 ID
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否取消了匹配的回调

## [m#] setInterval

### Thread#setInterval(callback)

**`Overload 1/2`**

- **callback** { [Function](dataTypes#function) } - 每次到期时执行的函数
- <ins>**returns**</ins> { [number](dataTypes#number) } - 线程 Timer 的定时器 ID

仅 TimerThread 提供此单参数重载, 间隔默认为 `1` 毫秒.

### Thread#setInterval(callback, interval, ...args)

**`Overload 2/2`**

- **callback** { [Function](dataTypes#function) } - 每次到期时执行的函数
- **interval** { [number](dataTypes#number) } - 间隔时间, 单位为毫秒
- **...args** { [...](documentation#可变参数)[any](dataTypes#any)[[]](documentation#可变参数) } - 传给回调的参数
- <ins>**returns**</ins> { [number](dataTypes#number) } - 线程 Timer 的定时器 ID

创建重复定时器. TimerThread 和 MainThreadProxy 均提供此重载.

## [m#] clearInterval

### Thread#clearInterval(id)

- **id** { [number](dataTypes#number) } - 同一 Thread Timer 创建的定时器 ID
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否取消了匹配的回调

## [m#] setImmediate

### Thread#setImmediate(callback, ...args)

- **callback** { [Function](dataTypes#function) } - 当前事件循环结束后执行的函数
- **...args** { [...](documentation#可变参数)[any](dataTypes#any)[[]](documentation#可变参数) } - 传给回调的参数
- <ins>**returns**</ins> { [number](dataTypes#number) } - 线程 Timer 的定时器 ID

TimerThread 和 MainThreadProxy 均提供此方法.

## [m#] clearImmediate

### Thread#clearImmediate(id)

- **id** { [number](dataTypes#number) } - 同一 Thread Timer 创建的定时器 ID
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否取消了匹配的回调

## [m#] getLooper

### Thread#getLooper()

- <ins>**returns**</ins> { [android.os.Looper](https://developer.android.com/reference/android/os/Looper) | [null](dataTypes#null) } - TimerThread 的 Looper

仅 TimerThread 提供. 在线程完成 Looper 准备前可能返回 `null`. 此对象属于底层
Android 线程基础设施, 普通脚本通常不需要直接操作.

## Java Thread 兼容实例成员

TimerThread 继承 `java.lang.Thread`, MainThreadProxy 则逐项委托到脚本主线程.
下列方法可用于读取或配置线程. 对 `threads.start()` 返回的句柄而言, 线程已经启动,
因此再次启动或修改只能在启动前设置的属性会失败.

| 签名 | 返回值 | 行为 |
| --- | --- | --- |
| `Thread#getId()` | [number](dataTypes#number) | 返回 Java 线程 ID |
| `Thread#getName()` | [string](dataTypes#string) | 返回线程名称 |
| `Thread#setName(name)` | [void](dataTypes#void) | 设置线程名称 |
| `Thread#getPriority()` | [number](dataTypes#number) | 返回 Java 线程优先级 |
| `Thread#setPriority(priority)` | [void](dataTypes#void) | 设置线程优先级 |
| `Thread#getState()` | [java.lang.Thread.State](https://developer.android.com/reference/java/lang/Thread.State) | 返回 Java 线程状态 |
| `Thread#getThreadGroup()` | [java.lang.ThreadGroup](https://developer.android.com/reference/java/lang/ThreadGroup) \| [null](dataTypes#null) | 返回线程组 |
| `Thread#getStackTrace()` | [java.lang.StackTraceElement](https://developer.android.com/reference/java/lang/StackTraceElement)[] | 返回线程当前栈快照 |
| `Thread#isDaemon()` | [boolean](dataTypes#boolean) | 返回是否为守护线程 |
| `Thread#setDaemon(on)` | [void](dataTypes#void) | 设置守护状态, 已启动线程会抛出 `IllegalThreadStateException` |
| `Thread#getContextClassLoader()` | [java.lang.ClassLoader](https://developer.android.com/reference/java/lang/ClassLoader) \| [null](dataTypes#null) | 返回上下文类加载器 |
| `Thread#setContextClassLoader(loader)` | [void](dataTypes#void) | 设置上下文类加载器 |
| `Thread#getUncaughtExceptionHandler()` | [java.lang.Thread.UncaughtExceptionHandler](https://developer.android.com/reference/java/lang/Thread.UncaughtExceptionHandler) \| [null](dataTypes#null) | 返回未捕获异常处理器 |
| `Thread#setUncaughtExceptionHandler(handler)` | [void](dataTypes#void) | 设置未捕获异常处理器 |
| `Thread#toString()` | [string](dataTypes#string) | 返回线程描述 |
| `Thread#checkAccess()` | [void](dataTypes#void) | **`DEPRECATED`**, 执行 Java 线程访问检查 |

以下 Java 兼容成员同样可见, 但不应用于 `threads.start()` 或
`threads.currentThread()` 返回的已运行句柄:

| 签名 | 状态与说明 |
| --- | --- |
| `Thread#start()` | 已运行句柄再次调用会抛出 `IllegalThreadStateException` |
| `Thread#run()` | 在调用者线程同步执行底层 `run()`, 不会创建新线程 |
| `Thread#stop()` | **`DEPRECATED`**, Java 强制停止线程, 不安全且不应使用 |

TimerThread 还会从 Android 的 `java.lang.Thread` 继承以下已弃用成员.
MainThreadProxy 刻意不委托这些成员:

| 签名 | 状态与说明 |
| --- | --- |
| `Thread#stop(throwable)` | **`DEPRECATED`**, Android 实现不支持并抛出 `UnsupportedOperationException` |
| `Thread#destroy()` | **`DEPRECATED`**, Android 实现不支持并抛出 `UnsupportedOperationException` |
| `Thread#suspend()` | **`DEPRECATED`**, Android 实现不支持并抛出 `UnsupportedOperationException` |
| `Thread#resume()` | **`DEPRECATED`**, Android 实现不支持并抛出 `UnsupportedOperationException` |
| `Thread#countStackFrames()` | **`DEPRECATED`**, 已弃用的栈帧计数入口 |

## Java Thread 静态兼容成员

Rhino 的 Java 成员解析允许通过线程对象访问该类型的静态方法. 为避免把静态行为误解
为针对接收对象, 普通代码通常应通过全局 Java 类 `Thread` 调用这些方法.
其中 TimerThread 或 MainThreadProxy 句柄上的 `interrupted()` 会使用 AutoJs6
`ThreadCompat` 实现, 同时清除其兼容中断记录; 全局 Java 类的同名方法只处理标准
Java 中断标志.

| 签名 | 返回值 | 行为 |
| --- | --- | --- |
| `Thread.currentThread()` | [java.lang.Thread](https://developer.android.com/reference/java/lang/Thread) | 返回原始当前 Java 线程, 不创建 MainThreadProxy |
| `Thread.interrupted()` | [boolean](dataTypes#boolean) | 读取并清除当前调用线程的中断状态 |
| `Thread.sleep(millis)` | [void](dataTypes#void) | 使当前调用线程休眠 |
| `Thread.sleep(millis, nanos)` | [void](dataTypes#void) | 使当前调用线程按毫秒和纳秒休眠 |
| `Thread.yield()` | [void](dataTypes#void) | 向调度器提示当前线程可让出执行机会 |
| `Thread.activeCount()` | [number](dataTypes#number) | 估算当前线程组及子组中的活动线程数 |
| `Thread.enumerate(array)` | [number](dataTypes#number) | 把活动线程复制到 Java Thread 数组 |
| `Thread.dumpStack()` | [void](dataTypes#void) | 把当前线程栈输出到标准错误流 |
| `Thread.holdsLock(object)` | [boolean](dataTypes#boolean) | 当前线程是否持有对象监视器 |
| `Thread.getAllStackTraces()` | [java.util.Map](https://developer.android.com/reference/java/util/Map) | 返回所有活动线程的栈快照 |
| `Thread.getDefaultUncaughtExceptionHandler()` | [java.lang.Thread.UncaughtExceptionHandler](https://developer.android.com/reference/java/lang/Thread.UncaughtExceptionHandler) \| [null](dataTypes#null) | 返回默认未捕获异常处理器 |
| `Thread.setDefaultUncaughtExceptionHandler(handler)` | [void](dataTypes#void) | 设置默认未捕获异常处理器 |

全局 Java 类 `Thread` 还提供常量 `MIN_PRIORITY`, `NORM_PRIORITY` 和
`MAX_PRIORITY`. TimerThread 可通过 Java 静态成员回退解析这些常量,
但 MainThreadProxy 不提供相应字段.

# Disposable

Disposable 是 `threads.disposable()` 创建的原生 JavaScript 对象. 它内部使用
`ReentrantLock`, `Condition` 和一个 `volatile` 值. 初始值为 `null`.

当前实现的等待语义需要特别留意:

- 每次 `blockedGet()` 或 `blockedGetOrThrow()` 都会先进入等待, 不会因容器中已经有
  非 `null` 值而立即返回.
- `timeout <= 0` 时等待下一次 `setAndNotify()` 信号.
- `timeout > 0` 时会持续等待到完整超时时长, 即使期间收到信号, 然后返回最后保存的值.
- 在等待开始前发出的信号不会被保存为待处理通知. 无超时等待可能因此永久阻塞.

## [m#] blockedGet

### Disposable#blockedGet(timeout?)

- **[ timeout = 0 ]** { [number](dataTypes#number) } - 等待时间, 单位为毫秒
- <ins>**returns**</ins> { [any](dataTypes#any) } - 等待结束时保存的值, 初始或显式空值为 `null`

`timeout <= 0` 时等待一次条件通知. `timeout > 0` 时等待完整指定时长.
等待线程被中断时, 此方法抛出一个以 `InterruptedException` 为原因的
`RuntimeException`.

## [m#] blockedGetOrThrow

### Disposable#blockedGetOrThrow(exception, timeout?, defaultValue?)

- **exception** { [java.lang.Class](https://developer.android.com/reference/java/lang/Class) } - `RuntimeException` 子类的 Java Class, 且应具有可访问的无参数构造方法
- **[ timeout = 0 ]** { [number](dataTypes#number) } - 等待时间, 单位为毫秒
- **[ defaultValue = null ]** { [T](dataTypes#generic) } - 等待结束后保存值为 `null` 时返回的值
- <ins>**template**</ins> { [T](dataTypes#generic) }
- <ins>**returns**</ins> { [any](dataTypes#any) | [T](dataTypes#generic) } - 保存的非空值, 或 `defaultValue`

等待语义与 [`blockedGet()`](#m-blockedget) 相同. 区别在于等待线程被中断时,
此方法创建并抛出 `exception` 指定的异常. 实例化失败时抛出包装反射异常的
`RuntimeException`.

当前实现只在调用时检查 **exception** 是否为 Java `Class`, 不会预先检查它是否继承
`RuntimeException` 或是否存在可访问的无参数构造方法. 不符合要求的类可能在等待开始时
被接受, 直到线程中断并尝试实例化时才抛出包装异常.

超时本身不会抛出 `exception`. 等待结束后值仍为 `null` 时返回
`defaultValue`.

## [m#] setAndNotify

### Disposable#setAndNotify(value)

- **value** { [any](dataTypes#any) } - 要保存的值
- <ins>**returns**</ins> { [void](dataTypes#void) }

在内部锁保护下替换当前值, 然后对当前所有等待者调用条件变量的 `signalAll()`.
允许保存 `null` 和 `undefined`, 也允许多次调用.

信号只会唤醒调用时已经在等待的线程. 此方法不会记录一个可供未来
`blockedGet()` 消费的通知.

```js
let result = threads.disposable();

threads.start(() => {
    result.setAndNotify(6 * 7);
});

// 正超时模式会等待完整 100 毫秒, 然后读取期间保存的最后一个值.
log(result.blockedGet(100));
```

# 线程安全

不同线程可以访问同一脚本作用域, 但 `value += 1`, `array.push()` 和对象属性更新
等操作不是自动原子的. 简单整数计数优先使用 [`threads.atomic()`](#m-atomic).
需要把多个操作组成临界区时使用 [`threads.lock()`](#m-lock), 或用全局
[`sync()`](#m-sync) 包装函数.

使用 `ReentrantLock` 时, 应始终在 `finally` 中解锁. 使用
`Condition.await()` 时, 应在持锁状态下循环检查共享条件, 并在修改条件后调用
`signal()` 或 `signalAll()`. JavaScript Array 和普通对象不保证并发修改安全;
需要并发容器时可使用 `java.util.concurrent` 中的相应 Java 类型.
