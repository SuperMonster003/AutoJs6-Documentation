# Compose 组件 (Components)

本页列出 3-Block Compose V1 的 29 个节点组件和仅命令形式的 Snackbar, V2 追加的 25 个节点组件, 以及单独协商的 F2 [AndroidView](#androidview) 扩展. 使用方式为 `compose.Text({ text: '内容' })`, `compose.Column(props, ...children)` 等, 返回 [ComposeNode](composeNodeType), 然后交给 [compose.mount](compose#m-mount), [compose.attach](compose#m-attach), [compose.floaty](compose#m-floaty) 或 [compose.dialog](compose#m-dialog).

需要提供 `compose` 模块的配套 AutoJs6 6.8.0 本地构建, 以及已安装, 启用且兼容的 3-Block Compose 插件. 配套 `.tsx` 入口可以使用这些工厂, 具体版本要求与标签规则见 [TSX 接入](compose#tsx-接入). 工厂不接受任意 Kotlin Composable 函数. 原生 Android View 仅通过 AndroidView 的 `view` 属性接入; `compose.Snackbar` 不是节点工厂.

## 输入类型

属性使用严格转换, 不依赖一般 JavaScript 真值或自动数字字符串转换. `checked: 'true'`, `value: '0.5'`, 未知属性或无效枚举都会被拒绝. 属性的名称和枚举值大小写敏感; 图标名称另有大小写兼容规则.

目录生成表中的 Compose*Input 是 TypeScript 输入辅助类型, 对应以下实际形态. 单个属性是否允许 null 由该属性决定, 不表示所有同类输入都接受 null.

### ComposeColorInput

支持 [ColorInt](dataTypes#colorint), [ColorHex](dataTypes#colorhex), [ColorName](dataTypes#colorname), [Color](colorType) 或宿主 [ThemeColor](dataTypes#themecolor), 按 [colors.toInt](color#m-toint) 转成 ARGB 整数. 不接受任意 `{ r, g, b }` 对象或颜色分量数组. 部分组件颜色属性接受 null 以使用默认颜色, `background` / `border` 修饰操作的颜色不接受 null.

### ComposeNativeView

实际的 [android.view.View](https://developer.android.com/reference/android/view/View), 包括 `ui.inflate` 结果和宿主 ID 查找返回的 NativeView 包装对象. 普通 JavaScript 对象, 字符串, 数字, Promise, XML TSX 值和 ComposeNode 都不是原生 View.

编辑器没有加载原生声明组时, 此类型保留为对象形态, 仍排除原始值, 函数和 Promise; 任意对象是否为真实 View 由运行时检查. 完整原生成员补全需要原有 Android 等可选声明组, F2 不改变这些组的默认启用状态.

### ComposeViewFactory

同步函数 `(context) => view`. `context` 是 [Android Context](https://developer.android.com/reference/android/content/Context): UI 脚本使用当前 Activity, 非 UI 脚本使用带脚本主题的 Context 包装. 返回值必须是 [ComposeNativeView](#composenativeview), 不接受 Promise 或无返回值. 不把函数的 `this` 当作 ComposeNode.

宿主在准备 `AndroidView` 创建或显式 `set({view: factory})` 时, 在 Android 主线程调用一次工厂. 它不在 Compose 重组期间反复调用. 响应式 render 再次执行到该声明时仍会重新准备, 因此需要复用原生 View 时应在 render 外保存实际 View. 工厂应只完成简短的原生创建和初始化, 不执行阻塞任务, 不创建 mount, attach, floaty 或 dialog 会话.

### ComposeViewInput

[ComposeNativeView](#composenativeview) 或 [ComposeViewFactory](#composeviewfactory). 仅用于 AndroidView 的必填 `view` 属性. Getter 返回准备后的实际 View, 不返回工厂, Promise 或内部身份值.

### ComposeDpInput

有限数值或带 `dp` 后缀的数值字符串, 如 `16`, `'16dp'`, `'0.5dp'`. `w`, `h`, padding, spacing, 圆角和边框等以 dp 解释. 一般尺寸/留白非负; `offset(x, y)` 允许负值. 不接受 px, 百分比, `'*'`, `'auto'` 或 XML 布局尺寸关键字.

### ComposeSpInput

有限数值或带 `sp` 后缀的数值字符串, 如 `18`, `'18sp'`. 用于字体大小, 行高和字距. 字体大小及显式行高须大于 0; 字距可为负数. `sp` 与 `dp` 后缀不能混用.

### ComposeShapeInput

可用字符串 `'rectangle'`, `'rounded'`, `'circle'`, 或对象 `{ shape: 'rounded', radius: 12 }`. `radius` 为非负 dp, 省略为 0. 非 rounded 形状的 radius 必须为 0. 不接受 CSS border-radius 字符串或任意 Path.

```js
let rounded = { shape: 'rounded', radius: '12dp' };
let card = compose.Card({ shape: rounded }, compose.Text({ text: '圆角卡片' }));
```

### ComposeTextStyleInput

组件的 `style` 属性可使用 Material 3 样式名称, 或 ComposeTextStyleInput 对象. 此辅助类型专指下方的对象形态; 目录表另行列出可用的字符串名称:

`displayLarge`, `displayMedium`, `displaySmall`, `headlineLarge`, `headlineMedium`, `headlineSmall`, `titleLarge`, `titleMedium`, `titleSmall`, `bodyLarge`, `bodyMedium`, `bodySmall`, `labelLarge`, `labelMedium`, `labelSmall`.

ComposeTextStyleInput 对象包含:

- {{
    - fontFamily?: [string](dataTypes#string);
    - fontSize?: [ComposeSpInput](#composespinput);
    - fontWeight?: [number](dataTypes#number);
    - italic?: [boolean](dataTypes#boolean);
    - lineHeight?: [ComposeSpInput](#composespinput);
    - letterSpacing?: [ComposeSpInput](#composespinput);
- }}

`fontWeight` 为 1 到 1000 的整数, 不接受 `'bold'`. 字体族规则见 [ComposeTheme](composeThemeType#选项). 不在此对象中写 `color`, `textAlign` 或组件修饰属性; 它们是节点本身的属性. 例如:

```js
let title = compose.Text({
    text: '标题',
    style: { fontFamily: 'sans-serif', fontSize: '20sp', fontWeight: 600 },
    color: '#006C4C'
});
```

### ComposeImageInput

接受 [ImageWrapper](imageWrapperType), Android `Bitmap`, 本地文件路径或宿主资源名 `'@drawable/name'`. 文件路径按当前脚本的文件路径规则解析; 不下载 HTTP/HTTPS URL, 不把 `content://` 当成文件路径读取.

ImageWrapper/Bitmap 使用进程内图片引用, 不先编码成图片字节. 插件不主动 recycle 调用方图片. 节点仍可能绘制时不能回收图片; 推荐持有自己的 ImageWrapper, 让图片寿命覆盖所属会话及原生视图释放过程. 必须确认最后一个显示节点已从渲染器移除后再回收; `remove` / `close` 返回或 close 回调都不保证异步原生清理已完成. `contentScale` 决定显示比例, 不能替代对图片实际像素大小的限制.

可执行的保守做法是使用期间保留脚本引用, 不再使用后关闭所属会话并释放脚本强引用, 交给正常回收流程. 没有原生释放完成确认时, 不要立即显式调用 recycle, 也不要把固定延时当成释放确认:

```js
'ui';

// 前置条件: 当前脚本目录存在可读取的 photo.png.
let picture = images.read('./photo.png');
let session = compose.mount(compose.Column({ padding: 16 },
    compose.Image({ src: picture, w: 160, h: 160 }),
    compose.Button({ onClick: function () {
        session.close();
        picture = null; // 不再由脚本使用, 不强制立即 recycle 或 GC.
    } }, '关闭')));
```

### ComposeIconNameInput

接受 core 图标的字符串名称. 省略样式前缀时使用 `Filled`, 如 `'Menu'` 等价于 `'Filled.Menu'`. 支持 `Filled`, `Outlined`, `Rounded`, `Sharp`, `TwoTone` 五种样式, 名称比较不区分大小写, 如 `'outlined.search'`. 不加 `Icons.` 前缀.

每种样式当前包含以下 49 个名称:

`AccountBox`, `AccountCircle`, `Add`, `AddCircle`, `ArrowBack`, `ArrowDropDown`, `ArrowForward`, `Build`, `Call`, `Check`, `CheckCircle`, `Clear`, `Close`, `Create`, `DateRange`, `Delete`, `Done`, `Edit`, `Email`, `ExitToApp`, `Face`, `Favorite`, `FavoriteBorder`, `Home`, `Info`, `KeyboardArrowDown`, `KeyboardArrowLeft`, `KeyboardArrowRight`, `KeyboardArrowUp`, `List`, `LocationOn`, `Lock`, `MailOutline`, `Menu`, `MoreVert`, `Notifications`, `Person`, `Phone`, `Place`, `PlayArrow`, `Refresh`, `Search`, `Send`, `Settings`, `Share`, `ShoppingCart`, `Star`, `ThumbUp`, `Warning`.

此外, `ArrowBack`, `ArrowForward`, `ExitToApp`, `KeyboardArrowLeft`, `KeyboardArrowRight`, `List`, `Send` 提供这五种样式的自动镜像形式, 如 `'AutoMirrored.Filled.ArrowBack'`, 共 35 项, 名称同样不区分大小写.

未提供 material-icons-extended 全量图标. 其他图案请通过 `Image` 使用自己的图片. 为有交互含义的图标设置 `contentDescription`, 装饰性图标可以不设.

V2 组件继续使用相同的 core 图标和 Image 输入, 新组件的 icon 插槽不要求安装或打包额外图标库.

### ComposeValueInput

这是声明中用于描述目录数据组合的辅助类型, 不表示可给任意属性传任意值. 每个属性仍受目录表的类型, 枚举, 长度和数值范围约束. `range` 必须是两个数字, padding 数组长度只能为 1 / 2 / 4, 未知对象键不会被忽略.

## 通用属性

| 属性 | 作用 |
| --- | --- |
| `key` | 构造时的字符串或有限数字, 数字会规范化为字符串; 同父普通 children 中非 null key 唯一, 具名插槽按槽名协调; 不能在创建后修改 |
| `ref` | [compose.ref](compose#m-ref) 创建的引用, 在帧被接受后获得当前节点 |
| `modifier` | [ComposeModifier](composeModifierType) 链 |
| `children` | 构造时提供子节点, 不可与额外位置参数同时提供; 后续使用 append/insert/replace/clear |
| `slots` | 插槽名到单一内容的对象, 仅能使用组件声明的插槽名 |
| `onClick` 等事件属性 | 构造 props 或 `node.set` 中注册的回调; 普通函数 `this` 是当前节点 |
| `w` / `h` / `padding` / `bg` / `weight` / `alpha` / `testTag` / `contentDescription` | [固定顺序的快捷修饰属性](composeModifierType#快捷属性) |

一般组件属性可通过 `node.text = '新内容'` 或 `node.set({ text: '新内容' })` 修改. 但 `onClick`, `slots`, `ref` 不是直接访问器: 使用构造 props, `node.set`, `node.on` 或 `node.slot`. 例如 `node.onClick = fn` 会得到 `UNKNOWN_PROP`, 不会注册事件.

完整错误及节点归属规则见 [ComposeNode](composeNodeType) 和 [compose](compose). `enabled` 只存在于目录列出的交互组件, 不应给所有布局或文字节点统一添加.

## 插槽与子节点

子节点支持 ComposeNode, 字符串及其嵌套数组; null, undefined 和 false 被忽略. 字符串转换为 Text 节点. **数字和 true 不自动转成文字**, 应写 `String(value)` 或 `compose.Text({ text: String(value) })`.

```js
'ui';

compose.mount(compose.Column({ spacing: 8 },
    compose.Text({ text: '内容区' }),
    false,
    ['第一行', null, ['第二行']],
    compose.Button({ onClick: function () { toast('已点击'); } }, '确认')));
```

仅支持子节点的组件才能接收这种内容. `compose.Button('确认')` 有效, 但 `compose.Text('内容')` 会变成 Text 的子节点输入而被拒绝; Text 的内容必须写进 `text` 属性.

一个插槽展开后只能有 0 或 1 个节点. 多个动作请包在 Row/Column 内. 插槽可写成顶层 props 字段或 `slots` 对象, 也可调用 `node.slot(name, content)`:

```js
let bar = compose.TopAppBar({
    title: compose.Text({ text: '标题' }),
    actions: compose.Row({},
        compose.IconButton({ onClick: function () { toast('搜索'); } },
            compose.Icon({ name: 'Search', contentDescription: '搜索' })),
        compose.IconButton({ onClick: function () { toast('设置'); } },
            compose.Icon({ name: 'Settings', contentDescription: '设置' })))
});
```

同一组件不能同时声明主 children 与 `content` 插槽. Surface 和 Scaffold 的主内容至多一个节点, 多个内容请放进一个布局. AlertDialog 的 `confirm` 插槽必需, 即使 `open: false` 也应声明.

## 事件回调

属性名使用 `on` 前缀, `node.on` 使用不带前缀的事件名, 如 `onClick` 对应 `node.on('click', fn)`. 回调排队到拥有该节点的脚本线程, 返回值不用于决定原生事件是否被消费. 在一个事件回调内进行的多次更新会按既有 batch 规则合并. 参阅 [线程与生命周期](compose#线程与生命周期).

| 事件属性 | 脚本回调参数 | 适用条件 |
| --- | --- | --- |
| `onClick` | 无参数 | 组件自己的激活或节点点击行为 |
| `onLongClick` | 无参数 | 节点长按行为 |
| `onFocusChange` | `focused: boolean` | 有实际焦点目标的组件或带 clickable 的节点; 声明事件本身不创建焦点目标 |
| `onScroll` | `firstVisibleIndex: number 或 null`, `offset: number` | LazyColumn/LazyRow 提供零基索引; 普通滚动修饰为 null; offset 是物理像素 |
| `onCheckedChange` | `checked: boolean` | Switch / Checkbox / RadioButton |
| `onValueChange` | `value: number` | Slider |
| `onValueChangeFinished` | 无参数 | Slider 的一次交互结束 |
| `onValueChange` | `text: string`, `selection: { start: number, end: number }`, `editSeq: number` | TextField / OutlinedTextField |
| `onDismissRequest` | 无参数 | AlertDialog 请求关闭, 需脚本更新 `open` |
| `onAction` / `onDismiss` | 无参数 | `session.showSnackbar` 的回调选项, 不是节点工厂事件 |

目录列出可注册的事件集合, 不保证没有滚动/焦点能力的组件会产生 scroll/focusChange. 控件 `enabled: false` 会阻止对应原生交互. 可访问节点的 ID/文本/描述与点击祖先规则见 [无障碍与选择器](compose#无障碍与选择器).

## 组件使用

下列说明与末尾生成的属性/插槽/事件表一起使用. 未列出的 Android View 属性, Compose 参数和扩展组件不属于此接口.

### Column

垂直排列多个子节点. `arrangement` 支持 top / center / bottom / spaceBetween / spaceAround / spaceEvenly, `alignment` 支持 start / center / end. `spacing` 是非负 dp 的额外固定间距. 别名为 `verticalArrangement` 和 `horizontalAlignment`.

### Row

水平排列多个子节点. `arrangement` 支持 start / center / end / spaceBetween / spaceAround / spaceEvenly, `alignment` 支持 top / center / bottom. 别名为 `horizontalArrangement` 和 `verticalAlignment`. Row/Column 的 spacing 与 arrangement 配合, 先为固定间距预留空间, 再对剩余空间应用 arrangement.

### Box

重叠放置多个子节点. `alignment` / `contentAlignment` 使用九个位置名称, 默认为 topStart. 单个直接子节点可用 `modifier.align(...)` 覆盖其在 Box 中的位置.

### Spacer

空白占位节点, 不接受 children. 用 `w`, `h`, `size` 或 Column/Row 内的 `weight` 决定占位尺寸.

### LazyColumn

垂直惰性列表. children 每一项是一个节点, 建议为每项指定稳定 key; 多个行元素可以先组成一个 Row. `contentPadding` 支持非负 dp 或长度 1 / 2 / 4 的 dp 数组, 两项为水平/垂直, 四项为 start/top/end/bottom. `reverseLayout` 默认 false, `userScrollEnabled` 默认 true.

挂载后的列表句柄支持 `scrollTo(index)` 或 `scrollTo({ index: 900, offset: 0 })`; index 为零基, offset 为 px. `userScrollEnabled: false` 禁用用户滚动, 不删除脚本滚动命令. 给列表有限视口, 常用 Column 内的 `modifier.weight(1).fillMaxWidth()`.

动态列表缺少 key 时按索引/组件类型匹配并给出一次提示, 不因缺 key 自动拒绝. 稳定 key 能在重排时保留对应项身份. 惰性组合只减少可视区域的原生组合工作, 不表示脚本可以绕开每会话 5000 节点等上限或省略首次创建脚本节点的成本.

### LazyRow

水平惰性列表, 使用与 LazyColumn 相同的内容, key, contentPadding, reverseLayout, userScrollEnabled 和 scrollTo 规则. 主轴 arrangement 使用 Row 的取值, 交叉轴 alignment 使用 top / center / bottom.

### Scaffold

页面骨架, 支持 `topBar`, `content`, `snackbarHost` 插槽. 主 children 与 content 插槽二选一, 都至多一个节点. `containerColor` / `contentColor` 覆盖页面容器与内容颜色. topBar 高度的留白由骨架处理; 宿主负责系统栏与输入法边距, 不需要再次硬编码这些边距.

省略 snackbarHost 时提供内建 Snackbar 承载. 自定义 snackbarHost 会替换该承载, `session.showSnackbar` 不向任意自定义节点注入消息, 此时命令会被拒绝.

### Surface

承载一个主内容节点或 content 插槽. 支持 color, contentColor, tonalElevation 和 shape. 常用于为整个页面提供跟随主题的表面颜色. 多个内容请放入一个 Column/Row/Box.

### Card

卡片容器, 支持多个 children 或一个 content 插槽, 以及 color, contentColor, elevation 和 shape. 其内部布局作用域不会传给脚本子节点; 需要 weight 时在卡片里显式创建 Row/Column.

### HorizontalDivider

水平分隔线, 支持 color 和非负 thickness, 默认厚度 1 dp. 不接受子节点.

### TopAppBar

顶部应用栏, 使用 title, navigationIcon 和 actions 插槽. 它不把位置参数 children 当作标题. actions 是单插槽, 多个按钮请放进 Row. 支持 containerColor / contentColor.

### Text

通过 `text` 属性设置字符串, 默认空字符串. 支持 Material 样式名/样式对象, color, fontSize, fontWeight, textAlign, maxLines, overflow 和 selectable. textAlign 为 start / end / left / right / center / justify; overflow 为 clip / ellipsis / visible. `maxLines` 为正整数, `selectable` 默认为 false. 不接受 children.

### Icon

必需 `name`, 可选 `tint`. 名称集合见 [ComposeIconNameInput](#composeiconnameinput). 不使用 text 作为图标名称; 不接受 children.

### AndroidView

F2 扩展, 使用 [配套宿主和插件](compose). 必填 `view`, 接受 [ComposeViewInput](#composeviewinput); 不接受 children, 具名插槽, `update` 或 `onRelease` 脚本属性. 修饰链和快捷尺寸仍使用 Compose 的单位与顺序. `compose.createElement('AndroidView', {view})`, `<compose.AndroidView view={view} />` 和 `<compose:AndroidView view={view} />` 使用同一节点行为.

传入的 View 必须可由该节点独占挂载. 不会从已有父视图强行取走 View, 也不能让两个 AndroidView 节点同时借用同一实例. 同一容器替换会话时, 仍被旧会话占用的 View 也不能直接交给新会话. 未具备互操作能力的插件报 `PLUGIN_INCOMPATIBLE`, 无效 View 或占用冲突报 `INVALID_ARGUMENT`. 工厂抛出的普通异常按可恢复的 `RENDER_FAILED` 处理, 已有 ComposeError 保留其错误码, 不替换已经有效的旧内容.

```js
'ui';

let nativeButton = ui.inflate('<button text="Native button" />');
let nativeNode = compose.AndroidView({view: nativeButton, w: 200, h: 56});
nativeButton.on('click', function () {
    nativeButton.setText('Clicked');
});
compose.mount(compose.Column({padding: 16, spacing: 12},
    compose.Text({text: 'Compose heading'}), nativeNode));
```

也可让宿主在主线程提供 Context 并创建 View:

```js
let nativeNode = compose.AndroidView({view: function (context) {
    let text = new android.widget.TextView(context);
    text.setText('Created by a View factory');
    return text;
}});
```

`nativeNode.view` 和 `nativeNode.get('view')` 返回同一个实际 View 对象对应的包装. 使用 `nativeNode.set({view: anotherView})` 或给 `nativeNode.view` 赋值可替换输入. 修改该 View 的 Android 属性仍须遵守 Android 主线程要求; ComposeNode 的业务操作仍在所属脚本线程进行.

节点借用 View, 不代替调用方销毁 View 自身的业务资源或清除用户注册的原生监听. 节点移除或会话关闭的原生清理具有 [异步边界](composeSessionType#m-close); 不凭 `close()` 返回就立即把该 View 添加到另一个父视图. 需要复用时, 应在主线程确认旧父视图已释放它, 再创建新的 AndroidView 节点. 已关闭会话的 ComposeNode 句柄本身不能复用.

### Image

必需 `src`, 使用 [ComposeImageInput](#composeimageinput). `contentScale` 支持 fit / crop / fillBounds / fillWidth / fillHeight / inside / none, 默认 fit. 尺寸通过 modifier 或 w/h 指定. 不接受 children.

### Button

填充按钮, children 中的字符串会变成 Text. 通过 `onClick` 接收激活事件. 默认 enabled 为 true, 可设置 containerColor, contentColor 和 shape.

### ElevatedButton

带默认阴影的按钮, 输入和事件与 Button 一致. 不提供自定义 elevation 属性, 不应从 Card 的属性集合推断可用参数.

### FilledTonalButton

使用色调填充的按钮, 输入和事件与 Button 一致. 默认配色来自当前主题.

### OutlinedButton

描边样式按钮, 输入和事件与 Button 一致. 如需额外边框可显式用 modifier.border, 不提供任意原生 BorderStroke 参数.

### TextButton

文字按钮, 输入和事件与 Button 一致. 通常用于较低强调程度的动作.

### IconButton

以图标为主要内容的按钮, 支持与 Button 一样的 enabled, containerColor, contentColor 和 shape. 一般传入一个 Icon, 并通过 contentDescription 给动作命名.

### Switch

布尔开关, `checked` 默认为 false. 它是受控组件, `onCheckedChange` 报告目标值, 脚本需要写回句柄或响应式状态以接受新值.

```js
'ui';

let enabled = compose.Switch({
    checked: false,
    onCheckedChange: function (value) { enabled.checked = value; }
});
compose.mount(compose.Row({ padding: 20, spacing: 12, alignment: 'center' },
    compose.Text({ text: '启用' }), enabled));
```

### Checkbox

复选框, checked/enabled 与 Switch 一致, 通过 onCheckedChange 报告目标值. 本版不提供三态 Checkbox.

### RadioButton

单选按钮, `selected` 是 `checked` 的别名, 不能在同一更新中同时提供二者. 点击选中时报告 true, 不自动取消其他 RadioButton; 同组互斥由脚本状态控制.

### Slider

受控滑块. `value` 默认 0, `range` 默认 `[0, 1]`, 必须是递增的两个有限数字, value 必须在范围内. `steps` 为非负整数, 0 表示连续, 正数是两个端点之间的等分离散点数量. `onValueChange` 需要写回 value 或状态; `onValueChangeFinished` 表示一次交互结束, 不另带 value.

### TextField

原生文本输入框. `text` 默认为空字符串, `value` 是其别名, 同一更新不能同时提供两者. 支持 label, placeholder, leadingIcon, trailingIcon, supportingText 插槽; 标签内容本身可为 Text 节点.

`singleLine` 默认 false, `minLines` 默认 1, `maxLines` 默认 2147483647, 且 minLines <= maxLines. 键盘类型为 text / ascii / number / phone / uri / email / password / numberPassword / decimal; IME 动作为 default / none / go / search / send / previous / next / done. `readOnly` / `isError` 默认 false, `enabled` 默认 true.

`visualTransformation` 为 none 或 password. 键盘类型和密码遮罩是不同选项; 需要隐藏文字时显式设置 `visualTransformation: 'password'`.

原生编辑会先更新句柄的 text, 再交付 `onValueChange(text, selection, editSeq)`, 不必把同一文本重复写回. selection 或 IME 组合状态变化也可能产生同文本回调; 若业务只关心文本更改, 与上次文本比较后再更新校验/保存状态. 显式编辑和旧 editSeq 的处理见 [ComposeNode](composeNodeType).

### OutlinedTextField

描边输入框, 属性, 插槽, 原生文本/选区/IME 行为与 TextField 一致. 主题, 焦点与窗口输入条件仍适用, 在 floaty 中输入前先调用窗口 requestFocus.

### AlertDialog

受控对话框节点. `open` 默认为 false, `confirm` 插槽必需; 还支持 icon, title, text 和 dismiss 插槽, 以及 containerColor 和 shape. `onDismissRequest` 仅报告关闭请求, 不自动把 open 改为 false. confirm/dismiss 中的按钮也由脚本决定何时关闭.

```js
'ui';

let dialog = compose.AlertDialog({
    open: true,
    title: '确认',
    text: '是否继续?',
    confirm: compose.TextButton({ onClick: function () { dialog.open = false; } }, '继续'),
    dismiss: compose.TextButton({ onClick: function () { dialog.open = false; } }, '取消'),
    onDismissRequest: function () { dialog.open = false; }
});
compose.mount(compose.Box({}, dialog));
```

它是会话树中的组件. 如需为内容创建独立对话框或底部弹层会话, 使用 [compose.dialog](compose#m-dialog).

### CircularProgressIndicator

圆形进度指示器. `progress` 为 0 到 1 的数字时显示确定进度, 省略或 null 时显示不确定进度. 可设置 color / trackColor, 不接受 children.

### LinearProgressIndicator

线形进度指示器, progress/color/trackColor 的规则与 CircularProgressIndicator 一致. 宽高通过 modifier 控制.

### Snackbar

目录中的命令项, 不存在 `compose.Snackbar(...)` 节点工厂. 调用 [session.showSnackbar](composeSessionType#m-showsnackbar), 由会话树内第一个 Scaffold 的内建承载显示. 无 Scaffold 或其 snackbarHost 已自定义时, 命令被拒绝.

```js
'ui';

let session = compose.mount(compose.Scaffold({},
    compose.Button({ onClick: function () {
        session.showSnackbar('已保存', { actionLabel: '撤销', onAction: function () { toast('撤销'); } });
    } }, '保存')));
```

## V2 组件

以下组件需要 AutoJs6 6.8.0 / 宿主构建 5322 与契约版本 2 的 3-Block Compose 插件. 工厂与两种 TSX 标签使用同一规则. 声明配套版本为 Declarations 4.35.0, TypeScript Engine 0.6.7 和 Ace Editor 1.29.0. V1 组件的名称, 属性和事件保持不变; 在支持 V1 插件的配套宿主中, 新组件仍需要实际的 V2 插件能力.

状态属性使用严格类型, 不将数字字符串当数字. `page`, `selectedIndex`, `hour`, `minute`, 年份及 `columns` 是整数. 构造输入, 后续 `set` 与属性赋值都受相同范围和树结构规则约束. 下方目录表列出每项默认值, 类型, 插槽和事件; 数值上限与跨属性约束由运行时检查.

日期, 时间, 选择, 输入和开合状态由已接受的节点属性控制. 用户操作触发事件, 不自动改写脚本节点的属性; 回调中需要通过属性赋值, set 或响应式 state 接受新值. HorizontalPager 的手势和 scrollTo 会直接移动原生页面并报告 pageChange, 但也不自动改写脚本 page 属性; 无关属性更新保留已有页面位置, page 属性值改变时请求定位. 需要在 page 属性值未改变时重新定位, 使用 scrollTo.

NavigationBarItem, NavigationRailItem, NavigationDrawerItem, Tab, DropdownMenuItem, AssistChip, FilterChip, InputChip, SegmentedButtonItem, FloatingActionButton 和 SearchBar 提供原生 [focus / blur](composeNodeType#m-focus) 命令. 节点须已挂载; 焦点请求异步生效, 不保证输入法随即显示. 其他节点可通过已有 clickable Modifier 获得相应焦点目标.

### NavigationBar

`compose.NavigationBar(props?, ...items)` 返回底部导航栏节点. 普通 children 至少包含一个 [NavigationBarItem](#navigationbaritem), 不接受字符串, Text 或其他节点. 同时最多一个 item 的 `selected` 为 true. `containerColor` 和 `contentColor` 控制栏颜色.

### NavigationBarItem

`compose.NavigationBarItem(props)` 需要必填 `icon` 插槽, `label` 可选. `selected` 默认为 false, `enabled` 和 `alwaysShowLabel` 默认为 true. 必须直接位于 NavigationBar 下. 用户点击触发 `click`; 脚本根据当前页面更新各 item 的 `selected`.

```js
'ui';

let page = compose.state(0);
compose.mount(function () {
    return compose.NavigationBar({},
        compose.NavigationBarItem({key: 'home', selected: page.value === 0,
            icon: compose.Icon({name: 'Home'}), label: '首页',
            onClick: function () { page.value = 0; }}),
        compose.NavigationBarItem({key: 'settings', selected: page.value === 1,
            icon: compose.Icon({name: 'Settings'}), label: '设置',
            onClick: function () { page.value = 1; }}));
});
```

### NavigationRail

`compose.NavigationRail(props?, ...items)` 返回侧边导航栏. children 至少包含一个 [NavigationRailItem](#navigationrailitem), 且最多选中一个. `header` 为可选的单节点插槽. 颜色属性与 NavigationBar 相同.

### NavigationRailItem

`compose.NavigationRailItem(props)` 必须直接位于 NavigationRail 下. 必填 `icon`, 可选 `label`, `selected`, `enabled` 与 `alwaysShowLabel` 的规则同 NavigationBarItem.

### NavigationDrawer

`compose.NavigationDrawer(props, child?)` 通过必填 `drawerContent` 插槽定义抽屉, 通过一个普通 child 或 `content` 插槽定义页面. 同时提供 child 与 content 会被拒绝. `open` 默认 false, `gesturesEnabled` 默认 true. `openChange(open)` 回调接收布尔值.

抽屉需要多个条目时, 把 [NavigationDrawerItem](#navigationdraweritem) 放入 Column, 再交给 drawerContent. 页面内容和抽屉内容都属于当前会话.

### NavigationDrawerItem

`compose.NavigationDrawerItem(props)` 需要 `label` 插槽, 可选 `icon` 和 `badge`. `selected` 默认 false, `enabled` 默认 true, 点击触发 `click`.

### TabRow

`compose.TabRow(props?, ...tabs)` 只接受直接的 [Tab](#tab) children. `selectedIndex` 默认 0, 必须是现有子项的索引, 因此至少需要一个 Tab. `scrollable` 默认 false; 为 true 时允许标签栏横向滚动. `containerColor` 和 `contentColor` 控制颜色.

### Tab

`compose.Tab(props?)` 必须直接位于 TabRow 下, `text` 与 `icon` 是可选插槽, `enabled` 默认 true. 点击触发 `click`; 在回调中更新父 TabRow 的 selectedIndex 或关联状态. Tab 自身没有 selected 属性.

### ModalBottomSheet

`compose.ModalBottomSheet(props?, child?)` 是当前会话树中的底部弹层节点, 使用单个 child 或 `content` 插槽. `open` 默认 false, `cancelable` 默认 true; 可设置 `shape`, `containerColor` 和 `contentColor`.

用户请求关闭时触发 `dismissRequest()`. 脚本应设置 `open = false` 或从树中移除此节点. `cancelable: false` 禁用返回键, 外部点击及下滑关闭请求, 脚本仍可修改 open. 此节点与创建独立会话的 [compose.dialog](compose#m-dialog) 不同.

### DropdownMenu

`compose.DropdownMenu(props, ...items)` 需要 `anchor` 插槽作为菜单定位内容. `open` 默认 false, 普通 children 作为菜单内容, 通常使用 DropdownMenuItem. 外部关闭请求触发 `dismissRequest()`, 脚本可设置 open 为 false.

### DropdownMenuItem

`compose.DropdownMenuItem(props)` 需要 `text` 插槽, 可选 `leadingIcon` 与 `trailingIcon`, `enabled` 默认 true. 点击触发 `click`, 是否关闭父菜单由脚本决定.

### DatePicker

`compose.DatePicker(props?)` 不接受 children. `selectedDateMillis` 是 UTC 零时的毫秒时间戳或 null, 默认 null. `yearStart` 和 `yearEnd` 默认 1900 与 2100, 均须在 1583 到 9999 之间且起始年不晚于结束年. 非 null 选中日期必须在该年份区间内, 不能用未经转换的本地时间戳代替 UTC 日期.

`displayMode` 为 `'picker'` 或 `'input'`, 默认 `'picker'`. `showModeToggle` 默认 true. `dateChange(selectedDateMillis)` 接收 [number](dataTypes#number) 或 null, 无选择或输入日期无效时为 null. `displayModeChange(displayMode)` 接收 `'picker'` 或 `'input'`.

```js
let date = compose.DatePicker({selectedDateMillis: Date.UTC(2026, 9, 7),
    onDateChange: function (millis) { this.selectedDateMillis = millis; },
    onDisplayModeChange: function (mode) { this.displayMode = mode; }});
```

### TimePicker

`compose.TimePicker(props?)` 不接受 children. `hour` 为 0 到 23 的整数, `minute` 为 0 到 59 的整数, 默认均为 0. `is24Hour` 默认 true. `displayMode` 为 `'picker'` 或 `'input'`, 默认 `'picker'`.

`timeChange(hour, minute)` 以两个数字参数报告当前时间, 即使使用 12 小时显示, hour 仍采用 0 到 23. 它不接收日期, 时区或 Date 对象, 也不提供 TextField 的 edit 命令.

### HorizontalPager

`compose.HorizontalPager(props?, ...pages)` 使用普通 children 定义页面, 至少需要一个页面. `page` 默认 0, 必须是现有页面索引. `pageSpacing` 为非负 dp, 默认 0. `userScrollEnabled` 默认 true.

页面变化触发 `pageChange(page)`. `scroll(index, offset)` 的 index 为当前页面索引, offset 为相对该页的物理像素偏移. 使用 `node.scrollTo(index)` 或 `node.scrollTo({index, offset})` 定位; offset 根据实际页面尺寸转换, 不是页面比例或 dp. 页面内容应有稳定 key, 单节点最多 2000 个直接 children, 全会话仍受总节点数限制.

### LazyVerticalGrid

`compose.LazyVerticalGrid(props?, ...items)` 提供纵向懒网格. `columns` 默认 2, 允许 1 到 64 的整数. `spacing` 为非负 dp, 默认 0. `contentPadding` 可为一个 dp 值或长度为 1 / 2 / 4 的 dp 数组, 默认 0. `userScrollEnabled` 默认 true, `reverseLayout` 默认 false.

支持 `scrollTo(index)` 及 `{index, offset}` 形式, index 指子项而非行号. `scroll(firstVisibleIndex, offset)` 中的 offset 为物理像素. 网格需要明确的可用高度, 不应直接置于同向且无限高度的滚动布局中. children 建议使用稳定 key, 单节点最多 2000 个直接 children.

### AssistChip

`compose.AssistChip(props)` 需要 `label` 插槽, 可选 `leadingIcon` 和 `trailingIcon`. `enabled` 默认 true, 点击触发 `click`, 不包含选中状态.

### FilterChip

`compose.FilterChip(props)` 使用与 AssistChip 相同的插槽, 增加默认 false 的 `selected`. `selectedChange(selected)` 回调接收布尔值; 在回调中更新属性或状态以保留新选择.

### InputChip

`compose.InputChip(props)` 的属性, 插槽和 selectedChange 参数与 FilterChip 相同. `trailingIcon` 只是图标插槽, 不自动删除节点; 删除行为由脚本通过相应点击回调实现.

### Badge

`compose.Badge(props?, child?)` 接受一个 child 或 content 插槽作为被标记内容. `text` 默认空字符串, `visible` 默认 true. visible 为 false 时隐藏标记, 保留被标记内容. 不应把数字直接写入 text, 可用 `String(count)` 转换. 没有内容时可用作独立标记.

### SegmentedButton

`compose.SegmentedButton(props?, ...items)` 只接受直接的 SegmentedButtonItem, 至少一个. `mode` 为 `'single'` 或 `'multi'`, 默认 `'single'`. single 模式同时最多一个 item 的 selected 为 true, 可以全部未选中; 多项状态应通过 [compose.batch](compose#m-batch) 或一次状态重绘一起修改.

### SegmentedButtonItem

`compose.SegmentedButtonItem(props)` 必须直接位于 SegmentedButton 下. 需要 label 插槽, 可选 icon. selected 默认 false, enabled 默认 true, `selectedChange(selected)` 回调接收新选择状态. 父容器不自动替脚本修改其他 item 的属性.

### FloatingActionButton

`compose.FloatingActionButton(props?, ...children)` 接受内容 children 或 content 插槽, 可设置 containerColor, contentColor 和 shape. 点击触发 click. 它是当前布局中的浮动操作按钮组件, 不会创建 [compose.floaty](compose#m-floaty) 悬浮窗口.

### SearchBar

`compose.SearchBar(props?, ...children)` 的 `query` 默认空字符串, `expanded` 默认 false, `enabled` 默认 true. 支持 placeholder, leadingIcon, trailingIcon 与 content 插槽; 普通 children 或 content 作为展开后的内容.

`queryChange(text)` 和 `search(text)` 分别报告输入变化与提交搜索, `expandedChange(expanded)` 报告展开状态变化. text 为字符串, expanded 为布尔值. 通过 query 属性更新内容, 不使用 TextField 的 edit 命令.

### Tooltip

`compose.Tooltip(props, child?)` 需要 tooltip 插槽作为提示内容, 以一个 child 或 content 插槽作为锚点内容. `open` 默认 false, `openChange(open)` 参数为布尔值. 提示内容需要多个节点时先用 Column 或 Row 包裹, 不以 fragment 绕过单插槽数量限制.

长按或鼠标悬停会请求 openChange(true), 需要脚本接受后才显示. 显式 open 为 true 时持续显示, 直到脚本将其改为 false 或移除节点.

### PullToRefresh

`compose.PullToRefresh(props?, child?)` 通过一个 child 或 content 插槽包裹内容. `refreshing` 默认 false, `enabled` 默认 true. 用户请求刷新时触发无参数 `refresh()` 事件; 脚本自行执行刷新任务并更新 refreshing.

```js
'ui';

let count = compose.state(0);
let loading = compose.state(false);
let session = compose.mount(function () {
    return compose.PullToRefresh({refreshing: loading.value,
        onRefresh: function () {
            loading.value = true;
            session.post(function () {
                count.value++;
                loading.value = false;
            }, 250);
        }}, compose.LazyColumn({}, compose.Text({text: '刷新次数: ' + count.value})));
});
```

## 目录生成表

下方区域直接来自冻结 V1 的实际组件目录, 包含 30 个目录项和 114 个规范属性, 不手工修改. NODE 表示节点工厂, COMMAND 表示命令; Children 的 NONE / SINGLE / MANY / LAZY_ITEMS 表示子节点策略, Scope 表示作用域类别. `Default (wire value)` 以目录模型展示默认值, 不是要求脚本构造 `{ kind, value }` 对象; 脚本仍使用本页列出的普通输入类型. `unspecified` 表示目录未给出默认值, 具体默认外观由渲染器/主题确定.

<!-- autojs6-compose-catalog:v1:start -->
<!-- Generated from org.autojs.plugin.compose.api.catalog.ComponentCatalog.V1; schema=1; contract=1; sha256=573d91aa8ca860dcc79c688765eb1d6f9a0f59dc81094d1fa2834efd83376fed. -->

| Component | Invocation | Children | Scope | Canonical properties | Slots | Events | Commands |
| --- | --- | --- | --- | --- | --- | --- | --- |
| <code>AlertDialog</code> | NODE | NONE | ANY | <code>containerColor</code>, <code>open</code>, <code>shape</code> | <code>confirm (required)</code>, <code>dismiss</code>, <code>icon</code>, <code>text</code>, <code>title</code> | <code>click</code>, <code>dismissRequest</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | - |
| <code>Box</code> | NODE | MANY | BOX | <code>alignment</code> | <code>content</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | - |
| <code>Button</code> | NODE | MANY | ANY | <code>containerColor</code>, <code>contentColor</code>, <code>enabled</code>, <code>shape</code> | <code>content</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | <code>blur</code>, <code>focus</code> |
| <code>Card</code> | NODE | MANY | ANY | <code>color</code>, <code>contentColor</code>, <code>elevation</code>, <code>shape</code> | <code>content</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | - |
| <code>Checkbox</code> | NODE | NONE | ANY | <code>checked</code>, <code>enabled</code> | - | <code>checkedChange</code>, <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | <code>blur</code>, <code>focus</code> |
| <code>CircularProgressIndicator</code> | NODE | NONE | ANY | <code>color</code>, <code>progress</code>, <code>trackColor</code> | - | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | - |
| <code>Column</code> | NODE | MANY | COLUMN_ROW | <code>alignment</code>, <code>arrangement</code>, <code>spacing</code> | <code>content</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | - |
| <code>ElevatedButton</code> | NODE | MANY | ANY | <code>containerColor</code>, <code>contentColor</code>, <code>enabled</code>, <code>shape</code> | <code>content</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | <code>blur</code>, <code>focus</code> |
| <code>FilledTonalButton</code> | NODE | MANY | ANY | <code>containerColor</code>, <code>contentColor</code>, <code>enabled</code>, <code>shape</code> | <code>content</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | <code>blur</code>, <code>focus</code> |
| <code>HorizontalDivider</code> | NODE | NONE | ANY | <code>color</code>, <code>thickness</code> | - | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | - |
| <code>Icon</code> | NODE | NONE | ANY | <code>name</code>, <code>tint</code> | - | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | - |
| <code>IconButton</code> | NODE | MANY | ANY | <code>containerColor</code>, <code>contentColor</code>, <code>enabled</code>, <code>shape</code> | <code>content</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | <code>blur</code>, <code>focus</code> |
| <code>Image</code> | NODE | NONE | ANY | <code>contentScale</code>, <code>src</code> | - | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | - |
| <code>LazyColumn</code> | NODE | LAZY_ITEMS | ANY | <code>alignment</code>, <code>arrangement</code>, <code>contentPadding</code>, <code>reverseLayout</code>, <code>spacing</code>, <code>userScrollEnabled</code> | - | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | <code>scrollTo</code> |
| <code>LazyRow</code> | NODE | LAZY_ITEMS | ANY | <code>alignment</code>, <code>arrangement</code>, <code>contentPadding</code>, <code>reverseLayout</code>, <code>spacing</code>, <code>userScrollEnabled</code> | - | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | <code>scrollTo</code> |
| <code>LinearProgressIndicator</code> | NODE | NONE | ANY | <code>color</code>, <code>progress</code>, <code>trackColor</code> | - | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | - |
| <code>OutlinedButton</code> | NODE | MANY | ANY | <code>containerColor</code>, <code>contentColor</code>, <code>enabled</code>, <code>shape</code> | <code>content</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | <code>blur</code>, <code>focus</code> |
| <code>OutlinedTextField</code> | NODE | NONE | ANY | <code>enabled</code>, <code>imeAction</code>, <code>isError</code>, <code>keyboardType</code>, <code>maxLines</code>, <code>minLines</code>, <code>readOnly</code>, <code>singleLine</code>, <code>style</code>, <code>text</code>, <code>visualTransformation</code> | <code>label</code>, <code>leadingIcon</code>, <code>placeholder</code>, <code>supportingText</code>, <code>trailingIcon</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code>, <code>valueChange</code> | <code>blur</code>, <code>edit</code>, <code>focus</code> |
| <code>RadioButton</code> | NODE | NONE | ANY | <code>checked</code>, <code>enabled</code> | - | <code>checkedChange</code>, <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | <code>blur</code>, <code>focus</code> |
| <code>Row</code> | NODE | MANY | COLUMN_ROW | <code>alignment</code>, <code>arrangement</code>, <code>spacing</code> | <code>content</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | - |
| <code>Scaffold</code> | NODE | SINGLE | ANY | <code>containerColor</code>, <code>contentColor</code> | <code>content</code>, <code>snackbarHost</code>, <code>topBar</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | <code>showSnackbar</code> |
| <code>Slider</code> | NODE | NONE | ANY | <code>enabled</code>, <code>range</code>, <code>steps</code>, <code>value</code> | - | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code>, <code>valueChange</code>, <code>valueChangeFinished</code> | <code>blur</code>, <code>focus</code> |
| <code>Snackbar</code> | COMMAND | NONE | ANY | <code>actionLabel</code>, <code>duration</code>, <code>message</code> | - | <code>action</code>, <code>dismiss</code> | <code>showSnackbar</code> |
| <code>Spacer</code> | NODE | NONE | ANY | - | - | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | - |
| <code>Surface</code> | NODE | SINGLE | ANY | <code>color</code>, <code>contentColor</code>, <code>shape</code>, <code>tonalElevation</code> | <code>content</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | - |
| <code>Switch</code> | NODE | NONE | ANY | <code>checked</code>, <code>enabled</code> | - | <code>checkedChange</code>, <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | <code>blur</code>, <code>focus</code> |
| <code>Text</code> | NODE | NONE | ANY | <code>color</code>, <code>fontSize</code>, <code>fontWeight</code>, <code>maxLines</code>, <code>overflow</code>, <code>selectable</code>, <code>style</code>, <code>text</code>, <code>textAlign</code> | - | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | - |
| <code>TextButton</code> | NODE | MANY | ANY | <code>containerColor</code>, <code>contentColor</code>, <code>enabled</code>, <code>shape</code> | <code>content</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | <code>blur</code>, <code>focus</code> |
| <code>TextField</code> | NODE | NONE | ANY | <code>enabled</code>, <code>imeAction</code>, <code>isError</code>, <code>keyboardType</code>, <code>maxLines</code>, <code>minLines</code>, <code>readOnly</code>, <code>singleLine</code>, <code>style</code>, <code>text</code>, <code>visualTransformation</code> | <code>label</code>, <code>leadingIcon</code>, <code>placeholder</code>, <code>supportingText</code>, <code>trailingIcon</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code>, <code>valueChange</code> | <code>blur</code>, <code>edit</code>, <code>focus</code> |
| <code>TopAppBar</code> | NODE | NONE | ANY | <code>containerColor</code>, <code>contentColor</code> | <code>actions</code>, <code>navigationIcon</code>, <code>title</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | - |

| Component | Property | TypeScript input type | Required | Default (wire value) | Aliases | Update | Constraints |
| --- | --- | --- | --- | --- | --- | --- | --- |
| <code>AlertDialog</code> | <code>containerColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>AlertDialog</code> | <code>open</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>AlertDialog</code> | <code>shape</code> | <code>ComposeShapeInput</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>Box</code> | <code>alignment</code> | <code>&quot;bottomCenter&quot; &#124; &quot;bottomEnd&quot; &#124; &quot;bottomStart&quot; &#124; &quot;center&quot; &#124; &quot;centerEnd&quot; &#124; &quot;centerStart&quot; &#124; &quot;topCenter&quot; &#124; &quot;topEnd&quot; &#124; &quot;topStart&quot;</code> | false | <code>{&quot;kind&quot;:&quot;ENUM&quot;,&quot;value&quot;:&quot;topStart&quot;}</code> | <code>contentAlignment</code> | SET_PROPS | <code>{}</code> |
| <code>Button</code> | <code>containerColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>Button</code> | <code>contentColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>Button</code> | <code>enabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>Button</code> | <code>shape</code> | <code>ComposeShapeInput</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>Card</code> | <code>color</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>Card</code> | <code>contentColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>Card</code> | <code>elevation</code> | <code>ComposeDpInput</code> | false | unspecified | - | SET_PROPS | <code>{&quot;minimum&quot;:0.0}</code> |
| <code>Card</code> | <code>shape</code> | <code>ComposeShapeInput</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>Checkbox</code> | <code>checked</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>Checkbox</code> | <code>enabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>CircularProgressIndicator</code> | <code>color</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>CircularProgressIndicator</code> | <code>progress</code> | <code>null &#124; number</code> | false | <code>{&quot;kind&quot;:&quot;NULL&quot;,&quot;value&quot;:null}</code> | - | SET_PROPS | <code>{&quot;maximum&quot;:1.0,&quot;minimum&quot;:0.0}</code> |
| <code>CircularProgressIndicator</code> | <code>trackColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>Column</code> | <code>alignment</code> | <code>&quot;center&quot; &#124; &quot;end&quot; &#124; &quot;start&quot;</code> | false | <code>{&quot;kind&quot;:&quot;ENUM&quot;,&quot;value&quot;:&quot;start&quot;}</code> | <code>horizontalAlignment</code> | SET_PROPS | <code>{}</code> |
| <code>Column</code> | <code>arrangement</code> | <code>&quot;bottom&quot; &#124; &quot;center&quot; &#124; &quot;spaceAround&quot; &#124; &quot;spaceBetween&quot; &#124; &quot;spaceEvenly&quot; &#124; &quot;top&quot;</code> | false | <code>{&quot;kind&quot;:&quot;ENUM&quot;,&quot;value&quot;:&quot;top&quot;}</code> | <code>verticalArrangement</code> | SET_PROPS | <code>{}</code> |
| <code>Column</code> | <code>spacing</code> | <code>ComposeDpInput</code> | false | <code>{&quot;kind&quot;:&quot;DP&quot;,&quot;value&quot;:0.0}</code> | - | SET_PROPS | <code>{&quot;minimum&quot;:0.0}</code> |
| <code>ElevatedButton</code> | <code>containerColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>ElevatedButton</code> | <code>contentColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>ElevatedButton</code> | <code>enabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>ElevatedButton</code> | <code>shape</code> | <code>ComposeShapeInput</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>FilledTonalButton</code> | <code>containerColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>FilledTonalButton</code> | <code>contentColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>FilledTonalButton</code> | <code>enabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>FilledTonalButton</code> | <code>shape</code> | <code>ComposeShapeInput</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>HorizontalDivider</code> | <code>color</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>HorizontalDivider</code> | <code>thickness</code> | <code>ComposeDpInput</code> | false | <code>{&quot;kind&quot;:&quot;DP&quot;,&quot;value&quot;:1.0}</code> | - | SET_PROPS | <code>{&quot;minimum&quot;:0.0}</code> |
| <code>Icon</code> | <code>name</code> | <code>ComposeIconNameInput</code> | true | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>Icon</code> | <code>tint</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>IconButton</code> | <code>containerColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>IconButton</code> | <code>contentColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>IconButton</code> | <code>enabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>IconButton</code> | <code>shape</code> | <code>ComposeShapeInput</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>Image</code> | <code>contentScale</code> | <code>&quot;crop&quot; &#124; &quot;fillBounds&quot; &#124; &quot;fillHeight&quot; &#124; &quot;fillWidth&quot; &#124; &quot;fit&quot; &#124; &quot;inside&quot; &#124; &quot;none&quot;</code> | false | <code>{&quot;kind&quot;:&quot;ENUM&quot;,&quot;value&quot;:&quot;fit&quot;}</code> | - | SET_PROPS | <code>{}</code> |
| <code>Image</code> | <code>src</code> | <code>ComposeImageInput</code> | true | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>LazyColumn</code> | <code>alignment</code> | <code>&quot;center&quot; &#124; &quot;end&quot; &#124; &quot;start&quot;</code> | false | <code>{&quot;kind&quot;:&quot;ENUM&quot;,&quot;value&quot;:&quot;start&quot;}</code> | <code>horizontalAlignment</code> | SET_PROPS | <code>{}</code> |
| <code>LazyColumn</code> | <code>arrangement</code> | <code>&quot;bottom&quot; &#124; &quot;center&quot; &#124; &quot;spaceAround&quot; &#124; &quot;spaceBetween&quot; &#124; &quot;spaceEvenly&quot; &#124; &quot;top&quot;</code> | false | <code>{&quot;kind&quot;:&quot;ENUM&quot;,&quot;value&quot;:&quot;top&quot;}</code> | <code>verticalArrangement</code> | SET_PROPS | <code>{}</code> |
| <code>LazyColumn</code> | <code>contentPadding</code> | <code>ComposeDpInput &#124; ReadonlyArray&lt;ComposeDpInput&gt;</code> | false | <code>{&quot;kind&quot;:&quot;DP&quot;,&quot;value&quot;:0.0}</code> | - | SET_PROPS | <code>{&quot;listKinds&quot;:[&quot;DP&quot;],&quot;listMaximum&quot;:4,&quot;listMinimum&quot;:1}</code> |
| <code>LazyColumn</code> | <code>reverseLayout</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>LazyColumn</code> | <code>spacing</code> | <code>ComposeDpInput</code> | false | <code>{&quot;kind&quot;:&quot;DP&quot;,&quot;value&quot;:0.0}</code> | - | SET_PROPS | <code>{&quot;minimum&quot;:0.0}</code> |
| <code>LazyColumn</code> | <code>userScrollEnabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>LazyRow</code> | <code>alignment</code> | <code>&quot;bottom&quot; &#124; &quot;center&quot; &#124; &quot;top&quot;</code> | false | <code>{&quot;kind&quot;:&quot;ENUM&quot;,&quot;value&quot;:&quot;top&quot;}</code> | <code>verticalAlignment</code> | SET_PROPS | <code>{}</code> |
| <code>LazyRow</code> | <code>arrangement</code> | <code>&quot;center&quot; &#124; &quot;end&quot; &#124; &quot;spaceAround&quot; &#124; &quot;spaceBetween&quot; &#124; &quot;spaceEvenly&quot; &#124; &quot;start&quot;</code> | false | <code>{&quot;kind&quot;:&quot;ENUM&quot;,&quot;value&quot;:&quot;start&quot;}</code> | <code>horizontalArrangement</code> | SET_PROPS | <code>{}</code> |
| <code>LazyRow</code> | <code>contentPadding</code> | <code>ComposeDpInput &#124; ReadonlyArray&lt;ComposeDpInput&gt;</code> | false | <code>{&quot;kind&quot;:&quot;DP&quot;,&quot;value&quot;:0.0}</code> | - | SET_PROPS | <code>{&quot;listKinds&quot;:[&quot;DP&quot;],&quot;listMaximum&quot;:4,&quot;listMinimum&quot;:1}</code> |
| <code>LazyRow</code> | <code>reverseLayout</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>LazyRow</code> | <code>spacing</code> | <code>ComposeDpInput</code> | false | <code>{&quot;kind&quot;:&quot;DP&quot;,&quot;value&quot;:0.0}</code> | - | SET_PROPS | <code>{&quot;minimum&quot;:0.0}</code> |
| <code>LazyRow</code> | <code>userScrollEnabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>LinearProgressIndicator</code> | <code>color</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>LinearProgressIndicator</code> | <code>progress</code> | <code>null &#124; number</code> | false | <code>{&quot;kind&quot;:&quot;NULL&quot;,&quot;value&quot;:null}</code> | - | SET_PROPS | <code>{&quot;maximum&quot;:1.0,&quot;minimum&quot;:0.0}</code> |
| <code>LinearProgressIndicator</code> | <code>trackColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>OutlinedButton</code> | <code>containerColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>OutlinedButton</code> | <code>contentColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>OutlinedButton</code> | <code>enabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>OutlinedButton</code> | <code>shape</code> | <code>ComposeShapeInput</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>OutlinedTextField</code> | <code>enabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>OutlinedTextField</code> | <code>imeAction</code> | <code>&quot;default&quot; &#124; &quot;done&quot; &#124; &quot;go&quot; &#124; &quot;next&quot; &#124; &quot;none&quot; &#124; &quot;previous&quot; &#124; &quot;search&quot; &#124; &quot;send&quot;</code> | false | <code>{&quot;kind&quot;:&quot;ENUM&quot;,&quot;value&quot;:&quot;default&quot;}</code> | - | SET_PROPS | <code>{}</code> |
| <code>OutlinedTextField</code> | <code>isError</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>OutlinedTextField</code> | <code>keyboardType</code> | <code>&quot;ascii&quot; &#124; &quot;decimal&quot; &#124; &quot;email&quot; &#124; &quot;number&quot; &#124; &quot;numberPassword&quot; &#124; &quot;password&quot; &#124; &quot;phone&quot; &#124; &quot;text&quot; &#124; &quot;uri&quot;</code> | false | <code>{&quot;kind&quot;:&quot;ENUM&quot;,&quot;value&quot;:&quot;text&quot;}</code> | - | SET_PROPS | <code>{}</code> |
| <code>OutlinedTextField</code> | <code>maxLines</code> | <code>number</code> | false | <code>{&quot;kind&quot;:&quot;NUMBER&quot;,&quot;value&quot;:2147483647.0}</code> | - | SET_PROPS | <code>{&quot;integral&quot;:true,&quot;maximum&quot;:2147483647.0,&quot;minimum&quot;:1.0}</code> |
| <code>OutlinedTextField</code> | <code>minLines</code> | <code>number</code> | false | <code>{&quot;kind&quot;:&quot;NUMBER&quot;,&quot;value&quot;:1.0}</code> | - | SET_PROPS | <code>{&quot;integral&quot;:true,&quot;maximum&quot;:2147483647.0,&quot;minimum&quot;:1.0}</code> |
| <code>OutlinedTextField</code> | <code>readOnly</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>OutlinedTextField</code> | <code>singleLine</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>OutlinedTextField</code> | <code>style</code> | <code>&quot;bodyLarge&quot; &#124; &quot;bodyMedium&quot; &#124; &quot;bodySmall&quot; &#124; &quot;displayLarge&quot; &#124; &quot;displayMedium&quot; &#124; &quot;displaySmall&quot; &#124; &quot;headlineLarge&quot; &#124; &quot;headlineMedium&quot; &#124; &quot;headlineSmall&quot; &#124; &quot;labelLarge&quot; &#124; &quot;labelMedium&quot; &#124; &quot;labelSmall&quot; &#124; &quot;titleLarge&quot; &#124; &quot;titleMedium&quot; &#124; &quot;titleSmall&quot; &#124; ComposeTextStyleInput</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>OutlinedTextField</code> | <code>text</code> | <code>string</code> | false | <code>{&quot;kind&quot;:&quot;STRING&quot;,&quot;value&quot;:&quot;&quot;}</code> | <code>value</code> | EDIT_COMMAND | <code>{}</code> |
| <code>OutlinedTextField</code> | <code>visualTransformation</code> | <code>&quot;none&quot; &#124; &quot;password&quot;</code> | false | <code>{&quot;kind&quot;:&quot;ENUM&quot;,&quot;value&quot;:&quot;none&quot;}</code> | - | SET_PROPS | <code>{}</code> |
| <code>RadioButton</code> | <code>checked</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | <code>selected</code> | SET_PROPS | <code>{}</code> |
| <code>RadioButton</code> | <code>enabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>Row</code> | <code>alignment</code> | <code>&quot;bottom&quot; &#124; &quot;center&quot; &#124; &quot;top&quot;</code> | false | <code>{&quot;kind&quot;:&quot;ENUM&quot;,&quot;value&quot;:&quot;top&quot;}</code> | <code>verticalAlignment</code> | SET_PROPS | <code>{}</code> |
| <code>Row</code> | <code>arrangement</code> | <code>&quot;center&quot; &#124; &quot;end&quot; &#124; &quot;spaceAround&quot; &#124; &quot;spaceBetween&quot; &#124; &quot;spaceEvenly&quot; &#124; &quot;start&quot;</code> | false | <code>{&quot;kind&quot;:&quot;ENUM&quot;,&quot;value&quot;:&quot;start&quot;}</code> | <code>horizontalArrangement</code> | SET_PROPS | <code>{}</code> |
| <code>Row</code> | <code>spacing</code> | <code>ComposeDpInput</code> | false | <code>{&quot;kind&quot;:&quot;DP&quot;,&quot;value&quot;:0.0}</code> | - | SET_PROPS | <code>{&quot;minimum&quot;:0.0}</code> |
| <code>Scaffold</code> | <code>containerColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>Scaffold</code> | <code>contentColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>Slider</code> | <code>enabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>Slider</code> | <code>range</code> | <code>readonly [number, number]</code> | false | <code>{&quot;kind&quot;:&quot;LIST&quot;,&quot;value&quot;:[{&quot;kind&quot;:&quot;NUMBER&quot;,&quot;value&quot;:0.0},{&quot;kind&quot;:&quot;NUMBER&quot;,&quot;value&quot;:1.0}]}</code> | - | SET_PROPS | <code>{&quot;listKinds&quot;:[&quot;NUMBER&quot;],&quot;listMaximum&quot;:2,&quot;listMinimum&quot;:2}</code> |
| <code>Slider</code> | <code>steps</code> | <code>number</code> | false | <code>{&quot;kind&quot;:&quot;NUMBER&quot;,&quot;value&quot;:0.0}</code> | - | SET_PROPS | <code>{&quot;integral&quot;:true,&quot;maximum&quot;:2147483647.0,&quot;minimum&quot;:0.0}</code> |
| <code>Slider</code> | <code>value</code> | <code>number</code> | false | <code>{&quot;kind&quot;:&quot;NUMBER&quot;,&quot;value&quot;:0.0}</code> | - | SET_PROPS | <code>{&quot;maximum&quot;:3.4028234663852886e+38,&quot;minimum&quot;:-3.4028234663852886e+38}</code> |
| <code>Snackbar</code> | <code>actionLabel</code> | <code>null &#124; string</code> | false | <code>{&quot;kind&quot;:&quot;NULL&quot;,&quot;value&quot;:null}</code> | - | SET_PROPS | <code>{}</code> |
| <code>Snackbar</code> | <code>duration</code> | <code>&quot;indefinite&quot; &#124; &quot;long&quot; &#124; &quot;short&quot;</code> | false | <code>{&quot;kind&quot;:&quot;ENUM&quot;,&quot;value&quot;:&quot;short&quot;}</code> | - | SET_PROPS | <code>{}</code> |
| <code>Snackbar</code> | <code>message</code> | <code>string</code> | true | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>Surface</code> | <code>color</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>Surface</code> | <code>contentColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>Surface</code> | <code>shape</code> | <code>ComposeShapeInput</code> | false | <code>{&quot;kind&quot;:&quot;SHAPE&quot;,&quot;value&quot;:{&quot;radius&quot;:0.0,&quot;shape&quot;:&quot;RECTANGLE&quot;}}</code> | - | SET_PROPS | <code>{}</code> |
| <code>Surface</code> | <code>tonalElevation</code> | <code>ComposeDpInput</code> | false | <code>{&quot;kind&quot;:&quot;DP&quot;,&quot;value&quot;:0.0}</code> | - | SET_PROPS | <code>{&quot;minimum&quot;:0.0}</code> |
| <code>Switch</code> | <code>checked</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>Switch</code> | <code>enabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>Text</code> | <code>color</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>Text</code> | <code>fontSize</code> | <code>ComposeSpInput</code> | false | unspecified | - | SET_PROPS | <code>{&quot;minimum&quot;:0.0,&quot;minimumExclusive&quot;:true}</code> |
| <code>Text</code> | <code>fontWeight</code> | <code>number</code> | false | unspecified | - | SET_PROPS | <code>{&quot;integral&quot;:true,&quot;maximum&quot;:1000.0,&quot;minimum&quot;:1.0}</code> |
| <code>Text</code> | <code>maxLines</code> | <code>number</code> | false | <code>{&quot;kind&quot;:&quot;NUMBER&quot;,&quot;value&quot;:2147483647.0}</code> | - | SET_PROPS | <code>{&quot;integral&quot;:true,&quot;maximum&quot;:2147483647.0,&quot;minimum&quot;:1.0}</code> |
| <code>Text</code> | <code>overflow</code> | <code>&quot;clip&quot; &#124; &quot;ellipsis&quot; &#124; &quot;visible&quot;</code> | false | <code>{&quot;kind&quot;:&quot;ENUM&quot;,&quot;value&quot;:&quot;clip&quot;}</code> | - | SET_PROPS | <code>{}</code> |
| <code>Text</code> | <code>selectable</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>Text</code> | <code>style</code> | <code>&quot;bodyLarge&quot; &#124; &quot;bodyMedium&quot; &#124; &quot;bodySmall&quot; &#124; &quot;displayLarge&quot; &#124; &quot;displayMedium&quot; &#124; &quot;displaySmall&quot; &#124; &quot;headlineLarge&quot; &#124; &quot;headlineMedium&quot; &#124; &quot;headlineSmall&quot; &#124; &quot;labelLarge&quot; &#124; &quot;labelMedium&quot; &#124; &quot;labelSmall&quot; &#124; &quot;titleLarge&quot; &#124; &quot;titleMedium&quot; &#124; &quot;titleSmall&quot; &#124; ComposeTextStyleInput</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>Text</code> | <code>text</code> | <code>string</code> | false | <code>{&quot;kind&quot;:&quot;STRING&quot;,&quot;value&quot;:&quot;&quot;}</code> | - | SET_PROPS | <code>{}</code> |
| <code>Text</code> | <code>textAlign</code> | <code>&quot;center&quot; &#124; &quot;end&quot; &#124; &quot;justify&quot; &#124; &quot;left&quot; &#124; &quot;right&quot; &#124; &quot;start&quot;</code> | false | <code>{&quot;kind&quot;:&quot;ENUM&quot;,&quot;value&quot;:&quot;start&quot;}</code> | - | SET_PROPS | <code>{}</code> |
| <code>TextButton</code> | <code>containerColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>TextButton</code> | <code>contentColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>TextButton</code> | <code>enabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>TextButton</code> | <code>shape</code> | <code>ComposeShapeInput</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>TextField</code> | <code>enabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>TextField</code> | <code>imeAction</code> | <code>&quot;default&quot; &#124; &quot;done&quot; &#124; &quot;go&quot; &#124; &quot;next&quot; &#124; &quot;none&quot; &#124; &quot;previous&quot; &#124; &quot;search&quot; &#124; &quot;send&quot;</code> | false | <code>{&quot;kind&quot;:&quot;ENUM&quot;,&quot;value&quot;:&quot;default&quot;}</code> | - | SET_PROPS | <code>{}</code> |
| <code>TextField</code> | <code>isError</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>TextField</code> | <code>keyboardType</code> | <code>&quot;ascii&quot; &#124; &quot;decimal&quot; &#124; &quot;email&quot; &#124; &quot;number&quot; &#124; &quot;numberPassword&quot; &#124; &quot;password&quot; &#124; &quot;phone&quot; &#124; &quot;text&quot; &#124; &quot;uri&quot;</code> | false | <code>{&quot;kind&quot;:&quot;ENUM&quot;,&quot;value&quot;:&quot;text&quot;}</code> | - | SET_PROPS | <code>{}</code> |
| <code>TextField</code> | <code>maxLines</code> | <code>number</code> | false | <code>{&quot;kind&quot;:&quot;NUMBER&quot;,&quot;value&quot;:2147483647.0}</code> | - | SET_PROPS | <code>{&quot;integral&quot;:true,&quot;maximum&quot;:2147483647.0,&quot;minimum&quot;:1.0}</code> |
| <code>TextField</code> | <code>minLines</code> | <code>number</code> | false | <code>{&quot;kind&quot;:&quot;NUMBER&quot;,&quot;value&quot;:1.0}</code> | - | SET_PROPS | <code>{&quot;integral&quot;:true,&quot;maximum&quot;:2147483647.0,&quot;minimum&quot;:1.0}</code> |
| <code>TextField</code> | <code>readOnly</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>TextField</code> | <code>singleLine</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>TextField</code> | <code>style</code> | <code>&quot;bodyLarge&quot; &#124; &quot;bodyMedium&quot; &#124; &quot;bodySmall&quot; &#124; &quot;displayLarge&quot; &#124; &quot;displayMedium&quot; &#124; &quot;displaySmall&quot; &#124; &quot;headlineLarge&quot; &#124; &quot;headlineMedium&quot; &#124; &quot;headlineSmall&quot; &#124; &quot;labelLarge&quot; &#124; &quot;labelMedium&quot; &#124; &quot;labelSmall&quot; &#124; &quot;titleLarge&quot; &#124; &quot;titleMedium&quot; &#124; &quot;titleSmall&quot; &#124; ComposeTextStyleInput</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>TextField</code> | <code>text</code> | <code>string</code> | false | <code>{&quot;kind&quot;:&quot;STRING&quot;,&quot;value&quot;:&quot;&quot;}</code> | <code>value</code> | EDIT_COMMAND | <code>{}</code> |
| <code>TextField</code> | <code>visualTransformation</code> | <code>&quot;none&quot; &#124; &quot;password&quot;</code> | false | <code>{&quot;kind&quot;:&quot;ENUM&quot;,&quot;value&quot;:&quot;none&quot;}</code> | - | SET_PROPS | <code>{}</code> |
| <code>TopAppBar</code> | <code>containerColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>TopAppBar</code> | <code>contentColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |

<!-- autojs6-compose-catalog:v1:end -->

## F2 互操作目录

<!-- autojs6-compose-interop:f2:start -->
<!-- Generated from org.autojs.plugin.compose.api.interop.AndroidViewInteropV1; schema=1; contract=1; extension=1; feature=android-view-interop-v1; sha256=cbee120589a49e97f8bf5ea546b508f0a1f8b77b685e8affd8b03da67b838a37. -->

| Component | Children | Slots | Events | Feature |
| --- | --- | --- | --- | --- |
| <code>AndroidView</code> | NONE | - | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | <code>android-view-interop-v1</code> |

| Property | Script input | Getter | Required |
| --- | --- | --- | --- |
| <code>view</code> | <code>View &#124; ((context: android.content.Context) =&gt; View)</code> | <code>View</code> | true |

<!-- autojs6-compose-interop:f2:end -->

## V2 目录生成表

<!-- autojs6-compose-catalog:v2:start -->
<!-- Generated from org.autojs.plugin.compose.api.v2.ComposeUiV2.catalog; schema=1; contract=2; sha256=f46009f6ca2c69cfcbfcfa8f829ec678ffe81e647eb48812db6ee2b2f087f712. -->

| Component | Invocation | Children | Scope | Canonical properties | Slots | Events | Commands |
| --- | --- | --- | --- | --- | --- | --- | --- |
| <code>AssistChip</code> | NODE | NONE | ANY | <code>enabled</code> | <code>label (required)</code>, <code>leadingIcon</code>, <code>trailingIcon</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | <code>blur</code>, <code>focus</code> |
| <code>Badge</code> | NODE | SINGLE | ANY | <code>text</code>, <code>visible</code> | <code>content</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | - |
| <code>DatePicker</code> | NODE | NONE | ANY | <code>displayMode</code>, <code>selectedDateMillis</code>, <code>showModeToggle</code>, <code>yearEnd</code>, <code>yearStart</code> | - | <code>click</code>, <code>dateChange</code>, <code>displayModeChange</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | - |
| <code>DropdownMenu</code> | NODE | MANY | ANY | <code>open</code> | <code>anchor (required)</code> | <code>click</code>, <code>dismissRequest</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | - |
| <code>DropdownMenuItem</code> | NODE | NONE | ANY | <code>enabled</code> | <code>leadingIcon</code>, <code>text (required)</code>, <code>trailingIcon</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | <code>blur</code>, <code>focus</code> |
| <code>FilterChip</code> | NODE | NONE | ANY | <code>enabled</code>, <code>selected</code> | <code>label (required)</code>, <code>leadingIcon</code>, <code>trailingIcon</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code>, <code>selectedChange</code> | <code>blur</code>, <code>focus</code> |
| <code>FloatingActionButton</code> | NODE | MANY | ANY | <code>containerColor</code>, <code>contentColor</code>, <code>shape</code> | <code>content</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | <code>blur</code>, <code>focus</code> |
| <code>HorizontalPager</code> | NODE | LAZY_ITEMS | ANY | <code>page</code>, <code>pageSpacing</code>, <code>userScrollEnabled</code> | - | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>pageChange</code>, <code>scroll</code> | <code>scrollTo</code> |
| <code>InputChip</code> | NODE | NONE | ANY | <code>enabled</code>, <code>selected</code> | <code>label (required)</code>, <code>leadingIcon</code>, <code>trailingIcon</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code>, <code>selectedChange</code> | <code>blur</code>, <code>focus</code> |
| <code>LazyVerticalGrid</code> | NODE | LAZY_ITEMS | ANY | <code>columns</code>, <code>contentPadding</code>, <code>reverseLayout</code>, <code>spacing</code>, <code>userScrollEnabled</code> | - | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | <code>scrollTo</code> |
| <code>ModalBottomSheet</code> | NODE | SINGLE | ANY | <code>cancelable</code>, <code>containerColor</code>, <code>contentColor</code>, <code>open</code>, <code>shape</code> | <code>content</code> | <code>click</code>, <code>dismissRequest</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | - |
| <code>NavigationBar</code> | NODE | MANY | ANY | <code>containerColor</code>, <code>contentColor</code> | - | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | - |
| <code>NavigationBarItem</code> | NODE | NONE | ANY | <code>alwaysShowLabel</code>, <code>enabled</code>, <code>selected</code> | <code>icon (required)</code>, <code>label</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | <code>blur</code>, <code>focus</code> |
| <code>NavigationDrawer</code> | NODE | SINGLE | ANY | <code>gesturesEnabled</code>, <code>open</code> | <code>content</code>, <code>drawerContent (required)</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>openChange</code>, <code>scroll</code> | - |
| <code>NavigationDrawerItem</code> | NODE | NONE | ANY | <code>enabled</code>, <code>selected</code> | <code>badge</code>, <code>icon</code>, <code>label (required)</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | <code>blur</code>, <code>focus</code> |
| <code>NavigationRail</code> | NODE | MANY | ANY | <code>containerColor</code>, <code>contentColor</code> | <code>header</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | - |
| <code>NavigationRailItem</code> | NODE | NONE | ANY | <code>alwaysShowLabel</code>, <code>enabled</code>, <code>selected</code> | <code>icon (required)</code>, <code>label</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | <code>blur</code>, <code>focus</code> |
| <code>PullToRefresh</code> | NODE | SINGLE | ANY | <code>enabled</code>, <code>refreshing</code> | <code>content</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>refresh</code>, <code>scroll</code> | - |
| <code>SearchBar</code> | NODE | MANY | ANY | <code>enabled</code>, <code>expanded</code>, <code>query</code> | <code>content</code>, <code>leadingIcon</code>, <code>placeholder</code>, <code>trailingIcon</code> | <code>click</code>, <code>expandedChange</code>, <code>focusChange</code>, <code>longClick</code>, <code>queryChange</code>, <code>scroll</code>, <code>search</code> | <code>blur</code>, <code>focus</code> |
| <code>SegmentedButton</code> | NODE | MANY | ANY | <code>mode</code> | - | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | - |
| <code>SegmentedButtonItem</code> | NODE | NONE | ANY | <code>enabled</code>, <code>selected</code> | <code>icon</code>, <code>label (required)</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code>, <code>selectedChange</code> | <code>blur</code>, <code>focus</code> |
| <code>Tab</code> | NODE | NONE | ANY | <code>enabled</code> | <code>icon</code>, <code>text</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | <code>blur</code>, <code>focus</code> |
| <code>TabRow</code> | NODE | MANY | ANY | <code>containerColor</code>, <code>contentColor</code>, <code>scrollable</code>, <code>selectedIndex</code> | - | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code> | - |
| <code>TimePicker</code> | NODE | NONE | ANY | <code>displayMode</code>, <code>hour</code>, <code>is24Hour</code>, <code>minute</code> | - | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>scroll</code>, <code>timeChange</code> | - |
| <code>Tooltip</code> | NODE | SINGLE | ANY | <code>open</code> | <code>content</code>, <code>tooltip (required)</code> | <code>click</code>, <code>focusChange</code>, <code>longClick</code>, <code>openChange</code>, <code>scroll</code> | - |

| Component | Property | TypeScript input type | Required | Default (wire value) | Aliases | Update | Constraints |
| --- | --- | --- | --- | --- | --- | --- | --- |
| <code>AssistChip</code> | <code>enabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>Badge</code> | <code>text</code> | <code>string</code> | false | <code>{&quot;kind&quot;:&quot;STRING&quot;,&quot;value&quot;:&quot;&quot;}</code> | - | SET_PROPS | <code>{}</code> |
| <code>Badge</code> | <code>visible</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>DatePicker</code> | <code>displayMode</code> | <code>&quot;input&quot; &#124; &quot;picker&quot;</code> | false | <code>{&quot;kind&quot;:&quot;ENUM&quot;,&quot;value&quot;:&quot;picker&quot;}</code> | - | SET_PROPS | <code>{}</code> |
| <code>DatePicker</code> | <code>selectedDateMillis</code> | <code>null &#124; number</code> | false | <code>{&quot;kind&quot;:&quot;NULL&quot;,&quot;value&quot;:null}</code> | - | SET_PROPS | <code>{&quot;integral&quot;:true,&quot;maximum&quot;:253402214400000.0,&quot;minimum&quot;:-12212553600000.0}</code> |
| <code>DatePicker</code> | <code>showModeToggle</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>DatePicker</code> | <code>yearEnd</code> | <code>number</code> | false | <code>{&quot;kind&quot;:&quot;NUMBER&quot;,&quot;value&quot;:2100.0}</code> | - | SET_PROPS | <code>{&quot;integral&quot;:true,&quot;maximum&quot;:9999.0,&quot;minimum&quot;:1583.0}</code> |
| <code>DatePicker</code> | <code>yearStart</code> | <code>number</code> | false | <code>{&quot;kind&quot;:&quot;NUMBER&quot;,&quot;value&quot;:1900.0}</code> | - | SET_PROPS | <code>{&quot;integral&quot;:true,&quot;maximum&quot;:9999.0,&quot;minimum&quot;:1583.0}</code> |
| <code>DropdownMenu</code> | <code>open</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>DropdownMenuItem</code> | <code>enabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>FilterChip</code> | <code>enabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>FilterChip</code> | <code>selected</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>FloatingActionButton</code> | <code>containerColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>FloatingActionButton</code> | <code>contentColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>FloatingActionButton</code> | <code>shape</code> | <code>ComposeShapeInput</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>HorizontalPager</code> | <code>page</code> | <code>number</code> | false | <code>{&quot;kind&quot;:&quot;NUMBER&quot;,&quot;value&quot;:0.0}</code> | - | SET_PROPS | <code>{&quot;integral&quot;:true,&quot;maximum&quot;:2147483647.0,&quot;minimum&quot;:0.0}</code> |
| <code>HorizontalPager</code> | <code>pageSpacing</code> | <code>ComposeDpInput</code> | false | <code>{&quot;kind&quot;:&quot;DP&quot;,&quot;value&quot;:0.0}</code> | - | SET_PROPS | <code>{&quot;minimum&quot;:0.0}</code> |
| <code>HorizontalPager</code> | <code>userScrollEnabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>InputChip</code> | <code>enabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>InputChip</code> | <code>selected</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>LazyVerticalGrid</code> | <code>columns</code> | <code>number</code> | false | <code>{&quot;kind&quot;:&quot;NUMBER&quot;,&quot;value&quot;:2.0}</code> | - | SET_PROPS | <code>{&quot;integral&quot;:true,&quot;maximum&quot;:64.0,&quot;minimum&quot;:1.0}</code> |
| <code>LazyVerticalGrid</code> | <code>contentPadding</code> | <code>ComposeDpInput &#124; ReadonlyArray&lt;ComposeDpInput&gt;</code> | false | <code>{&quot;kind&quot;:&quot;DP&quot;,&quot;value&quot;:0.0}</code> | - | SET_PROPS | <code>{&quot;listKinds&quot;:[&quot;DP&quot;],&quot;listMaximum&quot;:4,&quot;listMinimum&quot;:1}</code> |
| <code>LazyVerticalGrid</code> | <code>reverseLayout</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>LazyVerticalGrid</code> | <code>spacing</code> | <code>ComposeDpInput</code> | false | <code>{&quot;kind&quot;:&quot;DP&quot;,&quot;value&quot;:0.0}</code> | - | SET_PROPS | <code>{&quot;minimum&quot;:0.0}</code> |
| <code>LazyVerticalGrid</code> | <code>userScrollEnabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>ModalBottomSheet</code> | <code>cancelable</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>ModalBottomSheet</code> | <code>containerColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>ModalBottomSheet</code> | <code>contentColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>ModalBottomSheet</code> | <code>open</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>ModalBottomSheet</code> | <code>shape</code> | <code>ComposeShapeInput</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>NavigationBar</code> | <code>containerColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>NavigationBar</code> | <code>contentColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>NavigationBarItem</code> | <code>alwaysShowLabel</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>NavigationBarItem</code> | <code>enabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>NavigationBarItem</code> | <code>selected</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>NavigationDrawer</code> | <code>gesturesEnabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>NavigationDrawer</code> | <code>open</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>NavigationDrawerItem</code> | <code>enabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>NavigationDrawerItem</code> | <code>selected</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>NavigationRail</code> | <code>containerColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>NavigationRail</code> | <code>contentColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>NavigationRailItem</code> | <code>alwaysShowLabel</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>NavigationRailItem</code> | <code>enabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>NavigationRailItem</code> | <code>selected</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>PullToRefresh</code> | <code>enabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>PullToRefresh</code> | <code>refreshing</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>SearchBar</code> | <code>enabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>SearchBar</code> | <code>expanded</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>SearchBar</code> | <code>query</code> | <code>string</code> | false | <code>{&quot;kind&quot;:&quot;STRING&quot;,&quot;value&quot;:&quot;&quot;}</code> | - | SET_PROPS | <code>{}</code> |
| <code>SegmentedButton</code> | <code>mode</code> | <code>&quot;multi&quot; &#124; &quot;single&quot;</code> | false | <code>{&quot;kind&quot;:&quot;ENUM&quot;,&quot;value&quot;:&quot;single&quot;}</code> | - | SET_PROPS | <code>{}</code> |
| <code>SegmentedButtonItem</code> | <code>enabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>SegmentedButtonItem</code> | <code>selected</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>Tab</code> | <code>enabled</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>TabRow</code> | <code>containerColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>TabRow</code> | <code>contentColor</code> | <code>ComposeColorInput &#124; null</code> | false | unspecified | - | SET_PROPS | <code>{}</code> |
| <code>TabRow</code> | <code>scrollable</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |
| <code>TabRow</code> | <code>selectedIndex</code> | <code>number</code> | false | <code>{&quot;kind&quot;:&quot;NUMBER&quot;,&quot;value&quot;:0.0}</code> | - | SET_PROPS | <code>{&quot;integral&quot;:true,&quot;maximum&quot;:2147483647.0,&quot;minimum&quot;:0.0}</code> |
| <code>TimePicker</code> | <code>displayMode</code> | <code>&quot;input&quot; &#124; &quot;picker&quot;</code> | false | <code>{&quot;kind&quot;:&quot;ENUM&quot;,&quot;value&quot;:&quot;picker&quot;}</code> | - | SET_PROPS | <code>{}</code> |
| <code>TimePicker</code> | <code>hour</code> | <code>number</code> | false | <code>{&quot;kind&quot;:&quot;NUMBER&quot;,&quot;value&quot;:0.0}</code> | - | SET_PROPS | <code>{&quot;integral&quot;:true,&quot;maximum&quot;:23.0,&quot;minimum&quot;:0.0}</code> |
| <code>TimePicker</code> | <code>is24Hour</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:true}</code> | - | SET_PROPS | <code>{}</code> |
| <code>TimePicker</code> | <code>minute</code> | <code>number</code> | false | <code>{&quot;kind&quot;:&quot;NUMBER&quot;,&quot;value&quot;:0.0}</code> | - | SET_PROPS | <code>{&quot;integral&quot;:true,&quot;maximum&quot;:59.0,&quot;minimum&quot;:0.0}</code> |
| <code>Tooltip</code> | <code>open</code> | <code>boolean</code> | false | <code>{&quot;kind&quot;:&quot;BOOLEAN&quot;,&quot;value&quot;:false}</code> | - | SET_PROPS | <code>{}</code> |

| Component | Event | Callback arguments |
| --- | --- | --- |
| <code>AssistChip</code> | <code>click</code> | <code>none</code> |
| <code>AssistChip</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>AssistChip</code> | <code>longClick</code> | <code>none</code> |
| <code>AssistChip</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>Badge</code> | <code>click</code> | <code>none</code> |
| <code>Badge</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>Badge</code> | <code>longClick</code> | <code>none</code> |
| <code>Badge</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>DatePicker</code> | <code>click</code> | <code>none</code> |
| <code>DatePicker</code> | <code>dateChange</code> | <code>selectedDateMillis: LONG &#124; null</code> |
| <code>DatePicker</code> | <code>displayModeChange</code> | <code>displayMode: STRING</code> |
| <code>DatePicker</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>DatePicker</code> | <code>longClick</code> | <code>none</code> |
| <code>DatePicker</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>DropdownMenu</code> | <code>click</code> | <code>none</code> |
| <code>DropdownMenu</code> | <code>dismissRequest</code> | <code>none</code> |
| <code>DropdownMenu</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>DropdownMenu</code> | <code>longClick</code> | <code>none</code> |
| <code>DropdownMenu</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>DropdownMenuItem</code> | <code>click</code> | <code>none</code> |
| <code>DropdownMenuItem</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>DropdownMenuItem</code> | <code>longClick</code> | <code>none</code> |
| <code>DropdownMenuItem</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>FilterChip</code> | <code>click</code> | <code>none</code> |
| <code>FilterChip</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>FilterChip</code> | <code>longClick</code> | <code>none</code> |
| <code>FilterChip</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>FilterChip</code> | <code>selectedChange</code> | <code>selected: BOOLEAN</code> |
| <code>FloatingActionButton</code> | <code>click</code> | <code>none</code> |
| <code>FloatingActionButton</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>FloatingActionButton</code> | <code>longClick</code> | <code>none</code> |
| <code>FloatingActionButton</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>HorizontalPager</code> | <code>click</code> | <code>none</code> |
| <code>HorizontalPager</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>HorizontalPager</code> | <code>longClick</code> | <code>none</code> |
| <code>HorizontalPager</code> | <code>pageChange</code> | <code>page: INTEGER</code> |
| <code>HorizontalPager</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>InputChip</code> | <code>click</code> | <code>none</code> |
| <code>InputChip</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>InputChip</code> | <code>longClick</code> | <code>none</code> |
| <code>InputChip</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>InputChip</code> | <code>selectedChange</code> | <code>selected: BOOLEAN</code> |
| <code>LazyVerticalGrid</code> | <code>click</code> | <code>none</code> |
| <code>LazyVerticalGrid</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>LazyVerticalGrid</code> | <code>longClick</code> | <code>none</code> |
| <code>LazyVerticalGrid</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>ModalBottomSheet</code> | <code>click</code> | <code>none</code> |
| <code>ModalBottomSheet</code> | <code>dismissRequest</code> | <code>none</code> |
| <code>ModalBottomSheet</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>ModalBottomSheet</code> | <code>longClick</code> | <code>none</code> |
| <code>ModalBottomSheet</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>NavigationBar</code> | <code>click</code> | <code>none</code> |
| <code>NavigationBar</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>NavigationBar</code> | <code>longClick</code> | <code>none</code> |
| <code>NavigationBar</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>NavigationBarItem</code> | <code>click</code> | <code>none</code> |
| <code>NavigationBarItem</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>NavigationBarItem</code> | <code>longClick</code> | <code>none</code> |
| <code>NavigationBarItem</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>NavigationDrawer</code> | <code>click</code> | <code>none</code> |
| <code>NavigationDrawer</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>NavigationDrawer</code> | <code>longClick</code> | <code>none</code> |
| <code>NavigationDrawer</code> | <code>openChange</code> | <code>open: BOOLEAN</code> |
| <code>NavigationDrawer</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>NavigationDrawerItem</code> | <code>click</code> | <code>none</code> |
| <code>NavigationDrawerItem</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>NavigationDrawerItem</code> | <code>longClick</code> | <code>none</code> |
| <code>NavigationDrawerItem</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>NavigationRail</code> | <code>click</code> | <code>none</code> |
| <code>NavigationRail</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>NavigationRail</code> | <code>longClick</code> | <code>none</code> |
| <code>NavigationRail</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>NavigationRailItem</code> | <code>click</code> | <code>none</code> |
| <code>NavigationRailItem</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>NavigationRailItem</code> | <code>longClick</code> | <code>none</code> |
| <code>NavigationRailItem</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>PullToRefresh</code> | <code>click</code> | <code>none</code> |
| <code>PullToRefresh</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>PullToRefresh</code> | <code>longClick</code> | <code>none</code> |
| <code>PullToRefresh</code> | <code>refresh</code> | <code>none</code> |
| <code>PullToRefresh</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>SearchBar</code> | <code>click</code> | <code>none</code> |
| <code>SearchBar</code> | <code>expandedChange</code> | <code>expanded: BOOLEAN</code> |
| <code>SearchBar</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>SearchBar</code> | <code>longClick</code> | <code>none</code> |
| <code>SearchBar</code> | <code>queryChange</code> | <code>text: STRING</code> |
| <code>SearchBar</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>SearchBar</code> | <code>search</code> | <code>text: STRING</code> |
| <code>SegmentedButton</code> | <code>click</code> | <code>none</code> |
| <code>SegmentedButton</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>SegmentedButton</code> | <code>longClick</code> | <code>none</code> |
| <code>SegmentedButton</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>SegmentedButtonItem</code> | <code>click</code> | <code>none</code> |
| <code>SegmentedButtonItem</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>SegmentedButtonItem</code> | <code>longClick</code> | <code>none</code> |
| <code>SegmentedButtonItem</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>SegmentedButtonItem</code> | <code>selectedChange</code> | <code>selected: BOOLEAN</code> |
| <code>Tab</code> | <code>click</code> | <code>none</code> |
| <code>Tab</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>Tab</code> | <code>longClick</code> | <code>none</code> |
| <code>Tab</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>TabRow</code> | <code>click</code> | <code>none</code> |
| <code>TabRow</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>TabRow</code> | <code>longClick</code> | <code>none</code> |
| <code>TabRow</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>TimePicker</code> | <code>click</code> | <code>none</code> |
| <code>TimePicker</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>TimePicker</code> | <code>longClick</code> | <code>none</code> |
| <code>TimePicker</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |
| <code>TimePicker</code> | <code>timeChange</code> | <code>hour: INTEGER, minute: INTEGER</code> |
| <code>Tooltip</code> | <code>click</code> | <code>none</code> |
| <code>Tooltip</code> | <code>focusChange</code> | <code>focused: BOOLEAN</code> |
| <code>Tooltip</code> | <code>longClick</code> | <code>none</code> |
| <code>Tooltip</code> | <code>openChange</code> | <code>open: BOOLEAN</code> |
| <code>Tooltip</code> | <code>scroll</code> | <code>firstVisibleIndex: INTEGER &#124; null, offset: INTEGER</code> |

<!-- autojs6-compose-catalog:v2:end -->
