# Java 运行时 (Java Runtime)

<!-- type=misc -->

Java 运行时是一个独立安装的 AutoJs6 插件 ([AutoJs6-Plugin-Java-Runtime](https://github.com/SuperMonster003/AutoJs6-Plugin-Java-Runtime)). 它用内置的 ECJ 编译器与 D8 把 `.java` 源码编译为 DEX, 在插件的一次性 worker 进程中执行, 编译器与脚本都不进入 AutoJs6 进程. 本页列出脚本可用的 JVM Entry API 4: 包 `org.autojs.plugin.jvmsource.api` 中的 7 个类型与 17 个方法, 依据插件 0.8.4-m9 (最低 AutoJs6 构建 5281).

本页的 API 属于 Java 语言, 不在 AutoJs6 的运行时覆盖矩阵 (Rhino, Node.js 与 Bun) 中, 因此页面顶部没有运行时支持表. 条目的名称与参数个数由 AutoJs6 仓库的静态门禁 `tools/api-coverage/language_runtimes.py` 与插件冻结的接口包 (`protocol/jvm-source-api.aar`) 逐项比对. Kotlin 运行时使用同一套接口的子集, 见 [Kotlin 运行时](kotlinRuntime).

---

## 使用方式

- 启用: JVM 源码运行目前是 AutoJs6 的实验性功能, 需在 AutoJs6 中开启该实验开关, 并为 Java 语言选择本插件作为编译组件; 未开启或未选择时, 运行以错误码 `JVM_SOURCE_EXPERIMENT_DISABLED` 或 `JVM_SOURCE_PROVIDER_NOT_SELECTED` 结束.
- 入口: 在编辑器中新建 `.java` 文件并运行. 入口类须为 public 的非抽象类, 实现 AutoJsJvmEntry 并具有 public 无参构造器, 简名默认为 `Main`; 编译结果中只能有一个实现 AutoJsJvmEntry 的具体类.
- 语言级别: Java 8 (ECJ `-source 8 -target 8`), Android 平台接口以 API 24 为准. Lambda 不属于可运行的范围, 请使用匿名类.
- 能力: JvmScriptContext 的每项宿主调用都受本次会话协商的能力约束 (控制台输出, 应用启动, 休眠, toast, 剪贴板读与写各自独立); 调用未授予的能力会终止本次执行, 不会静默降级.
- 返回值: run 的返回值按 JSON 编码后交给宿主, 支持 `null`, `Boolean`, 整数与有限小数, `CharSequence` / `Character`, 键为 `String` 的 `Map`, `Iterable` 与数组 (元素递归遵守同一规则), 编码后最多 64 KiB, 嵌套最多 64 层.
- 时限: 会话默认 30 秒, 最长 120 秒, 包括编译, DEX 转换与执行; 同一时间只运行一个会话.

```java
import org.autojs.plugin.jvmsource.api.AutoJsJvmEntry;
import org.autojs.plugin.jvmsource.api.JvmScriptContext;

public final class Main implements AutoJsJvmEntry {
    @Override
    public Object run(JvmScriptContext context) throws Exception {
        context.console().log("Java worker started");
        context.toast("Hello from Java");
        context.sleep(250L);
        context.throwIfCancellationRequested();
        return 42;
    }
}
```

除 AutoJsJvmEntry.run 外, 本页示例都是 `run(JvmScriptContext context)` 方法体中的片段.

---

## 类型

| 类型 | 种类 | 说明 |
| --- | --- | --- |
| `AutoJsJvmEntry` | 接口 | 入口类实现的接口 |
| `JvmScriptContext` | 接口 | run 收到的上下文, 是唯一受支持的宿主桥 |
| `JvmAppApi` | 接口 | 应用启动 |
| `JvmClipboardApi` | 接口 | 宿主剪贴板 |
| `JvmConsoleApi` | 接口 | 控制台输出 |
| `JvmCancellation` | 接口 | 只读的取消状态 |
| `JvmCancellationException` | 类, 继承 `Exception` | 会话被取消时抛出 |

---

## AutoJsJvmEntry

### AutoJsJvmEntry.run(context)

- **context** { `JvmScriptContext` } - 本次执行的上下文
- <ins>**returns**</ins> { `Object` } - 交给宿主的结果, 可以为 `null`

入口方法. 声明为 `public Object run(JvmScriptContext context) throws Exception`, 可以省略 `throws Exception`, 也可以使用协变返回类型.

```java
public final class Main implements AutoJsJvmEntry {
    @Override
    public Object run(JvmScriptContext context) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("ok", true);
        result.put("items", Arrays.asList(1, 2, 3));
        return result;
    }
}
```

---

## JvmScriptContext

### JvmScriptContext.app()

- <ins>**returns**</ins> { `JvmAppApi` }

返回应用启动视图. 调用其方法需要应用启动能力.

```java
boolean launched = context.app().launch("org.autojs.autojs6");
```

### JvmScriptContext.args()

- <ins>**returns**</ins> { `Map<String, Object>` } - 深层不可变的参数快照, 没有参数时为空 Map

返回宿主在执行开始前冻结的脚本参数. 整数在 `long` 范围内为 `Long`, 更大的为 `BigInteger`, 小数为 `BigDecimal`, 对象与数组为不可修改的 `Map` / `List`. 不需要能力, 也不产生宿主调用.

```java
Object user = context.args().get("user");
context.console().log("user = " + user);
```

### JvmScriptContext.clipboard()

- <ins>**returns**</ins> { `JvmClipboardApi` }

返回剪贴板视图. 读与写分别需要剪贴板读取与剪贴板写入能力; Android 10 及以上调用时 AutoJs6 须有处于前台的界面.

```java
String text = context.clipboard().getText();
```

### JvmScriptContext.console()

- <ins>**returns**</ins> { `JvmConsoleApi` }

返回控制台视图. 调用其方法需要控制台输出能力.

```java
context.console().log("hello");
```

### JvmScriptContext.cancellation()

- <ins>**returns**</ins> { `JvmCancellation` }

返回只读的取消状态视图, 只能观察, 不能发起取消.

```java
JvmCancellation cancellation = context.cancellation();
while (!cancellation.isCancellationRequested()) {
    context.sleep(100L);
}
```

### JvmScriptContext.sleep(millis)

- **millis** { `long` } - 毫秒数, 不能为负
- <ins>**returns**</ins> { `void` }

可被取消的休眠. 需要休眠能力; 会话被取消时中断休眠并抛出 JvmCancellationException. 休眠仍计入会话时限.

```java
context.sleep(500L);
```

### JvmScriptContext.toast(message)

- **message** { `String` } - 消息, 最多 8 KiB (UTF-8)
- <ins>**returns**</ins> { `void` }

请求宿主显示一条 toast. 需要 toast 能力; 宿主拒绝时脚本失败.

```java
context.toast("done");
```

### JvmScriptContext.isCancellationRequested()

- <ins>**returns**</ins> { `boolean` } - 是否已收到取消

便利方法, 等价于 `cancellation().isCancellationRequested()` (自 Entry API 2 起提供的默认方法).

```java
if (context.isCancellationRequested()) {
    return null;
}
```

### JvmScriptContext.throwIfCancellationRequested()

- <ins>**returns**</ins> { `void` }

便利方法, 等价于 `cancellation().throwIfCancellationRequested()` (自 Entry API 2 起提供的默认方法). 建议在长循环的每个工作单元之间调用.

```java
for (int i = 0; i < 1000; i++) {
    context.throwIfCancellationRequested();
    work(i);
}
```

---

## JvmAppApi

### JvmAppApi.launch(packageName)

- **packageName** { `String` } - 包名, 至少两个以点分隔的合法段, 如 `com.example.app`
- <ins>**returns**</ins> { `boolean` } - 宿主给出的启动结果

请求宿主启动一个已安装的应用. 宿主拒绝, 响应异常或 10 秒内无响应时脚本失败.

```java
boolean launched = context.app().launch("com.android.settings");
context.console().log("launched = " + launched);
```

---

## JvmClipboardApi

### JvmClipboardApi.getText()

- <ins>**returns**</ins> { `String` } - 剪贴板文本, 没有文本时为空字符串

读取宿主剪贴板的纯文本. 需要剪贴板读取能力.

```java
context.console().log(context.clipboard().getText());
```

### JvmClipboardApi.setText(text)

- **text** { `String` } - 文本, 可以为空字符串, 最多 16 KiB (UTF-8)
- <ins>**returns**</ins> { `void` }

用给定纯文本替换宿主剪贴板的内容. 需要剪贴板写入能力.

```java
context.clipboard().setText("copied from Java");
```

---

## JvmConsoleApi

### JvmConsoleApi.log(message)

- **message** { `String` } - 一行文本
- <ins>**returns**</ins> { `void` }

以 UTF-8 向标准输出写入一行. 标准输出最多 1 MiB, `System.out` 共用这一上限; 写入前检查取消.

```java
context.console().log("step 1");
```

### JvmConsoleApi.error(message)

- **message** { `String` } - 一行文本
- <ins>**returns**</ins> { `void` }

以 UTF-8 向标准错误写入一行. 标准错误最多 1 MiB, `System.err` 共用这一上限; 写入前检查取消.

```java
context.console().error("failed");
```

---

## JvmCancellation

### JvmCancellation.isCancellationRequested()

- <ins>**returns**</ins> { `boolean` } - 是否已收到取消

非阻塞地查询会话是否已被取消 (用户停止, 超时, 宿主关闭会话等).

```java
if (context.cancellation().isCancellationRequested()) {
    return "cancelled";
}
```

### JvmCancellation.throwIfCancellationRequested()

- <ins>**returns**</ins> { `void` }

会话已被取消时抛出 JvmCancellationException. 不要捕获它后继续运行: 取消只有有限的宽限期, 不配合的 worker 最终会被直接终止.

```java
context.cancellation().throwIfCancellationRequested();
```

---

## 相关链接

- [AutoJs6-Plugin-Java-Runtime](https://github.com/SuperMonster003/AutoJs6-Plugin-Java-Runtime): 插件仓库, `docs/context-api.zh-CN.md` 列出全部上限, 错误码与返回值规则.
- [Kotlin 运行时](kotlinRuntime): 使用同一套接口 (Entry API 2) 的 Kotlin 插件.
