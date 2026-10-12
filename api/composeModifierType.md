# ComposeModifier - Compose 修饰链

ComposeModifier 由 [compose.modifier](compose#m-modifier) 创建, 用于描述节点的尺寸, 留白, 绘制, 交互和无障碍信息. 它不是 Android View, 也不是 Kotlin Modifier 对象. 当前 20 个方法均返回一条新的修饰链, 原链不会改变.

本页适用于配套 AutoJs6 6.8.0 本地构建与已安装, 启用的 3-Block Compose 插件. 组件目录见 [Compose 组件](composeComponents).

```js
'ui';

let base = compose.modifier().padding(12);
let colored = base.background('#E8DEF8');

compose.mount(compose.Column({ spacing: 8 },
    compose.Text({ text: '只有留白', modifier: base }),
    compose.Text({ text: '留白和背景', modifier: colored })));
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">ComposeModifier</p>

## 链的顺序与作用域

- 方法按调用顺序追加. `padding(16).background(color)` 与 `background(color).padding(16)` 的绘制区域不同.
- 没有对原链的原地修改. `chain.padding(8);` 不会改变 `chain`; 需要使用返回值, 如 `chain = chain.padding(8)`.
- 一条链可以给多个节点复用, 但 `weight` / `align` 必须满足每个节点的直接父组件作用域.
- `weight` 仅用于直接位于 `Column` 或 `Row` 下的节点. `align` 仅用于直接位于 `Box` 下的节点.
- `Card`, `Button`, `Surface`, `LazyColumn`, `Scaffold` 等内部使用的 Row/Column/Box 不是脚本可继承的作用域. 需要时在它们内部显式放置一个 `Column`, `Row` 或 `Box`.
- 尺寸数值按 dp 解释, 也可写成 `'16dp'`. 不接受 `'16px'`, `'50%'`, `'wrap_content'` 或 `'*'`. 字体大小使用 sp, 由组件属性控制.
- 每个节点最多 64 个修饰操作, 包含快捷属性展开的操作. 超限为 `LIMIT_EXCEEDED`; 无效参数或作用域会得到 `ComposeError`.

```js
'ui';

compose.mount(compose.Row({ modifier: compose.modifier().fillMaxWidth() },
    compose.Text({ text: '1 份', modifier: compose.modifier().weight(1) }),
    compose.Text({ text: '2 份', modifier: compose.modifier().weight(2) })));
```

## 快捷属性

所有节点支持下列快捷属性. 它们展开为修饰操作, 然后才执行显式 `modifier` 链. 固定顺序与对象属性书写顺序无关:

`w -> h -> padding -> bg -> weight -> alpha -> testTag -> contentDescription -> modifier`

| 快捷属性 | 等价操作 | 输入 |
| --- | --- | --- |
| `w` | `width(value)` | 非负 dp |
| `h` | `height(value)` | 非负 dp |
| `padding` | `padding(...)` | 一个 dp, 或长度为 1 / 2 / 4 的 dp 数组 |
| `bg` | `background(color)` | [ComposeColorInput](composeComponents#composecolorinput), 不接受 null |
| `weight` | `weight(value)` | 大于 0 的有限数, 默认 `fill: true`, 仍需 Column/Row 父作用域 |
| `alpha` | `alpha(value)` | 0 到 1 |
| `testTag` | `testTag(value)` | 字符串 |
| `contentDescription` | `semantics(value)` | 字符串或 null |

例如 `{ bg: '#FFFFFF', padding: 8, modifier: compose.modifier().border(1, '#000000') }` 始终先留白, 再背景, 再边框. 若要求背景覆盖留白区域, 可只用显式链 `background('#FFFFFF').padding(8).border(1, '#000000')`.

快捷属性与显式链中同名操作会依次保留, 不按名称互相替换. `padding: [8, 16]` 是水平 8 dp, 垂直 16 dp; 四项顺序为 start, top, end, bottom, 不是 CSS 的 top, right, bottom, left.

## 方法目录

以下方法均返回 [ComposeModifier](composeModifierType) 新链. 省略可选参数与显式传入 null/undefined 不等价; 除 `semantics(null)` 外, 应省略未使用的参数.

### [m] padding

#### padding(all)

**`Overload 1/3`**

- **all** { [ComposeDpInput](composeComponents#composedpinput) } - 四边非负留白.
- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) }

#### padding(horizontal, vertical)

**`Overload 2/3`**

- **horizontal** { [ComposeDpInput](composeComponents#composedpinput) } - start/end 留白.
- **vertical** { [ComposeDpInput](composeComponents#composedpinput) } - top/bottom 留白.
- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) }

#### padding(start, top, end, bottom)

**`Overload 3/3`**

- **start** { [ComposeDpInput](composeComponents#composedpinput) }
- **top** { [ComposeDpInput](composeComponents#composedpinput) }
- **end** { [ComposeDpInput](composeComponents#composedpinput) }
- **bottom** { [ComposeDpInput](composeComponents#composedpinput) }
- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) }

全部留白必须非负. start/end 随布局方向解释. 不支持三个参数或把数组直接作为此方法的一个参数; 数组形式仅用于 `padding` 快捷属性.

### [m] size

#### size(size)

**`Overload 1/2`**

- **size** { [ComposeDpInput](composeComponents#composedpinput) } - 非负宽高.
- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) }

#### size(width, height)

**`Overload 2/2`**

- **width** { [ComposeDpInput](composeComponents#composedpinput) } - 非负宽度.
- **height** { [ComposeDpInput](composeComponents#composedpinput) } - 非负高度.
- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) }

### [m] width

#### width(width)

- **width** { [ComposeDpInput](composeComponents#composedpinput) } - 非负宽度.
- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) }

### [m] height

#### height(height)

- **height** { [ComposeDpInput](composeComponents#composedpinput) } - 非负高度.
- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) }

`size` / `width` / `height` 仍受到父布局的测量约束, 不会强制突破父容器可用空间.

### [m] fillMaxWidth

#### fillMaxWidth(fraction?)

- **[ fraction = 1 ]** { [number](dataTypes#number) } - 可用宽度比例, 0 到 1.
- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) }

### [m] fillMaxHeight

#### fillMaxHeight(fraction?)

- **[ fraction = 1 ]** { [number](dataTypes#number) } - 可用高度比例, 0 到 1.
- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) }

### [m] fillMaxSize

#### fillMaxSize(fraction?)

- **[ fraction = 1 ]** { [number](dataTypes#number) } - 可用宽高比例, 0 到 1.
- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) }

### [m] weight

#### weight(weight, fill?)

- **weight** { [number](dataTypes#number) } - 大于 0 的有限权重.
- **[ fill = true ]** { [boolean](dataTypes#boolean) } - 是否填满分配到的空间.
- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) }

在 Row 中分配剩余宽度, 在 Column 中分配剩余高度. 仅直接 Column/Row 子节点可用. 不是百分比尺寸, 也不能直接用在 LazyColumn 的 item 上.

### [m] align

#### align(alignment)

- **alignment** { [string](dataTypes#string) } - Box 内对齐位置.
- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) }

仅直接 Box 子节点可用. 取值为 `topStart`, `topCenter`, `topEnd`, `centerStart`, `center`, `centerEnd`, `bottomStart`, `bottomCenter`, `bottomEnd`.

### [m] background

#### background(color, shape?)

- **color** { [ComposeColorInput](composeComponents#composecolorinput) }
- **[ shape = 'rectangle' ]** { [ComposeShapeInput](composeComponents#composeshapeinput) }
- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) }

按指定形状绘制背景. 这不自动裁剪子内容; 需要裁剪时另用 `clip`.

### [m] border

#### border(width, color, shape?)

- **width** { [ComposeDpInput](composeComponents#composedpinput) } - 非负边框宽度.
- **color** { [ComposeColorInput](composeComponents#composecolorinput) }
- **[ shape = 'rectangle' ]** { [ComposeShapeInput](composeComponents#composeshapeinput) }
- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) }

### [m] clip

#### clip(shape)

- **shape** { [ComposeShapeInput](composeComponents#composeshapeinput) }
- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) }

### [m] alpha

#### alpha(alpha)

- **alpha** { [number](dataTypes#number) } - 0 到 1, 0 为全透明, 1 为不额外降低不透明度.
- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) }

### [m] clickable

#### clickable(callback, enabled?)

- **callback** { [Function](dataTypes#function) } - 无参数点击回调; 普通函数的 `this` 是当前节点.
- **[ enabled = true ]** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) }

事件排队回到脚本所属线程, 回调返回值不用于消费原生事件. 对于自身有原生点击动作的组件, 优先使用节点 `onClick`; 无该回调时, 渲染器可使用最后一个已启用的 clickable 作为其激活动作. 组件提供 `enabled` 属性时, `enabled: false` 也会禁用修饰链的点击.

### [m] verticalScroll

#### verticalScroll(enabled?)

- **[ enabled = true ]** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) }

### [m] horizontalScroll

#### horizontalScroll(enabled?)

- **[ enabled = true ]** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) }

为普通节点增加滚动容器. 父布局须提供有限的可视尺寸; 不要在同一方向再套没有有限尺寸约束的 LazyColumn/LazyRow. 挂载后可经节点 `scrollTo({ offset: 120 })` 请求绝对滚动偏移, 单位为物理像素. 若同链包含多个滚动操作, offset 命令作用于最外层, 即第一个滚动操作.

普通滚动的 `onScroll(firstVisibleIndex, offset)` 第一参为 null, 第二参为 px 偏移; LazyColumn/LazyRow 则提供数字索引. 默认不会仅因首次挂载触发初始 scroll 回调.

### [m] offset

#### offset(x, y)

- **x** { [ComposeDpInput](composeComponents#composedpinput) } - 水平偏移, 可为负数.
- **y** { [ComposeDpInput](composeComponents#composedpinput) } - 垂直偏移, 可为负数.
- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) }

偏移绘制/放置位置, 不等于增加 margin. 水平方向遵循布局方向.

### [m] aspectRatio

#### aspectRatio(ratio)

- **ratio** { [number](dataTypes#number) } - 大于 0 的有限宽高比, 如 `16 / 9`.
- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) }

### [m] testTag

#### testTag(tag)

- **tag** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) }

为当前节点添加语义标签. 它按原字符串暴露为无障碍节点 ID, 不自动增加包名前缀. 参阅 [无障碍与选择器](compose#无障碍与选择器).

### [m] semantics

#### semantics(contentDescription)

- **contentDescription** { [string](dataTypes#string) | [null](dataTypes#null) }
- <ins>**returns**</ins> { [ComposeModifier](composeModifierType) }

为节点添加无障碍内容描述; null 表示此操作不增加描述. 该方法接受字符串, 不接受 `{ contentDescription: ... }` 对象. 重复 semantics 操作按链顺序保留, null 不表示清除整条链前面已经设置的描述.
