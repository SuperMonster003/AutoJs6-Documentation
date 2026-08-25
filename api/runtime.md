# 运行时 (Runtime)

`runtime` 表示当前 JavaScript 脚本引擎的运行时对象. 每个脚本引擎都有独立的 `runtime`, 用于访问当前脚本的作用域, 生命周期状态, 动态类加载器和部分底层运行能力.

通常应优先使用对应的顶层模块或全局函数. 例如使用 [shell](shell) 而非 `runtime.shell()`, 使用 [continuation](continuation) 而非 `runtime.createContinuation()`. `runtime` 主要适用于兼容旧脚本和需要直接访问底层能力的场景.

本章节只记录面向脚本公开且行为稳定的成员. 运行时对象上还可能看到用于引擎初始化, 模块装配和资源回收的 Java 成员, 这些成员属于实现细节, 不应作为脚本 API 使用.

---

<p style="font: bold 2em sans-serif; color: #FF7043">runtime</p>

---

## [@] runtime

- { [Object](dataTypes#object) }

当前脚本的 `org.autojs.autojs.runtime.ScriptRuntime` 实例.

`runtime` 与当前脚本引擎绑定. 不同脚本中的 `runtime` 对象及其属性存储区彼此独立.

---

## [p] topLevelScope

**`Getter`** **`READONLY`**

- { [Object](dataTypes#object) }

当前脚本的 Rhino 顶层作用域, 与全局对象 [global](global) 指向同一对象.

```js
console.log(runtime.topLevelScope === global); // true
```

---

## [p] clip

**`Getter/Setter`**

- { [string](dataTypes#string) }

读取或写入系统剪贴板文本. 剪贴板没有文本内容时读取结果为空字符串.

此属性与全局函数 [getClip](global#m-getclip) 和 [setClip](global#m-setclip) 使用相同的底层实现.

```js
runtime.clip = "AutoJs6";
console.log(runtime.clip);
```

---

## [m] isStopped

### isStopped()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前脚本线程是否已收到中断标记

返回当前脚本线程的中断状态.

通常应使用全局函数 [isStopped](global#m-isstopped).

---

## [m] isExiting

### isExiting()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前运行时是否已进入退出清理阶段

返回运行时的退出状态. 此状态由脚本引擎维护, 在执行退出回收流程时变为 `true`.

---

## [p] screenMetrics

**`Getter`** **`READONLY`**

- { [ScreenMetrics](#screenmetrics) }

当前运行时的屏幕坐标缩放器.

自动化模块会使用此对象将脚本设计分辨率中的坐标缩放到当前设备分辨率. 通常应通过全局函数 [setScreenMetrics](global#m-setscreenmetrics) 设置设计分辨率.

---

## [p] rootShell

**`Getter`** **`READONLY`**

- { [Shell](shell) }

当前运行时延迟创建并复用的 Root Shell 实例.

首次读取此属性时会尝试启动 Root Shell. 设备未获得 Root 权限或授权被拒绝时可能失败. 实例会在当前脚本退出时自动关闭.

通常应使用 [shell](shell) 模块提供的命令执行方法或 Root 快捷方法.

---

## [m] requestPermissions

### requestPermissions(permissions)

- **permissions** { [string](dataTypes#string)[[]](dataTypes#array) } - Android 运行时权限名称
- <ins>**returns**</ins> { [void](dataTypes#void) }

请求当前未授予的 Android 运行时权限.

权限名称可使用完整形式, 如 `"android.permission.RECORD_AUDIO"`, 也可省略 `android.permission.` 前缀, 如 `"record_audio"`. 省略前缀时, 名称会转换为大写并自动补全前缀.

```js
runtime.requestPermissions([
    "record_audio",
    "android.permission.ACCESS_FINE_LOCATION",
]);
```

此方法会启动系统权限请求界面并立即返回, 不提供授权结果回调. 已授予的权限会被跳过. 请求能否成功还取决于权限是否已在当前 AutoJs6 应用或打包应用的 Manifest 中声明, 以及当前 Android 版本的权限策略.

> 参阅: [Android 运行时权限](https://developer.android.com/training/permissions/requesting)

---

## [m] sleep

### sleep(millis)

- **millis** { [number](dataTypes#number) } - 休眠时长, 单位为毫秒
- <ins>**returns**</ins> { [void](dataTypes#void) }

阻塞当前脚本线程指定时长. 线程在休眠期间被中断时抛出脚本中断异常.

通常应使用支持更多重载的全局函数 [sleep](global#m-sleep). 不应在 UI 线程中调用此方法, 否则会阻塞界面.

---

## [m] shell

### shell(command, withRoot)

- **command** { [string](dataTypes#string) } - Shell 命令
- **withRoot** { [number](dataTypes#number) } - 是否使用 Root 权限, `0` 表示不使用, 非 `0` 表示使用
- <ins>**returns**</ins> { [ShellResult](shell#c-shellresult) } - 命令执行结果

同步执行一条 Shell 命令.

这是保留在运行时对象上的底层兼容接口. 新脚本应使用 [shell](shell) 或 [shell.execCommand](shell#m-execcommand), 它们提供布尔形式的 Root 参数和更完整的命令参数处理.

```js
let result = runtime.shell("id", 0);
console.log(result.code);
console.log(result.result);
```

---

## [m] selector

### selector()

**`A11Y?`**

- <ins>**returns**</ins> { [UiSelector](uiSelectorType) } - 空选择器

创建一个与当前运行时无障碍桥接器绑定的空选择器.

创建对象本身不要求无障碍服务已启用, 但使用选择器查找或操作界面通常依赖无障碍服务. 通常应使用全局函数 [selector](global#m-selector).

---

## [m] requiresApi

### requiresApi(api)

- **api** { [number](dataTypes#number) } - 要求的最低 Android API 级别
- <ins>**returns**</ins> { [void](dataTypes#void) }

检查当前 Android API 级别. 当前值小于 **api** 时抛出脚本异常, 否则不执行任何操作.

通常应使用全局函数 [requiresApi](global#m-requiresapi).

```js
runtime.requiresApi(29);
```

> 参阅: [Android API 级别](apiLevel)

---

## [m] load

### load(...paths)

**`[6.3.2]`** **`[6.8.0]`** **`Overload 1/2`**

- **...paths** { [...](documentation#可变参数)[string](dataTypes#string)[[]](documentation#可变参数) } - JAR, DEX, AAR 文件或目录路径
- <ins>**returns**</ins> { [void](dataTypes#void) }

按扩展名自动加载一个或多个 `.jar`, `.dex` 或 `.aar` 文件. 扩展名不区分大小写.

参数也可以是目录路径. 此重载只扫描目录的直接子项, 不递归进入子目录.

相对路径按照当前脚本引擎的工作目录解析.

```js
runtime.load("./libs/library.jar", "./libs/classes.dex");
```

### load(directory, isRecursive)

**`6.3.2`** **`[6.8.0]`** **`Overload 2/2`**

- **directory** { [string](dataTypes#string) } - 待扫描的目录路径
- **isRecursive** { [boolean](dataTypes#boolean) } - 是否启用源码中的子目录筛选开关
- <ins>**returns**</ins> { [void](dataTypes#void) }

扫描目录并按扩展名自动加载其中的 `.jar`, `.dex` 和 `.aar` 文件.

AutoJs6 6.8.0 的通用加载实现只处理目录中的直接文件. **isRecursive** 为 `true` 时, 普通子目录虽然会通过文件筛选, 但不会继续交给加载器处理, 因此不应依赖此重载进行递归遍历.

---

## [m] loadDex

### loadDex(...paths)

**`[6.3.2]`** **`Overload 1/2`**

- **...paths** { [...](documentation#可变参数)[string](dataTypes#string)[[]](documentation#可变参数) } - DEX 文件或目录路径
- <ins>**returns**</ins> { [void](dataTypes#void) }

加载一个或多个 `.dex` 文件.

参数为目录路径时只加载目录直接包含的 `.dex` 文件. 相对路径按照当前脚本引擎的工作目录解析.

### loadDex(directory, isRecursive)

**`6.3.2`** **`Overload 2/2`**

- **directory** { [string](dataTypes#string) } - 待扫描的目录路径
- **isRecursive** { [boolean](dataTypes#boolean) } - 是否同时扫描直接子目录
- <ins>**returns**</ins> { [void](dataTypes#void) }

扫描目录并加载其中的 `.dex` 文件.

**isRecursive** 为 `true` 时还会扫描一层直接子目录, 但不会继续进入更深层级.

---

## [m] loadJar

### loadJar(...paths)

**`[6.3.2]`** **`Overload 1/2`**

- **...paths** { [...](documentation#可变参数)[string](dataTypes#string)[[]](documentation#可变参数) } - JAR 文件或目录路径
- <ins>**returns**</ins> { [void](dataTypes#void) }

加载一个或多个 `.jar` 文件中的 Java 类.

JAR 中的 JVM 字节码会先转换为 Android 可加载的 DEX 产物, 然后加入当前脚本使用的类加载器. 参数为目录路径时只加载目录直接包含的 `.jar` 文件. 相对路径按照当前脚本引擎的工作目录解析.

```js
runtime.loadJar("./libs/jsoup.jar");
importClass(org.jsoup.Jsoup);

let document = Jsoup.parse("<p>AutoJs6</p>");
console.log(document.text());
```

### loadJar(directory, isRecursive)

**`6.3.2`** **`Overload 2/2`**

- **directory** { [string](dataTypes#string) } - 待扫描的目录路径
- **isRecursive** { [boolean](dataTypes#boolean) } - 是否同时扫描直接子目录
- <ins>**returns**</ins> { [void](dataTypes#void) }

扫描目录并加载其中的 `.jar` 文件.

**isRecursive** 为 `true` 时还会扫描一层直接子目录, 但不会继续进入更深层级.

---

## [m] loadJarWithR8

### loadJarWithR8(program, keepRules)

**`6.8.0`** **`Overload 1/3`**

- **program** { [string](dataTypes#string) } - 待编译和加载的 program JAR 路径
- **keepRules** { [string](dataTypes#string)[] } - 非空的显式 R8 keep-rule 文件路径数组
- <ins>**returns**</ins> { [void](dataTypes#void) }

通过用户显式选择的独立 R8 provider, 以 full-release 配置编译一个 JAR, 验证完整产物事务后将其中的 DEX 加入当前脚本类加载器.

此方法会执行 shrinking, optimization 和 obfuscation. 调用前必须在开发者选项的 R8 编译器设置中选择一个与宿主同签名的精确 service 组件. R8 选择默认关闭, 且 **keepRules** 至少包含一个非空规则文件. 未选择 provider, provider 不可用, 协议或身份不匹配, 编译失败, 产物损坏, 缓存失败及 DEX 加载失败都会直接抛出异常. 此入口没有 D8/dx 语义回退.

```js
runtime.loadJarWithR8(
    "./libs/example.jar",
    ["./rules/example-keep.pro"],
);

importClass(example.EntryPoint);
console.log(EntryPoint.run());
```

### loadJarWithR8(program, keepRules, orderedClasspath)

**`6.8.0`** **`Overload 2/3`**

- **program** { [string](dataTypes#string) } - 待编译和加载的 program JAR 路径
- **keepRules** { [string](dataTypes#string)[] } - 非空的显式 R8 keep-rule 文件路径数组
- **orderedClasspath** { [string](dataTypes#string)[] } - 有序的编译期 classpath JAR 路径数组
- <ins>**returns**</ins> { [void](dataTypes#void) }

在显式 keep rules 之外提供有序的编译期 classpath. Classpath JAR 只参与 R8 解析, 不会被写入 program 输出或作为额外 JAR 自动加入脚本类加载器. Program 在运行时引用的外部类型仍须由当前父类加载器提供.

### loadJarWithR8(program, keepRules, orderedClasspath, consumerRules, consumerRuleClasspathOrdinals)

**`6.8.0`** **`Overload 3/3`**

- **program** { [string](dataTypes#string) } - 待编译和加载的 program JAR 路径
- **keepRules** { [string](dataTypes#string)[] } - 非空的显式 R8 keep-rule 文件路径数组
- **orderedClasspath** { [string](dataTypes#string)[] } - 有序的编译期 classpath JAR 路径数组
- **consumerRules** { [string](dataTypes#string)[] } - 显式 consumer-rule 文件路径数组
- **consumerRuleClasspathOrdinals** { [number](dataTypes#number)[] } - 每份 consumer rules 对应的 classpath 索引数组
- <ins>**returns**</ins> { [void](dataTypes#void) }

为 classpath JAR 显式绑定 consumer rules. **consumerRules** 与 **consumerRuleClasspathOrdinals** 的长度必须相同. 每个 ordinal 必须是 **orderedClasspath** 的有效零基索引, 同一个 classpath JAR 可以绑定多份 consumer rules.

```js
runtime.loadJarWithR8(
    "./libs/example.jar",
    ["./rules/example-keep.pro"],
    ["./libs/example-api.jar", "./libs/support-api.jar"],
    ["./rules/example-api-consumer.pro", "./rules/support-api-consumer.pro"],
    [0, 1],
);
```

所有路径都按照当前脚本引擎的工作目录解析并由宿主先快照到无路径的 canonical 输入包. Provider 返回的 `DEX_ZIP`, `MAPPING_TEXT`, `SEEDS_TEXT`, `USAGE_TEXT` 和 `RETRACE_METADATA` 必须全部通过大小, 摘要, 协议和 DEX 完整性校验, 之后仅 `DEX_ZIP` 会进入类加载器. 该调用是阻塞操作, 不能在 Android 主线程执行. `runtime.loadJar()` 与 `runtime.loadJarWithClasspath()` 的既有行为不受 R8 选择影响.

---

## [m] loadAar

### loadAar(...paths)

**`6.8.0`** **`Overload 1/2`**

- **...paths** { [...](documentation#可变参数)[string](dataTypes#string)[[]](documentation#可变参数) } - AAR 文件或目录路径
- <ins>**returns**</ins> { [void](dataTypes#void) }

加载一个或多个 `.aar` 文件中的 Java 或 Kotlin 类.

AutoJs6 会合并 AAR 根目录中的 `classes.jar` 和 `libs/*.jar` 内可加载的条目, 再按 JAR 加载流程转换并加载. AAR 中的 Android Manifest, `res/` 资源和原生库不会被安装或注册. 因此此方法适用于不依赖 AAR Android 资源注册过程的类库.

参数为目录路径时只加载目录直接包含的 `.aar` 文件. 相对路径按照当前脚本引擎的工作目录解析.

```js
runtime.loadAar("./libs/example.aar");
```

### loadAar(directory, isRecursive)

**`6.8.0`** **`Overload 2/2`**

- **directory** { [string](dataTypes#string) } - 待扫描的目录路径
- **isRecursive** { [boolean](dataTypes#boolean) } - 是否同时扫描直接子目录
- <ins>**returns**</ins> { [void](dataTypes#void) }

扫描目录并加载其中的 `.aar` 文件.

**isRecursive** 为 `true` 时还会扫描一层直接子目录, 但不会继续进入更深层级.

---

## 动态加载注意事项

- 明确交给 DEX, JAR 或 AAR 加载器的文件不存在, 不可读, 格式无效或字节码转换失败时会抛出异常. `load()` 会忽略扩展名不受支持的普通文件; 无法列出内容的目录也不会产生加载结果.
- 同一运行环境中已加载类的解析结果可能受类名冲突和类加载顺序影响. 应避免多个文件声明同名类.
- `loadJar()`, `loadJarWithR8()` 和 `loadAar()` 只能转换当前设备和转换器支持的字节码. 类库仍需兼容 Android 运行环境及当前设备 API 级别.
- 加载完成后可通过完整包名访问类, 或使用全局函数 [importClass](global#m-importclass) 和 [importPackage](global#m-importpackage).
- 需要任意深度扫描时, 应先使用 [files](files) 枚举目标文件, 再把明确的文件路径传给可变参数重载.

---

## [m] isJavaPrimitiveWrap

### isJavaPrimitiveWrap()

**`6.7.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否包装 Java 原始类型

返回当前 Rhino 上下文的 Java 原始类型包装策略.

启用时, 从 Java 返回的原始类型保留为 Java 包装对象. 禁用时, 这些值转换为对应的 JavaScript 原始值.

---

## [m] setJavaPrimitiveWrap

### setJavaPrimitiveWrap(enabled)

**`6.7.0`**

- **enabled** { [boolean](dataTypes#boolean) } - 是否包装 Java 原始类型
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置当前 Rhino 上下文的 Java 原始类型包装策略.

该设置会影响 Java 与 JavaScript 之间的值转换. 依赖具体 Java 包装类型的代码应在修改后自行恢复原设置.

```js
let original = runtime.isJavaPrimitiveWrap();

try {
    runtime.setJavaPrimitiveWrap(false);
    // 执行需要 JavaScript 原始值的 Java 互操作代码.
} finally {
    runtime.setJavaPrimitiveWrap(original);
}
```

---

## [m] exit

### exit(error?)

- **[ error = null ]** { [java.lang.Throwable](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Throwable.html) } - 退出前报告给当前脚本引擎的异常
- <ins>**returns**</ins> { [void](dataTypes#void) }

请求当前脚本引擎停止, 中断脚本线程并启动资源回收流程.

提供 **error** 时, 异常会先作为当前脚本的未捕获异常报告. JavaScript 错误对象应优先交给全局函数 [exit](global#m-exit), 由其转换为运行时可处理的异常.

从后台脚本线程调用时会抛出脚本中断异常. 如果脚本捕获并忽略该异常, 后续代码仍可能在引擎完全停止前短暂执行.

---

## [m] stop

### stop()

**`DEPRECATED`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

停止当前脚本. 此方法已弃用, 请使用 [runtime.exit](#m-exit) 或全局函数 [exit](global#m-exit).

---

## [m] setScreenMetrics

### setScreenMetrics(width, height)

- **width** { [number](dataTypes#number) } - 脚本设计时的屏幕宽度, 单位为像素
- **height** { [number](dataTypes#number) } - 脚本设计时的屏幕高度, 单位为像素
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置当前运行时的设计分辨率.

某一维度为 `0` 时, 该方向不执行自动缩放. 通常应使用全局函数 [setScreenMetrics](global#m-setscreenmetrics).

---

## [m] getProperty

### getProperty(key)

- **key** { [string](dataTypes#string) } - 属性键
- <ins>**returns**</ins> { [any](dataTypes#any) | [null](dataTypes#null) } - 属性值, 不存在时为 `null`

读取当前运行时属性存储区中的值.

此存储区仅属于当前脚本运行时, 不会在脚本重新运行后保留. AutoJs6 内部也会使用该存储区, 自定义键应添加不易冲突的前缀.

---

## [m] putProperty

### putProperty(key, value)

- **key** { [string](dataTypes#string) } - 属性键
- **value** { [any](dataTypes#any) } - 非 `null` 的属性值
- <ins>**returns**</ins> { [any](dataTypes#any) | [null](dataTypes#null) } - 此前关联的值, 不存在时为 `null`

在当前运行时属性存储区中保存一个值.

底层存储区不接受 `null` 值. 如需删除属性, 使用 [removeProperty](#m-removeproperty).

```js
let key = "example.counter";
runtime.putProperty(key, 1);
console.log(runtime.getProperty(key)); // 1
runtime.removeProperty(key);
```

---

## [m] removeProperty

### removeProperty(key)

- **key** { [string](dataTypes#string) } - 属性键
- <ins>**returns**</ins> { [any](dataTypes#any) | [null](dataTypes#null) } - 被移除的值, 不存在时为 `null`

从当前运行时属性存储区中移除属性.

---

## [m] createContinuation

### createContinuation()

**`Overload 1/2`**

- <ins>**returns**</ins> { [Object](dataTypes#object) } - Rhino 底层续体对象

使用当前脚本的顶层作用域创建 Rhino 续体对象.

### createContinuation(scope)

**`Overload 2/2`**

- **scope** { `org.mozilla.javascript.Scriptable` } - Rhino 脚本作用域
- <ins>**returns**</ins> { [Object](dataTypes#object) } - Rhino 底层续体对象

将指定作用域传给 Rhino 续体工厂. AutoJs6 6.8.0 的工厂实现从 **scope** 的 `parentScope` 继续解析续体作用域, 而不是直接使用 **scope**. 顶层作用域的 `parentScope` 可能为空, 因此不应把此重载作为普通续体创建入口.

这些方法是 [continuation.create](continuation#m-create) 使用的底层接口. 新脚本应使用 `continuation` 模块, 并在脚本项目的 `useFeatures` 中启用 `"continuation"`.

---

# ScreenMetrics

`runtime.screenMetrics` 返回的坐标缩放器.

`scaleX()` 和 `scaleY()` 将设计分辨率坐标转换为当前设备坐标. `rescaleX()` 和 `rescaleY()` 执行反向转换. 计算结果使用整数运算.

---

<p style="font: bold 2em sans-serif; color: #FF7043">ScreenMetrics</p>

---

## [m#] setScreenMetrics

### setScreenMetrics(width, height)

- **width** { [number](dataTypes#number) } - 设计宽度, 单位为像素
- **height** { [number](dataTypes#number) } - 设计高度, 单位为像素
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置此缩放器使用的设计分辨率.

---

## [m#] scaleX

### scaleX(x)

**`Overload 1/2`**

- **x** { [number](dataTypes#number) } - 设计分辨率中的横坐标
- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前设备中的横坐标

使用已设置的设计宽度缩放横坐标.

设计宽度为 `0` 或屏幕尺寸尚未初始化时, 返回 **x**.

### scaleX(x, width)

**`Overload 2/2`**

- **x** { [number](dataTypes#number) } - 设计分辨率中的横坐标
- **width** { [number](dataTypes#number) } - 本次换算使用的设计宽度
- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前设备中的横坐标

使用指定设计宽度缩放横坐标.

**width** 为 `0` 或屏幕尺寸尚未初始化时, 返回 **x**.

---

## [m#] scaleY

### scaleY(y)

**`Overload 1/2`**

- **y** { [number](dataTypes#number) } - 设计分辨率中的纵坐标
- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前设备中的纵坐标

使用已设置的设计高度缩放纵坐标.

设计高度为 `0` 或屏幕尺寸尚未初始化时, 返回 **y**.

### scaleY(y, height)

**`Overload 2/2`**

- **y** { [number](dataTypes#number) } - 设计分辨率中的纵坐标
- **height** { [number](dataTypes#number) } - 本次换算使用的设计高度
- <ins>**returns**</ins> { [number](dataTypes#number) } - 当前设备中的纵坐标

使用指定设计高度缩放纵坐标.

**height** 为 `0` 或屏幕尺寸尚未初始化时, 返回 **y**.

---

## [m#] rescaleX

### rescaleX(x)

**`Overload 1/2`**

- **x** { [number](dataTypes#number) } - 当前设备中的横坐标
- <ins>**returns**</ins> { [number](dataTypes#number) } - 设计分辨率中的横坐标

使用已设置的设计宽度反向换算横坐标.

设计宽度为 `0` 或屏幕尺寸尚未初始化时, 返回 **x**.

### rescaleX(x, width)

**`Overload 2/2`**

- **x** { [number](dataTypes#number) } - 当前设备中的横坐标
- **width** { [number](dataTypes#number) } - 本次换算使用的设计宽度
- <ins>**returns**</ins> { [number](dataTypes#number) } - 设计分辨率中的横坐标

使用指定设计宽度反向换算横坐标.

**width** 为 `0` 或屏幕尺寸尚未初始化时, 返回 **x**.

---

## [m#] rescaleY

### rescaleY(y)

**`Overload 1/2`**

- **y** { [number](dataTypes#number) } - 当前设备中的纵坐标
- <ins>**returns**</ins> { [number](dataTypes#number) } - 设计分辨率中的纵坐标

使用已设置的设计高度反向换算纵坐标.

设计高度为 `0` 或屏幕尺寸尚未初始化时, 返回 **y**.

### rescaleY(y, height)

**`Overload 2/2`**

- **y** { [number](dataTypes#number) } - 当前设备中的纵坐标
- **height** { [number](dataTypes#number) } - 本次换算使用的设计高度
- <ins>**returns**</ins> { [number](dataTypes#number) } - 设计分辨率中的纵坐标

使用指定设计高度反向换算纵坐标.

**height** 为 `0` 或屏幕尺寸尚未初始化时, 返回 **y**.

---

# 模块后端对象

`runtime` 上的 `app`, `console`, `device`, `engines`, `files`, `images`, `media`, `recorder`, `sensors`, `threads`, `timers` 等属性是顶层模块使用的 Java 后端对象.

这些对象不一定具有与同名顶层模块完全相同的成员, 参数归一化和返回值转换. 除非某个章节明确要求传入运行时后端对象, 脚本应使用对应的顶层模块.

`initPrologue()`, `initEpilogue()`, `onExit()`, `cancelScriptJobs()` 以及协程, Handler, Looper, 桥接器和资源管理器相关成员属于脚本引擎实现细节, 不属于稳定文档 API.
