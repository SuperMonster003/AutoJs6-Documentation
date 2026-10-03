# Compose UI (Compose)

`compose` 与 `$compose` 是同一个可调用模块, 通过 Compose UI 插件创建脚本界面. 脚本描述节点, 状态与事件, 插件负责 Jetpack Compose 渲染. 本参考对应 1.0.0 本地开发预览及配套 AutoJs6 宿主, 尚无官方发行版.

运行需要 Android 7.0 / API 24 或以上, 包含 Compose 模块的配套 Rhino 运行时, 以及已安装, 已启用且通过信任与兼容性检查的 Compose UI 插件. 最低宿主构建要求为 AutoJs6 6.8.0 / 5316, 同时仍须满足实际插件契约和共享依赖检查.

| 内容 | 参考 |
| --- | --- |
| 节点属性, 树操作与原生命令 | [ComposeNode](composeNodeType) |
| 响应式状态 | [ComposeState](composeStateType) |
| 布局修饰链 | [ComposeModifier](composeModifierType) |
| 主题覆盖 | [ComposeTheme](composeThemeType) |
| 会话与 Snackbar | [ComposeSession](composeSessionType) |
| 悬浮窗口 | [ComposeFloatyWindow](composeFloatyWindowType) |
| 组件属性, 插槽, 事件和生成目录 | [ComposeComponents](composeComponents) |

1.0.0 提供 UI 模式页面和 `compose.floaty` 两种承载方式. 没有 TSX/JSX 接入, `compose.dialog` 或 XML/Android View 与 Compose 的混合节点挂载接口. 组件目录中的 `AlertDialog` 是已有会话内的组件, 不表示存在独立的 `compose.dialog` 承载入口.

## 两层使用方式

### 节点句柄

先创建节点并保存句柄, 挂载后直接修改属性或子节点. 同一轮更新会传到已经存在的界面.

```js
'ui';

let title = compose.Text({text: 'Ready'});
let button = compose.Button({onClick: function () {
    title.text = 'Clicked';
}}, 'Run');
let session = compose.mount(compose.Column({padding: 16}, title, button));
```

节点是 [ComposeNode](composeNodeType), 不是原生 View. 只允许目录声明的属性和命令.

### state 与 render

