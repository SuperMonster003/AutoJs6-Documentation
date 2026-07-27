# 存疑内容 (Suspicious)

本页记录无法仅依据 AutoJs6 6.8.0 Augmentable API 源码准确还原的公开成员或历史文档内容. 在行为得到实现, 官方声明或可重复运行结果确认前, 这些内容不写入正式 API 条目.

## pinyin.compare 与 pinyin.compact

- **源码位置** - `runtime/api/augment/pinyin/Pinyin.kt`.
- **当前状态** - 两个名称均作为公开方法导出, 但当前实现忽略参数并固定返回空字符串.
- **存疑原因** - 方法名称暗示比较或压缩拼音结果, 但源码没有可验证的目标语义. 正式 [Pinyin](pinyin) 文档暂不猜测其参数和结果.

## util 的 Node.js 兼容条目

- **涉及内容** - `util.callbackify`, `util.inherits`, `util.promisify`, `util.TextDecoder`, `util.TextEncoder`, `util.inspect.custom`, `util.inspect.defaultOptions`, `util._extend`, `util.debug`, `util.error`, `util.isBuffer`, `util.print` 和 `util.puts`.
- **当前状态** - 这些名称不在 AutoJs6 6.8.0 `augment/util` 的公开挂载列表中.
- **存疑原因** - 旧页面内容来自早期 Node.js `util` 文档, 无法证明其仍属于 Rhino Augmentable API. 应以当前 `Util`, `Inspect`, `Java`, `MorseCode`, `Version` 和 `VersionCodes` 实现为准.

## ui.useAndroidResources

- **当前状态** - AutoJs6 6.8.0 `augment/ui/UI.kt` 未导出 `ui.useAndroidResources`.
- **存疑原因** - 旧条目描述项目资源目录功能, 但当前公开成员为 [ui.useAndroidLayout](ui#ui-useandroidlayout-enabled), 两者行为不同. 旧条目已从正式文档移除.

## UI 布局属性的实现边界

- **源码位置** - `core/ui/attribute`, `core/ui/inflater/inflaters/TextViewInflater.kt` 及 `core/ui/widget/JsListView.java`.
- **当前状态** - 当前实现存在以下可验证行为:
    - `imeOptions` 的全部命名选项都映射为 `IME_ACTION_DONE`.
    - `phoneNumber="true"` 添加的是 `TYPE_TEXT_VARIATION_PHONETIC`, 不是电话输入类型.
    - `lineSpacingMultiplier` 和 `textScaleX` 使用尺寸解析器处理比例值.
    - `isCircle` 或 `circle` 以及 `excludeFromNavigationBar` 只要出现就执行启用操作, 不读取属性值.
    - `paddingHorizontal` 和 `paddingVertical` 先注册 setter, 随后又被明确注册为不支持.
    - ListView 的 `item_bind` 在 ViewHolder 构造阶段触发, 此时 ItemHolder 尚未写入数据项.
- **存疑原因** - 上述行为与属性名称或对应 Android API 的通常语义不一致. 正式 [UI 布局属性](uiAttributes) 按当前实现描述可观察结果, 预期语义仍需实现修正或可重复运行结果进一步确认.

## runtime.load 系列的 isRecursive 参数

- **源码位置** - `runtime/ScriptRuntime.kt` 中的 `load`, `loadDex`, `loadJar`, `loadAar` 目录重载及对应 `doLoad` 实现.
- **当前状态** - `load(directory, true)` 不会继续处理普通子目录. `loadDex`, `loadJar` 和 `loadAar` 的对应重载只会额外扫描一层直接子目录, 不会进行任意深度遍历.
- **存疑原因** - 参数名 **isRecursive** 和历史文档均暗示递归扫描, 但 AutoJs6 6.8.0 源码行为与此不一致. 正式 [Runtime](runtime) 文档按当前实现描述, 是否应进行完整递归仍需实现修正或可重复运行结果进一步确认.

## recorder(key, timestamp) 的 timestamp 参数

- **源码位置** - `runtime/api/Recorder.kt` 中的 `shortcut` 方法.
- **当前状态** - 可调用模块接受第 2 个参数, 但命名记录分支始终使用无参数的 `toTimestamp()`. 因此 AutoJs6 6.8.0 中 `recorder(key, timestamp)` 与 `recorder(key)` 行为相同. 参数 **timestamp** 不参与保存或时间差计算.
- **存疑原因** - 参数位置及历史声明暗示可指定时间戳, 但当前源码完全忽略该值. 正式 [Recorder](recorder) 文档按实际行为标明此限制, 预期语义仍需实现修正或可重复运行结果进一步确认.

## threads.pool 的 maxPoolSize 零值

- **源码位置** - `runtime/api/Threads.kt` 中的 `internalPool` 方法.
- **当前状态** - **maxPoolSize** 为 `0` 时, 实现会把实际最大线程数转换为 `2147483647`. 但转换后的数值没有用于随后执行的大小校验, 因此 **corePoolSize** 大于 `0` 且 **maxPoolSize** 为 `0` 时仍会抛出异常.
- **存疑原因** - `0` 的哨兵语义与参数校验相互冲突. 正式 [Threads](threads) 文档按当前实现标明此限制, 预期校验规则仍需实现修正或可重复运行结果进一步确认.

## threads.disposable 的通知时序与超时

- **源码位置** - `runtime/api/augment/threads/VolatileDisposeNativeObject.kt`.
- **当前状态** - `setAndNotify(value)` 不记录单独的就绪状态. 它在等待开始前调用时, 后续 `blockedGet` 仍会等待新的条件信号. 指定正数超时时, 条件被提前通知后仍会继续等待至超时时间用尽, 然后返回已经保存的值. `blockedGetOrThrow(exception)` 只预先检查参数是否为 Java `Class`, 不验证它是否继承 `RuntimeException` 或具有可访问的无参数构造方法.
- **存疑原因** - 当前行为与一次性结果容器通常具有的先通知后读取及提前唤醒语义不一致. 正式 [Threads](threads) 文档按源码标明时序限制, 预期行为仍需实现修正或可重复运行结果进一步确认.

## runtime.createContinuation(scope) 的父作用域

- **源码位置** - `runtime/ScriptRuntime.kt` 中的 `createContinuation` 重载, 以及 `rhino/continuation/Continuation.kt` 中的 `create` 重载.
- **当前状态** - `createContinuation(scope)` 把参数交给接受 `Scriptable` 的续体工厂, 该工厂立即使用 `scope.parentScope` 继续创建续体. 参数 **scope** 本身不会直接成为续体作用域.
- **存疑原因** - 参数名和历史调用形式暗示应使用指定作用域, 但当前实现改用父作用域, 且顶层作用域的父作用域可能为空. 正式 [Runtime](runtime) 文档按源码标明此行为并建议使用 [continuation](continuation), 预期作用域语义仍需实现修正或可重复运行结果进一步确认.
