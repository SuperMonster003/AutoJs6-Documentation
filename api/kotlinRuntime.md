# Kotlin 运行时 (Kotlin Runtime)

<!-- type=misc -->

Kotlin 运行时是一个独立安装的 AutoJs6 插件 ([AutoJs6-Plugin-Kotlin-Runtime](https://github.com/SuperMonster003/AutoJs6-Plugin-Kotlin-Runtime)). 它用内置的 Kotlin/JVM 2.3.21 编译器 (K2) 与 D8 把单个 `.kt` 源文件编译为 DEX, 在插件的一次性 worker 进程中执行, 编译器与脚本都不进入 AutoJs6 进程. 本页列出脚本可用的 JVM Entry API 2: 包 `org.autojs.plugin.jvmsource.api` 中的 6 个类型与 13 个方法, 依据插件 0.7.3-m10 (最低 AutoJs6 构建 5276).

本页的 API 属于 Kotlin 语言, 不在 AutoJs6 的运行时覆盖矩阵 (Rhino, Node.js 与 Bun) 中, 因此页面顶部没有运行时支持表. 条目的名称与参数个数由 AutoJs6 仓库的静态门禁 `tools/api-coverage/language_runtimes.py` 与插件冻结的接口包 (`protocol/jvm-source-api.aar`) 逐项比对. 这套接口与 [Java 运行时](javaRuntime) 同源; Java 运行时的 Entry API 4 另有 args 与 clipboard, Kotlin 运行时没有.

---

## 使用方式

- 启用: JVM 源码运行目前是 AutoJs6 的实验性功能, 需在 AutoJs6 中开启该实验开关, 并为 Kotlin 语言选择本插件作为编译组件; 未开启或未选择时, 运行以错误码 `JVM_SOURCE_EXPERIMENT_DISABLED` 或 `JVM_SOURCE_PROVIDER_NOT_SELECTED` 结束.
- 入口: 在编辑器中新建 `.kt` 文件并运行. 宿主把源码统一命名为 `Main.kt`, 入口类的简名固定为 `Main`, 须实现 AutoJsJvmEntry; 可以带普通 ASCII 包名与 import 语句.
- 范围: 只支持单个源文件, 最大 4 MiB; 字节码目标为 JVM 1.8; 可用 Kotlin 标准库与 kotlinx-coroutines-core-jvm 1.11.0 (Dispatchers.Default / IO / Unconfined), 不解析 Maven 或其他第三方依赖.
- 能力: JvmScriptContext 的宿主调用 (控制台输出, 应用启动, 休眠, toast) 都受本次会话协商的能力约束; 调用未授予的能力会终止本次执行.
- 生命周期: 每次执行在全新的 worker 进程中进行, 结束即回收; 协程等后台任务不会在 run 返回后继续存活, 不要使用 GlobalScope. 在 AutoJs6 中停止脚本会立即中断休眠与协程.

```kotlin
import org.autojs.plugin.jvmsource.api.AutoJsJvmEntry
import org.autojs.plugin.jvmsource.api.JvmScriptContext

class Main : AutoJsJvmEntry {
    override fun run(context: JvmScriptContext): Any {
        context.console().log("Hello from Kotlin")
        context.toast("AutoJs6 Kotlin Runtime")
        context.sleep(500L)
        return context.app().launch("org.autojs.autojs6")
    }
}
```

除 AutoJsJvmEntry.run 外, 本页示例都是 `run(context: JvmScriptContext)` 函数体中的片段.

---

## 类型

| 类型 | 种类 | 说明 |
| --- | --- | --- |
| `AutoJsJvmEntry` | 接口 | 入口类实现的接口 |
| `JvmScriptContext` | 接口 | run 收到的上下文, 是唯一受支持的宿主桥 |
| `JvmAppApi` | 接口 | 应用启动 |
| `JvmConsoleApi` | 接口 | 控制台输出 |
| `JvmCancellation` | 接口 | 只读的取消状态 |
| `JvmCancellationException` | 类, 继承 `Exception` | 会话被取消时抛出 |

---

## AutoJsJvmEntry

### AutoJsJvmEntry.run(context)

- **context** { `JvmScriptContext` } - 本次执行的上下文
- <ins>**returns**</ins> { `Any?` } - 交给宿主的结果

入口函数, 声明为 `override fun run(context: JvmScriptContext): Any?` (返回类型可以收窄为 `Any`).

```kotlin
class Main : AutoJsJvmEntry {
    override fun run(context: JvmScriptContext): Any {
        val started = System.currentTimeMillis()
        context.sleep(100L)
        return System.currentTimeMillis() - started
    }
}
```

---

## JvmScriptContext

### JvmScriptContext.app()

- <ins>**returns**</ins> { `JvmAppApi` }

返回应用启动视图. 调用其方法需要应用启动能力.

```kotlin
val launched = context.app().launch("org.autojs.autojs6")
```

### JvmScriptContext.console()

- <ins>**returns**</ins> { `JvmConsoleApi` }

返回控制台视图. 调用其方法需要控制台输出能力.

```kotlin
context.console().log("hello")
```

### JvmScriptContext.cancellation()

- <ins>**returns**</ins> { `JvmCancellation` }

返回只读的取消状态视图, 只能观察, 不能发起取消.

```kotlin
val cancellation = context.cancellation()
while (!cancellation.isCancellationRequested()) {
    context.sleep(100L)
}
```

### JvmScriptContext.sleep(millis)

- **millis** { `Long` } - 毫秒数, 不能为负
- <ins>**returns**</ins> { `Unit` }

可被取消的休眠. 需要休眠能力; 在 AutoJs6 中停止脚本时中断休眠并抛出 JvmCancellationException.

```kotlin
context.sleep(500L)
```

### JvmScriptContext.toast(message)

- **message** { `String` } - 消息
- <ins>**returns**</ins> { `Unit` }

请求宿主显示一条 toast. 需要 toast 能力; 宿主拒绝时脚本失败.

```kotlin
context.toast("done")
```

### JvmScriptContext.isCancellationRequested()

- <ins>**returns**</ins> { `Boolean` } - 是否已收到取消

便利方法, 等价于 `cancellation().isCancellationRequested()`.

```kotlin
if (context.isCancellationRequested()) return "cancelled"
```

### JvmScriptContext.throwIfCancellationRequested()

- <ins>**returns**</ins> { `Unit` }

便利方法, 等价于 `cancellation().throwIfCancellationRequested()`. 建议在长循环的每个工作单元之间调用.

```kotlin
repeat(1000) { index ->
    context.throwIfCancellationRequested()
    work(index)
}
```

---

## JvmAppApi

### JvmAppApi.launch(packageName)

- **packageName** { `String` } - 包名, 如 `com.example.app`
- <ins>**returns**</ins> { `Boolean` } - 宿主给出的启动结果

请求宿主启动一个已安装的应用. 宿主拒绝或响应异常时脚本失败.

```kotlin
val launched = context.app().launch("com.android.settings")
context.console().log("launched = $launched")
```

---

## JvmConsoleApi

### JvmConsoleApi.log(message)

- **message** { `String` } - 一行文本
- <ins>**returns**</ins> { `Unit` }

向标准输出写入一行, 在脚本运行期间逐行实时回传到 AutoJs6 控制台.

```kotlin
context.console().log("step 1")
```

### JvmConsoleApi.error(message)

- **message** { `String` } - 一行文本
- <ins>**returns**</ins> { `Unit` }

向标准错误写入一行, 在脚本运行期间逐行实时回传到 AutoJs6 控制台.

```kotlin
context.console().error("failed")
```

---

## JvmCancellation

### JvmCancellation.isCancellationRequested()

- <ins>**returns**</ins> { `Boolean` } - 是否已收到取消

非阻塞地查询会话是否已被取消.

```kotlin
if (context.cancellation().isCancellationRequested()) return "cancelled"
```

### JvmCancellation.throwIfCancellationRequested()

- <ins>**returns**</ins> { `Unit` }

会话已被取消时抛出 JvmCancellationException. 不要捕获它后继续运行.

```kotlin
context.cancellation().throwIfCancellationRequested()
```

---

## 相关链接

- [AutoJs6-Plugin-Kotlin-Runtime](https://github.com/SuperMonster003/AutoJs6-Plugin-Kotlin-Runtime): 插件仓库, README 列出能力边界与脚本运行库, `samples/` 含能力, 取消与协程示例.
- [Java 运行时](javaRuntime): 同一套接口的 Java 插件 (Entry API 4).