把函数传给 `mount` 或 `floaty`, 函数读取 [ComposeState.value](composeStateType#p-value) 并返回一个根节点. 后续状态变化会安排重绘, 并根据组件类型和 key 复用已有节点.

```js
'ui';

let count = compose.state(0);
compose.mount(function () {
    return compose.Column({padding: 16},
        compose.Text({key: 'count', text: 'Count: ' + count.value}),
        compose.Button({key: 'increment', onClick: function () {
            count.value++;
        }}, 'Increment'));
});
```

两种方式可以配合: 渲染函数可使用先前保存的节点, 也可通过 `ref` 取得成功帧中的实际节点. 渲染函数中新创建的节点是用于协调的声明, 后续渲染可能把它们合并到原节点; 需要长期持有实际句柄时使用 `ref.current`.

同一父节点的普通 children 列表中, 非 `null` 的 key 必须唯一. 有 key 的子节点按 key 和组件类型复用, 无 key 的子节点按同类型的出现次序匹配. 具名插槽按插槽名协调, 不参与普通 children 的 key 冲突检查. 多子节点渲染中缺少 key 会每个会话最多警告一次; 警告不拒绝渲染, 但会话内重排仍应使用稳定 key.

## 线程与生命周期

- UI 脚本由 `'ui';` 声明, 其 Compose 操作在该脚本的 UI 调度线程执行.
- 非 UI 脚本使用 `compose.floaty`, JavaScript 回调仍在创建会话的脚本线程执行, 原生窗口与绘制在 Android 主线程处理.
- 组件属性, state 读写, 树操作, 主题和普通窗口方法需要所属脚本线程. 工作线程使用 `compose.post`, `session.post` 或 `window.post`; 清理用的幂等 `close()` 也可从工作线程请求.
- 原生事件排队回到脚本线程, 不在 Compose 的组合, 布局或绘制期间同步执行 JavaScript. UI 脚本中的阻塞等待同样会阻塞界面.
- 同一脚本引擎最多有 8 个活动会话, UI 页面和悬浮窗共同计数. 替换现有 UI 页面时会扣除即将替换的旧 UI 会话, 不额外消耗一个长期名额.
- 新的 `compose.mount` 替换旧的 Compose UI 页面. `ui.layout`, `ui.layoutFile` 或其他 UI 内容替换也会关闭原 Compose UI 会话, 不同时保留两套页面; 同一脚本的独立 Compose 悬浮窗不因此关闭.
- 脚本停止, Activity 销毁, 会话主动关闭或原生窗口关闭会清理相应资源. 当前 UI Activity 自行处理方向及窗口尺寸等已声明的配置变化, 常规旋转和分屏尺寸变化可保留引擎与节点. 真正的 Activity 重建或销毁会结束其 UI 引擎, 不自动恢复原 state 或会话.
- 插件更新, 卸载或禁用会关闭正在使用它的会话并报告对应错误. 重新安装或启用插件不会自动复活旧句柄, 后续应创建新的会话和节点.

每个悬浮会话持有一个属于自身的脚本保活引用. 关闭一个悬浮窗只释放该引用; 最后一个窗口关闭且没有其他保活来源时, 非 UI 脚本可自然结束. `post` 本身不提供额外保活.

<p style="font: bold 2em sans-serif; color: #FF7043">compose</p>

## [@] compose

### compose(nodeOrRender, options?)

- **nodeOrRender** { [ComposeNode](composeNodeType) | [Function](dataTypes#function) } - 根节点, 或返回一个根节点的渲染函数.
- **[ options ]** { [Object](dataTypes#object) | [null](dataTypes#null) } - 与 `mount` 相同的选项.
- <ins>**returns**</ins> { [ComposeSession](composeSessionType) }

等同于 [compose.mount](#m-mount). `$compose` 与 `compose` 是同一对象. 组件工厂和模块方法不作为省略模块名的全局函数提供.

## [p] version

**`READONLY`**

- { [Object](dataTypes#object) | [null](dataTypes#null) }

插件当前可用时返回新对象 `{plugin, contract, compose}`:

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `plugin` | `string` | 已安装插件的版本名称. |
| `contract` | `number` | 渲染器契约版本, 当前为 `1`. |
| `compose` | `string` | 渲染器声明的 Jetpack Compose 运行时版本. |

插件缺失, 禁用, 未授权或不兼容时返回 `null`. 读取会执行正常插件发现与兼容性检查, 不弹出安装/授权界面, 也不创建会话. 它不是仅凭包名判断已安装的标志.

## [p] sessions

**`READONLY`**

- { [ComposeSession](composeSessionType)[] }

当前脚本尚未关闭的会话数组快照, 包含 UI 挂载和悬浮会话. 修改数组不会创建, 移除或关闭会话. 悬浮窗对应项为 `window.session`, 不是窗口对象本身.

## [m] isAvailable

### compose.isAvailable()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

正常发现, 信任与兼容性检查是否通过. 与 `compose.version !== null` 的探测意义一致, 不自动安装或启用插件. 单次探测通过不保证后续插件状态不变, 实际挂载仍会重新检查.

## 组件工厂

### compose.Component(props?, ...children)

- **[ props ]** { [Object](dataTypes#object) | [null](dataTypes#null) } - 组件声明.
- **...children** { ...([ComposeChild](#composechild))[] } - 子节点输入.
- <ins>**returns**</ins> { [ComposeNode](composeNodeType) }

`Component` 替换为实际工厂名称:

| 分类 | 工厂 |
| --- | --- |
| 布局 | `Column`, `Row`, `Box`, `Spacer`, `LazyColumn`, `LazyRow`, `Scaffold` |
| 容器与应用栏 | `Surface`, `Card`, `HorizontalDivider`, `TopAppBar` |
| 内容 | `Text`, `Icon`, `Image` |
| 按钮 | `Button`, `ElevatedButton`, `FilledTonalButton`, `OutlinedButton`, `TextButton`, `IconButton` |
| 输入与选择 | `Switch`, `Checkbox`, `RadioButton`, `Slider`, `TextField`, `OutlinedTextField` |
| 进度与会话内对话框 | `CircularProgressIndicator`, `LinearProgressIndicator`, `AlertDialog` |

省略 props 时可直接传节点, 字符串或数组作为 children. 子节点数组可嵌套, `null`, `undefined`, `false` 被忽略, 字符串自动生成 `Text`. 数字和 `true` 不隐式转换为文字. 是否允许 children 及其数量仍由组件目录决定; `Text` 使用 `{text: 'Hello'}`, 不是 `Text('Hello')`.

创建 props 可包含组件属性, `key`, `ref`, `modifier`, 快捷属性, `children`, `slots`, 具名插槽及 `onX` 回调. `props.children` 与位置 children 不可同时提供. 参数是当前声明的快照, 后续修改原 props 对象不会自动更新节点.

props 容器本身为 `null` 或 `undefined` 时按空对象处理. 这不表示对象内任意属性值都可使用 nullish 值.

1.0.0 有 29 个节点工厂. `Snackbar` 是会话命令, 没有 `compose.Snackbar()` 节点工厂; 使用 [session.showSnackbar](composeSessionType#m-showsnackbar). 具体属性, 默认值, 输入类型, ImageWrapper 所有权及插槽要求见 [组件目录](composeComponents).

### ComposeChild

本文以 ComposeChild 表示子节点输入: [ComposeNode](composeNodeType), [string](dataTypes#string), 以上内容的递归数组, 或被忽略的 `null`, `undefined`, `false`. 其中不包含其他数字, 布尔值或任意对象. 每个父组件仍独立限制其允许的子节点数量.

## [m] createElement

### compose.createElement(type, props?, ...children)

- **type** { [string](dataTypes#string) } - 目录中的组件名称, 区分大小写.
- **[ props ]** { [Object](dataTypes#object) | [null](dataTypes#null) } - 与对应组件工厂一致.
- **...children** { ...([ComposeChild](#composechild))[] } - 同组件工厂的子节点规则.
- <ins>**returns**</ins> { [ComposeNode](composeNodeType) }

等同于调用同名工厂, 例如 `compose.createElement('Text', {text: 'Hello'})`. 未知名称报 `UNKNOWN_COMPONENT`, 将仅命令的 `Snackbar` 当作节点创建会报 `INVALID_ARGUMENT`. 此入口不表示提供 TSX/JSX 编译或 Kotlin Composable 调用能力.

## [m] modifier

### compose.modifier()

- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) } - 空的不可变 Modifier 链.

后续链式方法返回新的链, 原链保持不变. 链的顺序, 作用域与快捷属性映射见 [ComposeModifier](composeModifierType).

## [m] state

### compose.state(initialValue)

- **initialValue** { [T](dataTypes#generic) } - 初始值, 必须提供一个参数.
- <ins>**returns**</ins> { [ComposeState](composeStateType)&lt;[T](dataTypes#generic)&gt; }
- <ins>**template**</ins> { [T](dataTypes#generic) }

保存一个值, 通过 `.value` 读写. 不深拷贝或深度代理对象; 同引用对象内部字段变动不会自动通知视图. 仅在 render 内读取才建立视图依赖, 后续更改在调度时合并渲染. 详见 [ComposeState](composeStateType).

## [m] ref

### compose.ref()

- <ins>**returns**</ins> { [ComposeRef](#composeref) } - 初始 `current` 为 `null` 的引用对象.

传给节点创建选项的 `ref`, 或 `node.set({ref})`. 它不会创建节点, 也不是按 testTag 查找节点的选择器.

### ComposeRef

只有一个公开属性 `current`:

- **current** { [ComposeNode](composeNodeType) | [null](dataTypes#null) } - 只读, 指向成功帧接受后的实际节点.

调用 `mount` 返回或 state 刚赋值时, 新一帧的 ref 不一定已发布. 节点移除并被接受后清空对应引用, 会话关闭后读取为 `null`. 同一帧不能把同一个 ref 同时指向多个节点. 需要独立定位多个控件时分别创建 ref.

若不同会话共用一个 ref, `current` 会随最近接受的帧改变, 不是多个节点的集合. 关闭其他会话不会清除仍指向存活节点的引用.

```js
'ui';

let fieldRef = compose.ref();
compose.mount(function () {
    return compose.Column({},
        compose.OutlinedTextField({key: 'field', ref: fieldRef, text: ''}),
        compose.Button({key: 'focus', onClick: function () {
            if (fieldRef.current !== null) fieldRef.current.focus();
        }}, 'Focus'));
});
```

## [m] mount

### compose.mount(nodeOrRender, options?)

**`UI`**

- **nodeOrRender** { [ComposeNode](composeNodeType) | [Function](dataTypes#function) } - 一个根节点或无参数的渲染函数.
- **[ options ]** { [Object](dataTypes#object) | [null](dataTypes#null) } - 仅接受 `theme` 字段, 值为 [ComposeTheme](composeThemeType) 或 `null`.
- <ins>**returns**</ins> { [ComposeSession](composeSessionType) }

把节点树挂载到当前 UI 脚本 Activity. 非 UI 脚本调用会得到 `UI_MODE_REQUIRED`. 渲染函数必须返回一个节点, 不能返回 `null`, 节点数组或原生 View; 普通函数的 `this` 为脚本全局对象.

新页面声明验证和渲染器打开成功后, 会关闭原 Compose UI 会话并替换页面. 初始声明或打开失败时, 原页面仍可保持有效. 同一渲染函数中再次调用 `mount` 或 `floaty` 会报 `INVALID_ARGUMENT`, 保留此前有效页面.

options 容器省略或为 `null` / `undefined` 时按空对象处理. 其中 `theme` 省略或为 `null` 时沿用模块当前默认覆盖; 显式 `{theme: {}}` 表示空覆盖, 不与模块默认对象深度合并. 其他选项报 `UNKNOWN_PROP`. 主题规则见 [ComposeTheme](composeThemeType#替换与继承).

返回会话不代表所有原生布局与绘制已完成. 更新节点和 ref 的发布遵循会话提交与回执过程; 原生命令会在可执行时处理.

## [m] floaty

### compose.floaty(nodeOrRender, options?)

- **nodeOrRender** { [ComposeNode](composeNodeType) | [Function](dataTypes#function) } - 与 `mount` 相同的根节点或渲染函数.
- **[ options ]** { [Object](dataTypes#object) | [null](dataTypes#null) } - `raw`, `x`, `y`, `width`, `height`, `touchable`, `focusable`, `theme`.
- <ins>**returns**</ins> { [ComposeFloatyWindow](composeFloatyWindowType) }

在当前脚本的悬浮窗系统中创建一个独立窗口, 可从 UI 或非 UI 脚本的所属线程调用. 缺少悬浮窗权限报 `PERMISSION_REQUIRED`, 此调用不自动弹出授权页面.

每次成功调用创建独立悬浮会话, 不替换已有页面或其他悬浮窗. 渲染函数内禁止再次创建窗口. 几何单位是物理像素, 与组件布局的 dp 不同; 选项默认值, 焦点, 关闭与保活规则见 [ComposeFloatyWindow](composeFloatyWindowType).

options 容器省略或为 `null` / `undefined` 时使用默认选项, 成员值仍按各字段校验.

## [m] batch

### compose.batch(fn)

- **fn** { [Function](dataTypes#function) } - 在所属脚本线程立即执行的函数, 无参数.
- <ins>**returns**</ins> { [any](dataTypes#any) } - `fn` 的返回值.

将该函数中的节点更改作为一次事务验证与发布, 并合并响应式更新. 嵌套 batch 加入外层事务. 普通函数的 `this` 为脚本全局对象.

批处理范围是同步函数执行过程, 不等待函数返回的 Promise 完成; 后续异步任务需要各自进入所属脚本线程和事务.

参数或树验证失败, 或同步函数抛出异常时, 本次节点声明更改会回滚, 保留此前有效树. 已完成的 `state.value` 赋值, 普通 JavaScript 变量赋值及外部副作用不会被撤销. 这不是任意脚本操作的通用回滚机制.

单次节点事务最多影响一个活动会话. 同一个 batch 修改两棵属于不同会话的挂载树会得到 `INVALID_ARGUMENT`, 不先发布其中一棵. 批处理不保证只有一次屏幕绘制, 也不会同步等待原生帧完成.

下面的 `title` 和 `button` 为已经创建的节点句柄:

```js
let value = compose.batch(function () {
    title.text = 'Ready';
    button.enabled = true;
    return 42;
});
```

## [m] post

### compose.post(fn, delay?)

- **fn** { [Function](dataTypes#function) } - 投递到所属脚本线程的函数, 无参数.
- **[ delay = 0 ]** { [number](dataTypes#number) } - `0..2147483647` 的整数毫秒数.
- <ins>**returns**</ins> { [void](dataTypes#void) }

可从工作线程调用. `delay: 0` 也会排队, 执行时自动进行节点事务和响应式批处理. 普通函数的 `this` 为脚本全局对象. 无取消编号或单任务取消接口, 不提供额外脚本保活.

模块级任务随脚本引擎退出取消, 不随某一个会话关闭取消. 需要会话关闭后跳过执行的任务, 使用 [session.post](composeSessionType#m-post). 如在模块级任务中访问已经关闭会话的句柄, 仍会得到 `SESSION_CLOSED`.

非法延迟值报 `INVALID_ARGUMENT`, 投递队列满时可能报 `LIMIT_EXCEEDED`. 异步执行函数发生异常时, 错误被报告到脚本控制台, 不会回到早已返回的 `post` 调用处.

## [m] theme

### compose.theme()

**`Overload 1/2`**

- <ins>**returns**</ins> { [ComposeThemeSnapshot](composeThemeType#替换与继承) } - 当前脚本主题覆盖的普通对象副本.

首次设置前返回 `{}`. 这是脚本覆盖值的快照, 不是最终已解析的 Material 调色板或宿主全部主题值.

### compose.theme(options)

**`Overload 2/2`**

- **options** { [ComposeTheme](composeThemeType) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - 新的完整覆盖对象, `null` / `undefined` 按空覆盖处理.
- <ins>**returns**</ins> { [ComposeThemeSnapshot](composeThemeType#替换与继承) } - 归一化后的覆盖对象副本.

整体替换模块之前的覆盖选项, 为未来会话设置默认值, 并更新最后一个尚未关闭的会话. 不广播更新全部现存会话. 未指定项的回退及动态色行为见 [ComposeTheme](composeThemeType#替换与继承).

无参数调用是读取, 显式传入 `null` 或 `undefined` 则是设置一份空覆盖, 与 `compose.theme({})` 相同.

## 事件回调

节点事件可在 props 中声明 `onX`, 或使用 [node.on](composeNodeType#m-on). 普通节点回调函数的 `this` 为该节点, 箭头函数仍遵循 JavaScript 自己的词法 `this` 规则.

| 事件 | 声明属性 | 参数 | 来源 |
| --- | --- | --- | --- |
| `click` | `onClick` | 无 | 组件或点击行为. |
| `longClick` | `onLongClick` | 无 | 长按行为. |
| `focusChange` | `onFocusChange` | `focused: boolean` | 实际焦点变化. |
| `scroll` | `onScroll` | `firstVisibleIndex: number 或 null`, `offset: number` | 懒列表返回可见首项索引, 普通滚动 Modifier 返回 `null`; offset 为像素. |
| `checkedChange` | `onCheckedChange` | `checked: boolean` | Switch, Checkbox, RadioButton. |
| `valueChange` | `onValueChange` | `value: number` | Slider. |
| `valueChange` | `onValueChange` | `text: string`, `selection: {start, end}`, `editSeq: number` | TextField 和 OutlinedTextField, 选区为 UTF-16 偏移. |
| `valueChangeFinished` | `onValueChangeFinished` | 无 | Slider 结束调整. |
| `dismissRequest` | `onDismissRequest` | 无 | AlertDialog 请求关闭. |

事件在所属脚本线程执行, 节点回调内的修改自动进入节点事务和响应式批处理. 连续输入和滚动通知可合并, 不保证每个原生中间状态都产生一个回调.

Switch / Checkbox / RadioButton / Slider 的变化是交互提议, 需要回调更新属性或 state 才会成为新的受控值. 输入框则在调用 `onValueChange` 前同步此次原生文字, 选区与编辑序列; 显式编辑的仲裁规则见 [node.edit](composeNodeType#m-edit).

会话关闭事件只用 `session.on('close', fn)`. Snackbar 的操作/消失结果只用 `showSnackbar` 的 `onAction` / `onDismiss` 选项. 没有公开的 `session.on('error')` 或通用 DOM Event 对象, 回调返回值也不用于阻止原生事件.

## 错误与异常

同步参数检查和挂载失败可用 `try/catch` 捕获. 异步重绘, 原生命令或 `post` 执行失败会报告到所属脚本控制台; 不能在调用已经返回后, 再由其外部同步 `try/catch` 捕获.

普通渲染异常保留上一次有效界面, 状态修正后可再次渲染. 插件失效或不可恢复的渲染器故障会关闭对应会话. 用户自己抛出的脚本异常及其调用栈按来源保留, 不保证任意 `throw` 都会变成 ComposeError.

## [C] ComposeError

### new ComposeError(message?, code?, nodeId?, prop?, cause?)

- **[ message = '' ]** { [string](dataTypes#string) } - 错误说明.
- **[ code = 'INVALID_ARGUMENT' ]** { [string](dataTypes#string) } - 稳定错误码.
- **[ nodeId = null ]** { [number](dataTypes#number) | [null](dataTypes#null) } - 相关节点标识.
- **[ prop = null ]** { [string](dataTypes#string) | [null](dataTypes#null) } - 相关属性或参数.
- **[ cause = null ]** { [any](dataTypes#any) } - 原因异常.
- <ins>**returns**</ins> { [ComposeError](#c-composeerror) }

全局 `ComposeError` 与 `compose.ComposeError` 指向同一个构造函数, 继承 `Error`. 直接调用而不写 `new` 也会创建实例. 系统产生的错误包含 `code`, `message`, `nodeId`, `prop`, `cause`, `stack` 和 `retryable`.

`message` 按宿主语言本地化, `code` 保持稳定. 未关联节点或属性时相应字段为 `null`. `retryable` 仅对下表前四种插件状态错误为 `true`, 表示修正外部状态后可尝试新的操作, 不表示自动重试或恢复旧会话.

| 错误码 | 含义 |
| --- | --- |
| `PLUGIN_UNAVAILABLE` | 插件缺失, 已卸载或在会话存活期间被更新而失效. |
| `PLUGIN_DISABLED` | 插件被系统或当前应用的启用记录禁用. |
| `PLUGIN_UNAUTHORIZED` | 插件未通过当前应用的信任/授权检查. |
| `PLUGIN_INCOMPATIBLE` | 宿主版本, 插件契约, 声明能力或共享依赖不兼容. |
| `UI_MODE_REQUIRED` | 当前没有可用的 UI 脚本 Activity, 不能执行页面挂载. |
| `PERMISSION_REQUIRED` | 缺少所需权限, 例如悬浮窗权限. |
| `INVALID_ARGUMENT` | 参数类型, 范围, 枚举, 树关系, 命令条件或调用线程不合法. |
| `UNKNOWN_COMPONENT` | 未声明的组件名称. |
| `UNKNOWN_PROP` | 未声明的属性, 事件, 插槽或选项. |
| `INVALID_MODIFIER` | 无效 Modifier 或修饰链. |
| `SCOPE_MISMATCH` | Modifier 出现在错误的父布局作用域. |
| `DUPLICATE_KEY` | 同级稳定 key 冲突. |
| `LIMIT_EXCEEDED` | 节点, 深度, 回调, 队列或其他契约上限超出. |
| `RENDER_FAILED` | 渲染声明或脚本侧 Compose 操作失败. |
| `SESSION_CLOSED` | 所属会话或脚本运行时已经关闭. |
| `NODE_DETACHED` | 节点不在可执行命令的挂载树中, 或归属其他图/会话. |
| `RENDERER_FAILED` | 原生渲染器或窗口承载发生不可恢复故障. |
| `INTERNAL` | 内部状态或契约不变量失败. |

## 输入与资源上限

输入类型按 [组件目录](composeComponents#输入类型) 严格校验. 不把任意字符串转为数字或布尔值; dp / sp 字符串必须使用对应单位. `null` 仅在具体属性允许时合法, 不应把省略, `undefined` 和 `null` 普遍视为等价.

| 项目 | 上限 |
| --- | --- |
| 单会话节点数 | 5000, 包括具名插槽内节点. |
| 树深度 | 64. |
| 单次补丁批 | 2000 个操作. |
| 单个字符串 | 65536 个 UTF-16 代码单元, 不按 UTF-8 字节数计算. |
| 普通节点直接子节点 | 2000. |
| 懒列表直接条目 | 10000, 同时仍受单会话 5000 节点上限限制. |
| 单条 Modifier 链 | 64 个操作. |
| 单会话回调预算 | 4096, 包括节点, 会话和待处理通知所持有的回调. |
| 单引擎活动会话 | 8. |
| 单张位图 | 32000000 像素. |
| 原生事件队列 | 1024. |
| 单个属性对象 | 128 项. |

ImageWrapper 和位图的所有权规则见 [Image 输入](composeComponents#composeimageinput). 图片引用需要覆盖原生使用期, 不应仅因 `remove` / `close` 返回或关闭事件就立即 recycle. 无法确认原生释放已经完成时, 图片不再使用后可放弃脚本强引用并交给正常回收机制. 当前没有等待原生释放完成的公开接口.

## 无障碍与选择器

### 运行条件

- 安装并启用 Compose UI 插件, 使用包含 `compose` 模块的配套宿主构建. 当前为本地预览能力.
- 界面已挂载, 待查找的节点位于当前可访问窗口并已参与布局.
- 查找与点击依赖宿主无障碍服务. 界面渲染本身不要求启用无障碍.
- 操作 AutoJs6 自身的脚本页面时, 关闭设置中的 "保护模式". 该模式会让选择器跳过宿主包名, 包括宿主承载的 Compose 页面.
- 本节节点层级按默认关闭 "稳定模式" 的内置服务说明. 不同服务或节点过滤设置可能隐藏部分子节点, 优先通过按钮自身的标签定位动作目标.
- 阻塞式选择器等待应在非 UI 脚本或工作线程中运行, 避免阻塞页面线程.

### testTag 与 ID

组件的 `testTag` 快捷属性和 `compose.modifier().testTag(tag)` 都设置 Compose 语义标签. 渲染器已在根节点启用 `testTagsAsResourceId`, 因而 Android 无障碍节点的 `viewIdResourceName` 就是原样标签字符串.

例如 `testTag: 'start_button'` 暴露为 `start_button`, 不会自动变成 `org.autojs.autojs6:id/start_button`. 节点的 `packageName` 仍是承载页面的宿主包名.

对该标签的匹配规则如下:

| 选择器或读取方式 | 结果 |
| --- | --- |
| `id('start_button').findOnce()` | 找到带该标签的节点. |
| `idContains('start_').findOnce()` | 匹配原样 ID 中的子串. |
| `idMatches('start_button').findOnce()` | 匹配整个原样 ID. |
| `idMatches(/^start_button$/).findOnce()` | 使用正则表达式匹配整个原样 ID. |
| `idMatches('start').findOnce()` | 不匹配, 该表达式未覆盖整个 ID. |
| `id('org.autojs.autojs6:id/start_button').findOnce()` | 不匹配, 标签没有这个包名前缀. |
| `node.id()` | 返回 `start_button`. |

宿主 `id(string)` 对传统 View 资源 ID 仍支持只写 `:id/` 后的条目名. 原样 Compose 标签不含 `:id/` 时, 整个标签作为条目名匹配. `idContains` 与 `idMatches` 始终比较节点暴露的完整 ID 字符串.

为自动化目标设置稳定且在页面内唯一的标签, 并将标签直接设在需要执行动作的组件上. `testTag` 不改变 Compose 节点句柄的 `nodeId`, 也不创建 Android `R.id` 资源.

### text 与 contentDescription

独立 `Text` 节点的文本可由 `text('文字')` 查找. `contentDescription` 快捷属性或 `.semantics('说明')` 设置的描述可由 `desc('说明')` 查找.

`Button` 会合并后代语义, 但宿主无障碍选择器看到的树与 Compose 测试框架默认使用的合并树不同. 当前 Compose 1.12.1 会保留按钮中的文本子节点, 并可能为按钮描述和角色增加语义子节点. 因此:

- `id('start_button')` 可直接定位拥有点击动作的按钮节点.
- `text('启动')` 找到按钮内的文本节点时, 该节点本身可能不可点击. 需要找到其可点击祖先, 或改用按钮自身的标签.
- 当按钮同时包含子节点并设置 `contentDescription` 时, `desc()` 可找到独立描述节点. 该节点可能没有 ID 和点击动作, 它的父节点才是按钮.
- 不要假定 `id('start_button').text('启动')` 能同时成立, 也不要假定按钮标签所在节点的类名一定是 `android.widget.Button`.
- 宿主 [UiObject](uiObjectType) 的 `parent()` 和 `child()` 遍历的是无障碍树, 与 Compose 脚本节点句柄的 `parent` 和 `children` 不保证一一对应.

这遵循 Compose 的 [语义树规则](https://developer.android.com/develop/ui/compose/accessibility/semantics) 与 [无障碍测试互操作规则](https://developer.android.com/develop/ui/compose/testing/interoperability). 自动化优先使用动作组件自己的 `testTag`, 减少对子节点结构的依赖.

在 API 24 x86 与 API 35 x86_64 模拟器上, 内置无障碍服务已验证以下包含一个 `Text` 和按钮描述的结构:

| 节点 | `id()` | `text()` | `desc()` | `clickable()` |
| --- | --- | --- | --- | --- |
| Button 自身 | `start_button` | `''` | `null` | `true` |
| 按钮内 Text | `start_label` | `'Compose start'` | `null` | `false` |
| 按钮描述子节点 | `null` | `''` | `'Run Compose action'` | `false` |

这两个子节点的 `parent().id()` 都是 `start_button`. 此按钮在 Android 无障碍中还有一个角色子节点, 自身 `className()` 为 `android.view.View`; 因而通过按钮自身标签查找点击目标更稳定.

上述验证于 2026-10-03 使用配套本地宿主, Compose UI 插件和 Compose 1.12.1 完成. 查找与点击均经过真实内置无障碍服务以及宿主 Rhino 选择器, 包括 `id('start_button').findOnce().click()` 到脚本 `onClick` 回调的完整路径.

### 示例

先运行下面的 UI 脚本, 保持页面显示:

```js
'ui';

let clicks = compose.state(0);
compose.mount(function () {
    return compose.Column({padding: 16},
        compose.Text({text: '点击次数: ' + clicks.value}),
        compose.Button({
            testTag: 'start_button',
            contentDescription: '开始自动化',
            onClick: function () { clicks.value++; },
        }, compose.Text({testTag: 'start_label', text: '启动'})));
});
```

页面显示且无障碍服务已启用后, 在另一个非 UI 脚本中运行:

```js
let button = id('start_button').findOnce();
if (button !== null) {
    console.log(button.id()); // start_button.
    console.log(button.click()); // 动作接受时为 true.
}
```

点击返回 `true` 表示无障碍动作被接受. Compose 事件随后异步回到界面所属脚本线程; 如需确认业务完成, 应另外观察状态变化.

仅知道按钮文字时, 可向上查找可点击节点:

```js
let node = text('启动').findOnce();
while (node !== null && !node.clickable()) {
    node = node.parent();
}
if (node !== null) {
    node.click();
}
```

### 已知边界

- `LazyColumn` 与 `LazyRow` 只为已组合的可见区域及预取区域提供节点. 查找未出现的项之前, 应先滚动使其进入界面.
- 查找会话已经关闭或已经移除的节点不会返回仍有效的控件. 保存的无障碍节点也可能失效, 页面变化后应重新查找.
- 同名标签可能匹配多个节点. `findOnce()` 返回选择器当前遍历顺序下的第一个匹配项, 不表示标签具有全局唯一性.
- 本节的内置无障碍验收不代表已验证所有第三方无障碍服务, 也不等同于 TalkBack 完整可用性评估.

## 打包应用

### 运行时与插件依赖

使用 `compose` 的脚本可通过 AutoJs6 的 "打包应用" 流程生成独立 APK. APK Builder 插件将配套 Runtime Kit 中的 INRT 运行时与项目脚本装入应用, Compose UI 渲染器仍由目标设备上另行安装的 Compose UI 插件提供.

- 构建端需要包含 `compose` 模块的配套宿主和 APK Builder 插件, 其 Runtime Kit 也必须包含该模块及配套共享依赖.
- 运行端需要安装兼容的 Compose UI 插件, 包名为 `io.github.supermonster003.autojs6.plugin.compose.ui`. 打包不会自动把该插件 APK 嵌入应用, 应用启动也不会自动安装或授权插件.
- 使用 `compose.mount` 的项目入口脚本应保留 `'ui';` 模式声明. `compose.floaty` 仍须满足生成应用自身的悬浮窗授权与系统运行条件.
- Compose 渲染本身不依赖无障碍服务. 如果脚本同时使用无障碍选择器或动作, 则仍需满足这些 API 的授权条件.

当前属于配套本地构建的预览能力, 不能仅根据 APK Builder 的产品名称或版本名称判断其模板已经包含 Compose UI 支持.

### 应用版本与运行时版本

应用自己的版本和内嵌运行时的版本分别承担不同作用:

| 版本 | 来源 | 用途 |
| --- | --- | --- |
| 应用 `versionCode` / `versionName` | 项目的打包配置 | 应用自身的安装与升级. `versionCode` 可以从 `1` 开始. |
| INRT 运行时版本 | 配套 Runtime Kit 的宿主构建 | 校验 Compose UI 插件要求的最低宿主版本. |
| Compose UI 插件版本 | 目标设备上安装的插件 | 提供实际渲染器, 并与运行时校验契约和共享依赖兼容性. |

最低宿主版本检查使用 INRT 模板中的编译版本, 不使用生成应用的 `versionCode`. 因而不需要把自己的应用版本改成 AutoJs6 的构建号. 如果模板过旧, 应更新配套 Runtime Kit 并重新打包; 单独提高应用 `versionCode` 不会更新运行时.

同理, 更新设备上的 AutoJs6 主应用或构建端宿主, 不会改写已经生成的 APK 内部运行时. 新的运行时能力需要随重新打包后的应用版本交付.

### 启用状态与授权

生成应用使用自己的插件启用与授权记录. AutoJs6 主应用中保存的启用选择和用户授权不会自动复制到生成应用.

Compose UI 插件沿用既有的签名信任策略. 未保存启用选择时默认启用, 仍须通过签名信任检查; 显式禁用或系统停用会阻止装载. 应用自己的签名不会代替对插件签名的校验, 也不应通过修改权限声明或跳过检查来绕过授权失败.

### 缺失插件与错误处理

`compose.isAvailable()` 可用于探测当前是否可用, 但 `false` 本身不能区分缺失, 禁用, 未授权或不兼容. 需要获知原因时, 可捕获挂载时的类型化错误:

| `error.code` | 含义 |
| --- | --- |
| `PLUGIN_UNAVAILABLE` | 未找到可用插件, 包括目标设备未安装 Compose UI 插件. |
| `PLUGIN_DISABLED` | 插件被系统停用, 或在当前应用的启用记录中关闭. |
| `PLUGIN_UNAUTHORIZED` | 插件签名未通过当前应用的信任与授权检查. |
| `PLUGIN_INCOMPATIBLE` | 内嵌运行时版本, 插件契约或共享依赖不兼容. |

未安装插件时, 错误的 `message` 是包含插件包名的本地化说明. 应用可用已有的 XML 界面显示这一信息, 例如:

```js
'ui';

try {
    compose.mount(compose.Text({text: 'Compose UI 已就绪'}));
} catch (error) {
    if (error.code !== 'PLUGIN_UNAVAILABLE') {
        throw error;
    }
    ui.layout('<vertical padding="16"><text id="composeFailure" /></vertical>');
    ui.composeFailure.setText(error.code + '\n' + String(error.message));
}
```

上例仅处理挂载时插件不可用的情况, 其他错误继续交给脚本原有的错误处理. 安装兼容插件后重新启动应用, 可重新进行装载与兼容性检查.

### 验证范围

已使用配套本地 Runtime Kit 和独立 APK Builder 插件生成 x86_64 应用, 并在 API 37.1 / 16 KB 页模拟器上实际安装运行. 应用使用默认签名和 `versionCode: 1`, UI 脚本仍按模板内的运行时版本完成插件兼容性检查.

安装兼容 Compose UI 插件时, 同一应用可挂载计数器页面并通过按钮更新状态. 真实卸载插件后, 同一应用可在自己的 XML 界面显示 `PLUGIN_UNAVAILABLE` 及包含插件包名的本地化说明. 验收范围为 Rhino UI 入口, 默认应用签名及插件存在/缺失两种条件.

同一产物在上述两种条件下均已完成连续启动验证.
