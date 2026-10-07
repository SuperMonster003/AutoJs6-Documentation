# Compose 节点 (ComposeNode)

ComposeNode 是 [组件工厂](compose#组件工厂) 或 [compose.createElement](compose#m-createelement) 返回的脚本句柄, 不能直接用 `new` 创建. 节点可以先创建和组装, 再交给 `compose.mount`, `compose.attach`, `compose.floaty` 或 `compose.dialog` 挂载. 它不是 Android View, 不具有 View 的任意方法或 XML 属性.

所有业务属性读取, 修改, 树操作和命令应在所属脚本线程调用. 工作线程使用 [compose.post](compose#m-post) 或所属会话的 `post`. 节点不能跨脚本引擎传递; 第一次挂载后保留会话归属, 即使从树中移除也不能转交另一个会话.

<p style="font: bold 2em sans-serif; color: #FF7043">ComposeNode</p>

## [p#] type

**`READONLY`**

- { [string](dataTypes#string) }

组件名, 例如 `'Text'` 或 `'Button'`. 创建后不可更改.

## [p#] key

**`READONLY`**

- { [string](dataTypes#string) | [null](dataTypes#null) }

创建时的稳定键. 字符串保留原值, 有限数字转换为字符串, 未提供时为 `null`. 键的相等性影响响应式树复用; 同一父节点的普通 children 列表中, 非 `null` 的键必须唯一. 空字符串仍是一个键, 数字 `1` 和字符串 `'1'` 会成为相同的键. 具名插槽按插槽名协调, 不参与此列表的 key 冲突检查.

## [p#] nodeId

**`READONLY`**

- { [number](dataTypes#number) }

节点在当前挂载树中的标识. 挂载前, 从树中移除后或所属会话关闭后为 `-1`. 节点回到同一个会话时可保留其内部身份, 但 `nodeId` 不是持久化业务键, 也不是 Android 资源 ID.

## [p#] parent

**`READONLY`**

- { [ComposeNode](composeNodeType) | [null](dataTypes#null) }

脚本节点树中的父节点. 根节点和当前未归属任何父节点的节点为 `null`. 插槽中的节点也具有 `parent`; 此关系不等同于 [无障碍节点树](compose#无障碍与选择器) 的父子关系.

## [p#] children

**`READONLY`**

- { [ComposeNode](composeNodeType)[] }

普通子节点的数组快照, 不包含具名插槽. 修改返回数组不会改变节点树, 应调用 `append`, `insert`, `remove`, `replace` 或 `clear`.

## 组件属性

组件在 [目录](composeComponents) 中声明的属性及其别名, 以及 [快捷属性](composeModifierType#快捷属性) 和 `modifier`, 都可通过节点属性访问或 `get` / `set` 读写:

```js
let title = compose.Text({text: 'Ready', color: '#202020'});
title.text = 'Running';
title.set({fontSize: 18, alpha: 0.8});
console.log(title.get('text'));
```

只有该组件实际声明的属性可用. 例如 `Text` 没有 `checked`, 未知属性赋值会报 `UNKNOWN_PROP`. 属性名和枚举区分大小写, 值按目录校验, 不把 `'false'` 自动转换为布尔值, 也不把数字自动转换为 `text`.

返回的属性值是归一化脚本值: dp / sp 是数值, 颜色是 ARGB 整数, 数组和结构值是普通脚本对象. 有目录默认值时返回默认值, 否则未指定的属性返回 `undefined`. `modifier` 只返回显式设置的链, 不会把快捷属性合成为新链.

`Image.src` 读取为底层 Android Bitmap 引用, 不返回最初的文件路径或新建 ImageWrapper. 调用方图片的有效期应覆盖所有原生使用, 参阅 [组件图像输入](composeComponents#composeimageinput) 与 [关闭清理边界](composeSessionType#m-close).

F2 [AndroidView](composeComponents#androidview) 的 `view` 读取为准备后的实际 Android View, 即使创建时传入的是工厂也不返回该函数. 可用 `node.set({view: anotherView})` 或直接赋值更新, 输入仍须符合 [ComposeViewInput](composeComponents#composeviewinput). 节点句柄与被借用的 View 是不同对象; 不将 ComposeNode 传给 `ui.setContentView`, `addView` 或 AndroidView 的 `view` 属性.

事件属性, `ref` 和具名插槽通过创建选项或 `set` 设置; 它们没有普通属性访问器. 例如使用 `node.set({onClick: fn})` 或 `node.on('click', fn)`, 不使用 `node.onClick = fn`.

## [m#] set

### node.set(props)

- **props** { [Object](dataTypes#object) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - 要更新的属性, 事件, 插槽或 ref.
- <ins>**returns**</ins> { [ComposeNode](composeNodeType) } - 当前节点.

合并给出的字段, 未提供字段保留原值. 支持组件属性, 快捷属性, `modifier`, `ref`, `slots`, 目录中的具名插槽和 `onX` 事件回调. 一个对象中同时提供同一属性的不同别名会被拒绝.

必须传入一个参数; 容器本身为 `null` 或 `undefined` 时是空更新, 不清空已有属性.

`modifier: null` 清除显式链; `ref: null` 解除此节点的 ref 声明; `onClick: null` 等事件字段清空对应监听列表. 普通属性只有目录允许时才接受 `null`, 不使用 `null` 或 `undefined` 作为通用的恢复默认值命令.

`key`, `type`, `nodeId`, `parent` 和 `children` 不可通过 `set` 修改. 子节点操作使用树方法. 失败的节点更改会回滚, 详见 [批处理](compose#m-batch).

## [m#] get

### node.get(name)

- **name** { [string](dataTypes#string) } - 组件属性, 属性别名, 快捷属性或 `'modifier'`.
- <ins>**returns**</ins> { [any](dataTypes#any) } - 归一化属性值或 `undefined`.

与同名业务属性访问器一致. `type`, `key`, `nodeId`, `parent`, `children` 应通过直接属性读取; `get` 不用于读取事件函数, 插槽或 ref. 不支持的名称报 `UNKNOWN_PROP`.

## 子节点输入

树方法接受一个节点, 一个字符串或以上内容的嵌套数组. 字符串自动成为 `Text` 节点; `null`, `undefined` 和 `false` 被忽略. 数字和 `true` 不会自动成为文字, 应显式使用 `String(value)`.

是否允许子节点及其数量由父组件决定. 例如 `Text` 不接受子节点, 因此创建文本应使用 `compose.Text({text: 'Hello'})`, 不能用 `compose.Text('Hello')` 替代.

同一个节点不能在一棵树中同时出现两次. 同一会话内移动节点会从原父节点或插槽移除它; 循环引用, 重复句柄或跨会话移动会被拒绝.

## [m#] append

### node.append(child)

- **child** { [ComposeChild](compose#composechild) } - 按上述规则展开的内容, 必须提供一个参数.
- <ins>**returns**</ins> { [ComposeNode](composeNodeType) } - 当前父节点.

追加到普通子节点末尾. 已在该父节点中的句柄会移动到新位置, 不复制节点.

## [m#] insert

### node.insert(index, child)

- **index** { [number](dataTypes#number) } - 整数插入位置, `0..node.children.length`.
- **child** { [ComposeChild](compose#composechild) } - 要插入的内容.
- <ins>**returns**</ins> { [ComposeNode](composeNodeType) } - 当前父节点.

在指定位置插入. 传入数组时按展开顺序插入. 移动已有子节点时会相应调整其原位置, 不产生重复项.

## [m#] remove

### node.remove(childOrIndex)

- **childOrIndex** { [ComposeNode](composeNodeType) | [number](dataTypes#number) } - 当前普通子节点句柄或非负整数索引.
- <ins>**returns**</ins> { [ComposeNode](composeNodeType) } - 当前父节点.

只移除一个直接普通子节点, 不按字符串 key 查找, 也不递归寻找后代. 合法类型但未找到对应子节点时会报 `NODE_DETACHED`. 具名插槽应使用 `slot(name, null)` 清空.

移除不等同于永久销毁句柄. 所属会话仍存活时, 可继续修改声明并插回同一会话; 已移除节点的 `focus`, `blur`, `scrollTo` 等原生命令会报 `NODE_DETACHED`.

## [m#] replace

### node.replace(children)

- **children** { [ComposeChild](compose#composechild) } - 新的普通子节点内容, 必须提供一个参数.
- <ins>**returns**</ins> { [ComposeNode](composeNodeType) } - 当前父节点.

整体替换普通子节点列表. `null` 或空数组清空该列表, 具名插槽保持不变.

## [m#] clear

### node.clear()

- <ins>**returns**</ins> { [ComposeNode](composeNodeType) } - 当前父节点.

等同于 `node.replace([])`, 只清空普通子节点.

## [m#] slot

### node.slot(name, child)

- **name** { [string](dataTypes#string) } - 该组件目录声明的插槽名称.
- **child** { [ComposeChild](compose#composechild) } - 插槽内容, 展开后至多一个节点.
- <ins>**returns**</ins> { [ComposeNode](composeNodeType) } - 当前节点.

设置或替换一个插槽. `null`, `undefined`, `false` 或空数组可清空可选插槽, 必需插槽仍受目录校验. 多个组件应先包在一个 `Row`, `Column` 或 `Box` 中, 再作为插槽节点传入.

`node.set({slots: {title: titleNode}})` 和 `node.set({title: titleNode})` 也可设置目录中名为 `title` 的插槽. `slots` 对象按给出的插槽合并, 不自动清空未提及的插槽.

## [m#] on

### node.on(event, fn)

- **event** { [string](dataTypes#string) } - 该组件支持的事件名称, 例如 `'click'`, `'valueChange'`.
- **fn** { [Function](dataTypes#function) } - 事件回调.
- <ins>**returns**</ins> { [ComposeNode](composeNodeType) } - 当前节点.

追加监听函数, 普通函数的 `this` 是当前节点. 事件参数见 [事件回调](compose#事件回调). 对应的 `onClick`, `onValueChange` 等名称也可作为事件别名, 但不接受旧 View 风格的下划线名称.

重复注册同一函数会追加多次, 不自动去重. `node.set({onClick: fn})` 则替换该事件的监听列表. 监听按注册顺序处理, 若较早的监听关闭会话或停止脚本, 后面的监听不再执行.

原生事件通过队列回到所属脚本线程, 不在 Compose 的组合或布局调用栈中同步执行 JavaScript. 回调的返回值不用于阻止原生事件或提交控件状态.

## [m#] off

### node.off(event, fn?)

- **event** { [string](dataTypes#string) } - 已支持的事件名称或对应 `onX` 别名.
- **[ fn ]** { [Function](dataTypes#function) | [null](dataTypes#null) } - 要移除的函数引用.
- <ins>**returns**</ins> { [ComposeNode](composeNodeType) } - 当前节点.

给出函数时移除所有相同函数引用的注册. 省略, `null` 或 `undefined` 时移除该事件的全部用户监听. 输入框自身的内部文本同步不会因此停止.

## [m#] focus

### node.focus()

- <ins>**returns**</ins> { [ComposeNode](composeNodeType) } - 当前节点.

向已挂载且支持焦点命令的组件请求焦点. 按钮, 选择控件, 滑块, 输入框和带 `clickable` Modifier 的节点支持此命令. 其他类型会报 `INVALID_ARGUMENT`; 未挂载会报 `NODE_DETACHED`.

V2 追加支持 NavigationBarItem, NavigationRailItem, NavigationDrawerItem, Tab, DropdownMenuItem, AssistChip, FilterChip, InputChip, SegmentedButtonItem, FloatingActionButton 和 SearchBar, 具体可用命令也列在 [组件目录](composeComponents#v2-目录生成表) 中.

命令异步到达原生视图, 返回值不代表已经获得焦点或显示输入法. 悬浮输入框还需要 [窗口允许焦点](composeFloatyWindowType#m-requestfocus).

## [m#] blur

### node.blur()

- <ins>**returns**</ins> { [ComposeNode](composeNodeType) } - 当前节点.

清除该已挂载组件的焦点, 支持范围与 `focus()` 相同.

## [m#] scrollTo

### node.scrollTo(index)

**`Overload 1/2`**

- **index** { [number](dataTypes#number) } - 非负整数条目或页面索引.
- <ins>**returns**</ins> { [ComposeNode](composeNodeType) } - 当前节点.

适用于 `LazyColumn`, `LazyRow` 及 V2 的 `LazyVerticalGrid`, `HorizontalPager`. 网格索引指子项而非行号, 分页索引指页面, 均须小于当前子项数量.

### node.scrollTo(target)

**`Overload 2/2`**

- **target** {{ index?: [number](dataTypes#number); offset?: [number](dataTypes#number) }} - 至少提供一个字段.
- <ins>**returns**</ins> { [ComposeNode](composeNodeType) } - 当前节点.

有 `index` 时选择懒加载条目或页面, 可同时给出正负整数 `offset` 作为该条目或页面的物理像素偏移. 没有 `index` 时, `offset` 是非负整数的绝对滚动像素位置: 普通滚动 Modifier 直接设置该位置, 懒列表和网格从第 0 项, 分页从第 0 页加该偏移请求定位. 数值均须在对应的 32 位整数范围内.

`scrollTo(100)` 表示条目或页面索引, 不表示普通滚动容器的 100 px; 普通容器应写 `scrollTo({offset: 100})`. 只有上述列表, 网格, 分页和实际带滚动 Modifier 的节点支持滚动命令.

HorizontalPager 的 offset 根据实际页面尺寸与间距转换为定位请求, 不接受页面比例. 原生手势或此命令会移动页面并报告 pageChange, 不自动改写节点的 page 属性; 无关属性更新保留原生页面位置.

普通节点同链含多个滚动操作时, offset 命令作用于第一个, 即最外层滚动操作. 该命令不提供两个方向的独立坐标参数.

## [m#] edit

### node.edit(change)

- **change** {{ text?: [string](dataTypes#string); selection?: [Array](dataTypes#array) | [Object](dataTypes#object) }} - 至少给出 `text` 或 `selection`.
- <ins>**returns**</ins> { [ComposeNode](composeNodeType) } - 当前输入框节点.

仅用于 `TextField` 和 `OutlinedTextField`. `selection` 接受 `[start, end]` 或 `{start, end}`, 两端必须为当前目标文本范围内的非负整数, 以 UTF-16 代码单元计数, 允许反向选区.

仅改变文字而未给选区时, 新文字与旧文字不同会把光标移到末尾; 文字不变或省略时保留现有选区. 未挂载输入框的编辑作为初始或待挂载编辑保存; 已挂载输入框通过原生命令应用.

原生输入发生后, 宿主在 `onValueChange(text, selection, editSeq)` 回调之前更新句柄中的文字和编辑序列. `node.text` / `node.value` 读取这一已同步的编辑状态. 给它们赋值与 `set({text: ...})` 都走显式编辑路径, 不直接覆盖原生缓冲区.

每次编辑自动携带脚本已观察到的序列. 若原生编辑在命令到达前发生了更新, 迟到编辑会被拒绝并报告 `INVALID_ARGUMENT` (`prop: 'editSeq'`), 保留较新的输入. 不需要也不允许在 `edit` 参数中自行设置 `editSeq` 或输入法组合区间.

下面的 `field` 为已经创建的 TextField 或 OutlinedTextField 句柄:

```js
field.edit({text: 'Hello', selection: [0, 5]});
field.edit({selection: {start: 5, end: 5}});
```

受控声明在相同 key 的重绘中可复用编辑器, 保留原生输入和选区; 从实际树中移除再插入会开始新的原生编辑生命周期, 不应依靠保存句柄恢复之前的输入法组合状态.

## [m#] toString

### node.toString()

- <ins>**returns**</ins> { [string](dataTypes#string) } - 例如 `ComposeNode(type=Text, nodeId=1)`.

用于诊断节点类型和当前公开标识. 所属会话关闭后仍可读取这类结构信息, 但组件属性访问和树/原生命令会报 `SESSION_CLOSED`. 结构 getter 没有清空承诺, 不应用它们判断业务操作仍然可用.
