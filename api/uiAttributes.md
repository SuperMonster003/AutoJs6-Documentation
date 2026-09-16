# UI 布局属性 (UI Attributes)

本页列出 AutoJs6 动态布局器支持的布局标签属性. 属性实现来自 `core/ui/attribute`, `core/ui/inflater` 和 `core/ui/xml`, 适用于 [UI](ui) 及其他复用同一动态布局器的布局 API.

属性按 Android 视图继承关系叠加. 例如 `<checkbox>` 同时具有 View, TextView, CompoundButton 和 CheckBox 对应的属性. 本页各控件表只列出相对于父类新增的属性.

## 应用规则

- 属性名称区分大小写.
- 括号内名称为等效别名, 如 `background` (`bg`).
- 未注册的属性会被忽略, 不会交给 Android 平台自动处理.
- [明确不支持的属性](#明确不支持的属性) 会抛出 `UnsupportedOperationException`.
- 属性处理器保存最近一次应用的原始字符串. `view.attr(name)` 返回该字符串, 不一定是视图的实时 Android 属性值.
- 同一属性的多个别名共享保存值和 setter.
- 自定义控件通过 `ui.Widget#defineAttr` 注册的属性优先于根视图属性.

完整类名标签会选择该类或其最近已注册父类的属性处理器. 因此 `<android.widget.TextView>` 可使用 TextView 属性, 但一个没有专用处理器的第三方 `ViewGroup` 通常只能使用 View 和 ViewGroup 属性.

## 属性值格式

### 布尔值

布尔属性使用字符串 `true` 或 `false`. Kotlin `String.toBoolean()` 仅将不区分大小写的 `true` 解析为真, 其他字符串均解析为假.

### 数字

整数和浮点数属性分别使用十进制整数或浮点数字符串. 无法由 `toInt`, `toLong` 或 `toFloat` 解析时会抛出异常.

### 尺寸

尺寸支持以下单位:

| 单位 | 含义 |
| --- | --- |
| `px` | 像素 |
| `dp`, `dip` | 密度无关像素 |
| `sp` | 字体缩放像素 |
| `pt` | 磅 |
| `in` | 英寸 |
| `mm` | 毫米 |

未写单位时按 `dp` 解析. `?attrName` 可读取当前主题中的尺寸属性.

`width` 和 `height` 另外接受 `wrap_content`, `match_parent` 和 `fill_parent`. 在 AutoJs6 简写转换模式中, `w` 或 `h` 的值 `auto` 转换为 `wrap_content`, `*` 转换为 `match_parent`.

宽高还可使用百分比, 如 `w="50%"`. 只有渲染时传入父视图且父视图已有测量尺寸时才可计算, 否则百分比无法可靠使用.

`padding`, `layout_margin` 和 `contentPadding` 等四边属性使用:

- 1 个值 - 四边相同.
- 2 个值 - 第 1 个用于 left 和 right, 第 2 个用于 top 和 bottom.
- 4 个值 - 依次为 left, top, right, bottom.

当前底层数组解析器没有完整定义 3 个值的语义, 不应使用 3 值形式.

### 多值

多数枚举组合和数组属性使用 `|`, `,`, `;`, `/` 或空白分隔. 具体属性可能只接受其中一种分隔方式:

- `gravity`, `scrollbars` 和 `requiresFadingEdge` 只使用 `|`.
- `spinner.entries` 和 `tint` 等控件实现按各自规则解析.
- `@color/name` 等资源引用中的 `/` 会作为资源引用的一部分保留.

### Gravity

Gravity 可使用以下值并以 `|` 组合:

`left`, `start`, `textStart`, `top`, `right`, `end`, `textEnd`, `bottom`, `center_horizontal`, `center_vertical`, `center`.

### 颜色

颜色属性接受 [OmniColor](omniTypes#omnicolor) 可解析的字符串, 包括十六进制颜色, 命名颜色和颜色资源. 状态颜色属性通常接受单个颜色或由分隔符组成的颜色列表.

### Drawable

Drawable 属性可使用:

- `#...` 或 `@color/...` 颜色.
- `?attrName` 主题 Drawable.
- 应用 Drawable 资源名称.
- `file://...` 或存在的本地文件路径.
- 可由 AutoJs6 颜色工具解析的命名颜色.

`background` 另外支持 `http://` 和 `https://` 图片. `ImageView` 的 `src` 支持网络 URL 和 `data:...;base64,...`; `path` 优先按本地路径处理; `url` 会把没有协议的值补为 `http://`.

### ID, 字符串和样式

- ID 可写为 `name`, `@id/name` 或 `@+id/name`.
- 字符串属性可写为普通文本或 `@string/name`.
- `style` 可写为 `name` 或 `@style/name`, 仅查找 AutoJs6 应用资源.
- `videoPath` 支持本地文件或 `@raw/name`.
- 动画资源可写为 `@anim/name` 或 `@android:anim/name`.

## AutoJs6 简写转换

下列名称由 `XmlConverter` 在简写模式中转换. 强制保留原 XML 时, 应改用目标名称.

| 简写 | 目标 |
| --- | --- |
| `w`, `h` | `width`, `height` |
| `size` | `textSize` |
| `margin` | `layout_margin` |
| `marginLeft`, `marginRight`, `marginTop`, `marginBottom` | 对应 `layout_margin...` |
| `marginStart`, `marginEnd` | 对应 `layout_margin...` |
| `marginVertical`, `marginHorizontal` | 对应 `layout_margin...` |
| `align` | `layout_gravity` |
| `alignParentBottom`, `alignParentTop`, `alignParentLeft`, `alignParentStart`, `alignParentRight`, `alignParentEnd` | 对应 `layout_...` 相对布局规则 |
| `centerHorizontal`, `centerVertical`, `centerInParent` | 对应 `layout_...` 相对布局规则 |
| `below`, `above`, `toLeftOf`, `toRightOf` | 对应 `layout_...` 相对布局规则 |
| `alignBottom`, `alignTop`, `alignLeft`, `alignStart`, `alignRight`, `alignEnd` | 对应 `layout_...` 相对布局规则 |
| `vertical="true"` | `orientation="vertical"` |
| `vertical="false"` | `orientation="horizontal"` |

## View 属性

以下属性适用于所有视图.

### 标识与尺寸

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `id` | ID | 视图 ID |
| `width` (`w`, `layout_width`, `layoutWidth`) | 尺寸或布局尺寸 | 视图宽度 |
| `height` (`h`, `layout_height`, `layoutHeight`) | 尺寸或布局尺寸 | 视图高度 |
| `minWidth` | 尺寸 | 最小宽度 |
| `minHeight` | 尺寸 | 最小高度 |
| `tag` | 字符串 | Android View tag |
| `contentDescription` | 字符串 | 无障碍内容描述 |

### 父布局参数

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `layout_gravity` (`layoutGravity`) | Gravity | 视图在父布局中的位置. 支持 LinearLayout, FrameLayout 及具有 `gravity` 布局参数字段的父布局 |
| `layout_weight` (`layoutWeight`) | 浮点数 | LinearLayout 权重 |
| `layout_margin` (`layoutMargin`) | 尺寸列表 | 外边距 |
| `layout_marginLeft` (`layoutMarginLeft`) | 尺寸 | 左外边距 |
| `layout_marginRight` (`layoutMarginRight`) | 尺寸 | 右外边距 |
| `layout_marginTop` (`layoutMarginTop`) | 尺寸 | 上外边距 |
| `layout_marginBottom` (`layoutMarginBottom`) | 尺寸 | 下外边距 |
| `layout_marginStart` (`layoutMarginStart`) | 尺寸 | 起始外边距 |
| `layout_marginEnd` (`layoutMarginEnd`) | 尺寸 | 结束外边距 |
| `layout_marginVertical` (`layoutMarginVertical`) | 尺寸 | 上下外边距 |
| `layout_marginHorizontal` (`layoutMarginHorizontal`) | 尺寸 | 起始和结束外边距 |

### RelativeLayout 子视图规则

以下规则只在父视图为 `RelativeLayout` 时应用.

| 属性 | 类型 |
| --- | --- |
| `layout_alignParentBottom` (`layoutAlignParentBottom`) | boolean |
| `layout_alignParentTop` (`layoutAlignParentTop`) | boolean |
| `layout_alignParentLeft` (`layoutAlignParentLeft`) | boolean |
| `layout_alignParentStart` (`layoutAlignParentStart`) | boolean |
| `layout_alignParentRight` (`layoutAlignParentRight`) | boolean |
| `layout_alignParentEnd` (`layoutAlignParentEnd`) | boolean |
| `layout_centerHorizontal` (`layoutCenterHorizontal`) | boolean |
| `layout_centerVertical` (`layoutCenterVertical`) | boolean |
| `layout_centerInParent` (`layoutCenterInParent`) | boolean |
| `layout_below` (`layoutBelow`) | ID |
| `layout_above` (`layoutAbove`) | ID |
| `layout_toLeftOf` (`layoutToLeftOf`) | ID |
| `layout_toRightOf` (`layoutToRightOf`) | ID |
| `layout_alignBottom` (`layoutAlignBottom`) | ID |
| `layout_alignTop` (`layoutAlignTop`) | ID |
| `layout_alignLeft` (`layoutAlignLeft`) | ID |
| `layout_alignStart` (`layoutAlignStart`) | ID |
| `layout_alignRight` (`layoutAlignRight`) | ID |
| `layout_alignEnd` (`layoutAlignEnd`) | ID |

布尔规则只有值严格解析为真时才添加. 目标规则使用指定视图 ID.

### 背景, 前景与内边距

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `background` (`bg`) | Drawable | 背景, 支持网络图片 |
| `backgroundColor` (`bgColor`) | 颜色 | 纯色背景 |
| `backgroundTint` (`bgTint`) | 颜色 | 背景着色 |
| `backgroundTintMode` (`bgTintMode`) | 枚举 | 背景着色模式 |
| `foreground` (`fg`) | Drawable | 前景 |
| `foregroundGravity` (`fgGravity`) | Gravity | 前景位置 |
| `foregroundTint` (`fgTint`) | 颜色 | 前景着色 |
| `foregroundTintMode` (`fgTintMode`) | 枚举 | 前景着色模式 |
| `padding` | 尺寸列表 | 四边内边距 |
| `paddingLeft`, `paddingRight`, `paddingTop`, `paddingBottom` | 尺寸 | 指定方向内边距 |
| `paddingStart`, `paddingEnd` | 尺寸 | 起始或结束内边距 |

着色模式可用值: `add`, `multiply`, `screen`, `src_atop`, `src_in`, `src_over`.

`paddingHorizontal` 和 `paddingVertical` 在当前实现中被明确标记为不支持, 即使同一源文件中存在早期 setter 注册.

### 状态与交互

| 属性 | 类型 |
| --- | --- |
| `alpha` | 浮点数 |
| `isClickable` (`clickable`) | boolean |
| `isContextClickable` (`contextClickable`) | boolean |
| `isLongClickable` (`longClickable`) | boolean |
| `isFocusable` (`focusable`) | boolean |
| `isFocusableInTouchMode` (`focusableInTouchMode`) | boolean |
| `isDuplicateParentStateEnabled` (`duplicateParentStateEnabled`, `duplicateParentState`, `enableDuplicateParentState`) | boolean |
| `filterTouchesWhenObscured` | boolean |
| `fitsSystemWindows` | boolean |
| `forceHasOverlappingRendering` | boolean |
| `isHapticFeedbackEnabled` (`hapticFeedbackEnabled`, `enableHapticFeedback`) | boolean |
| `isScrollContainer` | boolean |
| `keepScreenOn` | boolean |
| `isSaveEnabled` (`saveEnabled`, `enableSave`) | boolean |
| `isSoundEffectsEnabled` (`soundEffectsEnabled`, `enableSoundEffects`) | boolean |
| `visibility` | `visible`, `invisible`, `gone` |

`onClick` XML 属性不受支持. 使用 `view.on('click', listener)` 或 `view.click(listener)`.

### 变换与绘制

| 属性 | 类型 |
| --- | --- |
| `elevation` | 尺寸 |
| `rotation`, `rotationX`, `rotationY` | 浮点数 |
| `scaleX`, `scaleY` | 浮点数 |
| `transformPivotX`, `transformPivotY` | 尺寸 |
| `translationX`, `translationY`, `translationZ` | 尺寸 |
| `transitionName` | 字符串 |
| `drawingCacheQuality` | `auto`, `high`, `low` |

### 滚动与边缘

| 属性 | 类型或可用值 |
| --- | --- |
| `isScrollbarFadingEnabled` (`scrollbarFadingEnabled`, `fadeScrollbars`, `enableFadeScrollbars`) | boolean |
| `fadingEdgeLength` | 尺寸 |
| `requiresFadingEdge` | `horizontal`, `vertical`, 可用 `|` 组合 |
| `scrollX`, `scrollY` | 尺寸 |
| `scrollIndicators` | `bottom`, `end`, `left`, `none`, `right`, `start`, `top` |
| `scrollbarDefaultDelayBeforeFade` | 整数, ms |
| `scrollbarFadeDuration` | 整数, ms |
| `scrollbarSize` | 尺寸 |
| `scrollbarStyle` | `insideInset`, `insideOverlay`, `outsideInset`, `outsideOverlay` |
| `scrollbars` | `horizontal`, `vertical`, 可用 `|` 组合 |

### 文本方向与无障碍

| 属性 | 可用值 |
| --- | --- |
| `gravity` | Gravity. 仅当具体视图类提供 `setGravity(int)` 时生效 |
| `importantForAccessibility` | `auto`, `no`, `noHideDescendants`, `yes` |
| `layoutDirection` | `inherit`, `locale`, `ltr`, `rtl` |
| `textAlignment` | `center`, `gravity`, `inherit`, `textEnd`, `textStart`, `viewEnd`, `viewStart` |
| `textDirection` | `anyRtl`, `firstStrong`, `firstStrongLtr`, `firstStrongRtl`, `inherit`, `locale`, `ltr`, `rtl` |

## ViewGroup 属性

所有 ViewGroup 在 View 属性之外支持:

| 属性 | 类型或可用值 |
| --- | --- |
| `addStatesFromChildren` | boolean |
| `animateLayoutChanges` | boolean. 真值创建 `LayoutTransition`, 假值清除 |
| `clipChildren` | boolean |
| `clipToPadding` | boolean |
| `descendantFocusability` | `afterDescendants`, `beforeDescendants`, `blocksDescendants` |
| `layoutMode` | `clipBounds`, `opticalBounds` |
| `isMotionEventSplittingEnabled` (`motionEventSplittingEnabled`, `enableMotionEventSplitting`, `splitMotionEvents`) | boolean |
| `persistentDrawingCache` | `all`, `animation`, `none`, `scrolling` |

## TextView 属性

`text`, `button`, `btn`, `input`, `edittext`, `checkedtext`, `chronometer`, `textclock`, `checkbox`, `radio`, `radiobutton`, `switch` 和 `togglebutton` 均继承本组.

### 内容与排版

| 属性 | 类型或可用值 |
| --- | --- |
| `text` | 字符串 |
| `hint` | 字符串 |
| `textColor` (`color`) | 颜色 |
| `hintTextColor` (`textColorHint`) | 颜色 |
| `linkTextColor` (`textColorLink`) | 颜色 |
| `highlightTextColor` (`textColorHighlight`) | 颜色 |
| `textSize` (`size`) | 尺寸 |
| `textStyle` | `bold`, `italic`, `normal`, 可组合 |
| `typeface` | 字体系列名称 |
| `fontFamily` | 字体系列名称. 设置后优先于 `typeface` |
| `fontFeatureSettings` | OpenType 特性字符串 |
| `textAppearance` | 样式资源 |
| `textScaleX` | 当前实现按尺寸解析 |
| `letterSpacing` | 浮点数 |
| `gravity` | Gravity |
| `includeFontPadding` | boolean |
| `isElegantTextHeight` (`elegantTextHeight`) | boolean |
| `isAllCaps` (`allCaps`, `textAllCaps`) | boolean |

### 行数与尺寸

| 属性 | 类型或可用值 |
| --- | --- |
| `lines`, `minLines`, `maxLines` | 整数 |
| `ems`, `minEms`, `maxEms` | 整数 |
| `minWidth`, `maxWidth`, `minHeight`, `maxHeight` | 尺寸 |
| `maxLength` | 整数 |
| `lineSpacingExtra` | 尺寸 |
| `lineSpacingMultiplier` | 当前实现按尺寸解析后传给 multiplier |
| `isSingleLine` (`singleLine`) | boolean |
| `scrollHorizontally` | boolean |
| `ellipsize` | `end`, `marquee`, `none`, `start`, `middle` |
| `marqueeRepeatLimit` | 整数或 `marquee_forever` |
| `hyphenationFrequency` | `full`, `none`, `normal` |

### 输入与选择

| 属性 | 类型或可用值 |
| --- | --- |
| `inputType` | 见下方输入类型 |
| `imeOptions` | 见下方 IME 值 |
| `imeActionId` | 整数 |
| `imeActionLabel` | 字符串 |
| `privateImeOptions` | 字符串 |
| `autoText` | boolean |
| `capitalize` | `characters`, `none`, `sentences`, `words` |
| `digit` | `true`, `false` 或允许字符组成的字符串 |
| `numeric` | `decimal`, `number`, `signed`, 可组合 |
| `password` | boolean. 只有字符串 `true` 会添加密码 variation |
| `phoneNumber` | boolean. 当前实现添加 `TYPE_TEXT_VARIATION_PHONETIC`, 不等效于 `inputType="phone"` |
| `selectAllOnFocus` | boolean |
| `textIsSelectable` | boolean |
| `isCursorVisible` (`cursorVisible`) | boolean |
| `freezesText` | boolean |

`inputType` 可用值:

`date`, `datetime`, `none`, `number`, `numberDecimal`, `numberPassword`, `numberSigned`, `phone`, `text`, `textAutoComplete`, `textAutoCorrect`, `textCapCharacters`, `textCapSentences`, `textCapWords`, `textEmailAddress`, `textEmailSubject`, `textFilter`, `textImeMultiLine`, `textLongMessage`, `textMultiLine`, `textNoSuggestions`, `textPassword`, `textPersonName`, `textPhonetic`, `textPostalAddress`, `textShortMessage`, `textUri`, `textVisiblePassword`, `textWebEditText`, `textWebEmailAddress`, `textWebPassword`, `time`.

多个输入类型可使用分隔符组合.

`imeOptions` 接受 `actionDone`, `actionGo`, `actionNext`, `actionNone`, `actionPrevious`, `actionSearch`, `actionSend`, `actionUnspecified`. 当前源代码将所有这些值映射为 `IME_ACTION_DONE`.

### 链接, Drawable 与阴影

| 属性 | 类型或可用值 |
| --- | --- |
| `autoLink` | `all`, `email`, `map`, `none`, `phone`, `web` |
| `linksClickable` | boolean |
| `drawableLeft`, `drawableTop`, `drawableRight`, `drawableBottom` | Drawable |
| `drawables` | 1, 2, 3 或 4 个 Drawable. 4 值顺序为 left, top, right, bottom |
| `drawablePadding` | 尺寸 |
| `shadowColor` | 颜色 |
| `shadowDx`, `shadowDy`, `shadowRadius` | 尺寸 |

## 输入框附加属性

`input` 和 `edittext` 在 TextView 属性之外支持:

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `selectAll` | boolean | 文本非空且为真时请求焦点并全选 |
| `extendsSelection` | 整数 | 文本非空时扩展选择到指定索引 |
| `setSelection` | 整数或 `start,end` | 文本非空时设置光标或选择范围 |

## ImageView 属性

`imagebutton`, `quickcontactbadge` 和 `fab` 继承本组. `image` 和 `img` 还继承 [圆角图片属性](#圆角图片属性).

| 属性 | 类型或可用值 |
| --- | --- |
| `adjustViewBounds` | boolean |
| `baseline` | 尺寸 |
| `baselineAlignBottom` | boolean |
| `cropToPadding` | boolean |
| `maxHeight`, `maxWidth` | 尺寸 |
| `path` | 本地图片路径 |
| `src` | Drawable, 本地路径, URL 或 Base64 data URI |
| `url` | URL |
| `scaleType` | `center`, `centerCrop`, `centerInside`, `fitCenter`, `fitEnd`, `fitStart`, `fitXY`, `matrix` |
| `tint` | 颜色 |
| `tintMode` | `add`, `multiply`, `screen`, `src_atop`, `src_in`, `src_over` |

### 圆角图片属性

`image` 和 `img` 实际创建 `RoundedImageView` 子类:

| 属性 | 类型或可用值 |
| --- | --- |
| `cornerRadius` (`radius`) | 尺寸 |
| `cornerRadiusTopLeft` (`radiusTopLeft`) | 尺寸 |
| `cornerRadiusTopRight` (`radiusTopRight`) | 尺寸 |
| `cornerRadiusBottomLeft` (`radiusBottomLeft`) | 尺寸 |
| `cornerRadiusBottomRight` (`radiusBottomRight`) | 尺寸 |
| `isOval` (`oval`) | boolean |
| `tileX` (`tileModeX`) | `clamp`, `mirror`, `repeat` |
| `tileY` (`tileModeY`) | `clamp`, `mirror`, `repeat` |
| `borderWidth` | 尺寸 |
| `borderColor` | 颜色 |
| `circle` (`isCircle`) | 动作属性. 当前实现只要出现就设为圆形, 不检查值 |

## ProgressBar 与 SeekBar 属性

`progressbar` 支持 View 属性及以下属性:

| 属性 | 类型或可用值 |
| --- | --- |
| `isIndeterminate` (`indeterminate`) | boolean |
| `indeterminateDrawable` | Drawable |
| `indeterminateTint`, `progressBackgroundTint`, `progressTint`, `secondaryProgressTint` | 颜色状态列表 |
| `indeterminateTintMode`, `progressBackgroundTintMode`, `progressTintMode`, `secondaryProgressTintMode` | 着色模式 |
| `min` | 整数. Android API 级别低于 `26` 时抛出异常 |
| `max` | 整数 |
| `minHeight`, `minWidth` | 尺寸 |
| `progress`, `secondaryProgress` | 整数 |
| `progressDrawable` | Drawable |
| `tint` | 1 至 3 个颜色 |

`tint` 的值含义:

- 1 个颜色 - 应用于 progress, background, secondary, indeterminate.
- 2 个颜色 - 第 1 个用于 progress, secondary, indeterminate, 第 2 个用于 background.
- 3 个颜色 - 依次用于 progress, background, secondary, 第 1 个同时用于 indeterminate.

`seekbar` 和 `ratingbar` 继续增加 AbsSeekBar 属性:

| 属性 | 类型 |
| --- | --- |
| `keyProgressIncrement` | 整数 |
| `splitTrack` | boolean |
| `thumb`, `tickMark` | Drawable |
| `thumbOffset` | 整数 px |
| `thumbTintList`, `tickMarkTintList` | 颜色状态列表 |

`ratingbar` 另外支持:

| 属性 | 类型 |
| --- | --- |
| `isIndicator` | boolean |
| `numStars` | 整数 |
| `rating`, `stepSize` | 浮点数 |

## 布局控件属性

### LinearLayout

`linear`, `horizontal`, `vertical`, `radiogroup`, `radios`, `numberpicker`, `search`, `appbar` 和 `actionmenu` 继承:

| 属性 | 类型或可用值 |
| --- | --- |
| `isBaselineAligned` (`baselineAligned`) | boolean |
| `baselineAlignedChildIndex` | 整数 |
| `divider` | Drawable |
| `gravity` | Gravity |
| `isMeasureWithLargestChildEnabled` (`measureWithLargestChildEnabled`, `measureWithLargestChild`, `enableMeasureWithLargestChild`) | boolean |
| `orientation` | `vertical`, `horizontal` |
| `showDividers` | `beginning`, `middle`, `end`, `none`, 可组合 |
| `weightSum` | 浮点数 |

`horizontal` 和 `linear` 默认横向, `vertical` 默认纵向. `orientation` 可覆盖默认值.

### FrameLayout

`frame` 没有新的通用属性. `JsFrameLayout` 额外支持 `gravity`, 并在子视图完成渲染后把该 Gravity 应用于所有直接子视图的布局参数.

`card`, `scroll`, `calendar`, `datepicker`, `timepicker`, `tabs`, `viewflipper`, `viewswitcher`, `textswitcher` 和 `console` 通过各自父类继承 FrameLayout 和 ViewGroup 属性.

### RelativeLayout

`relative` 另外支持:

- `gravity`
- `horizontalGravity`
- `verticalGravity`

三个属性均使用 Gravity 值.

### ScrollView

`scroll` 另外支持:

| 属性 | 类型 |
| --- | --- |
| `isFillViewport` | boolean |
| `isSmoothScrollingEnabled` (`isSmoothScrolling`, `smoothScrollingEnabled`, `enableSmoothScrolling`) | boolean |
| `topEdgeEffectColor`, `bottomEdgeEffectColor`, `edgeEffectColor` | 颜色. Android API 级别低于 `29` 时不执行操作 |

完整类名或短类名 `<HorizontalScrollView>` 另外支持:

- `isFillViewport` (`fillViewport`)
- `smoothScrollingEnabled` (`enableSmoothScrolling`, `isSmoothScrollingEnabled`, `isSmoothScrolling`)
- `leftEdgeEffectColor`
- `rightEdgeEffectColor`
- `setEdgeEffectColor`

三个边缘颜色属性在 Android API 级别低于 `29` 时不执行操作.

### CardView

`card` 另外支持:

| 属性 | 类型 |
| --- | --- |
| `cardBackgroundColor` (`cardBgColor`, `cardBg`) | 颜色 |
| `radius` (`cardCornerRadius`, `cornerRadius`) | 尺寸 |
| `cardElevation` | 尺寸 |
| `maxCardElevation` (`cardMaxElevation`) | 尺寸 |
| `preventCornerOverlap` (`cardPreventCornerOverlap`) | boolean |
| `useCompatPadding` (`cardUseCompatPadding`) | boolean |
| `contentPadding` | 尺寸列表 |
| `contentPaddingLeft`, `contentPaddingTop`, `contentPaddingRight`, `contentPaddingBottom` | 尺寸 |

### AppBarLayout

`appbar` 另外支持:

| 属性 | 类型 |
| --- | --- |
| `expanded` | boolean |
| `isLifted` (`lifted`) | boolean |
| `statusBarForegroundColor` (`statusBarFgColor`) | 颜色 |
| `elevation` | 尺寸. 写入 Material AppBar 的 target elevation |

### Toolbar

`toolbar` 另外支持:

| 属性 | 类型或可用值 |
| --- | --- |
| `collapseContentDescription` | 字符串 |
| `collapseIcon` | Drawable |
| `logo` | Drawable |
| `logoDescription` | 字符串 |
| `navigationContentDescription` | 字符串 |
| `navigationIcon` | Drawable |
| `overflowIcon` | Drawable |
| `popupTheme` | `dark`, `light` |
| `subtitle`, `title` | 字符串 |
| `subtitleTextColor`, `titleTextColor` | 颜色 |
| `titleMargin`, `titleMarginBottom`, `titleMarginTop`, `titleMarginStart`, `titleMarginEnd` | 尺寸 |

### ViewPager 与 TabLayout

`viewpager` 另外支持:

- `pageMargin` - 尺寸.
- `pageMarginDrawable` - Drawable.
- `titles` - 页面标题列表.

`tabs` 和 `tab` 另外支持:

| 属性 | 类型或可用值 |
| --- | --- |
| `tabGravity` | Gravity |
| `selectedTabIndicatorColor` (`tabIndicatorColor`) | 颜色 |
| `tabMode` | `fixed`, `scrollable` |
| `tabRippleColor`, `tabIconTint` | 颜色状态列表 |
| `selectedTabIndicatorGravity` (`tabIndicatorGravity`) | Gravity |
| `selectedTabIndicator` | Drawable |
| `tabSelectedTextColor`, `tabTextColor` | 颜色 |
| `isTabIndicatorFullWidth` (`tabIndicatorFullWidth`) | boolean |
| `isInlineLabel` (`inlineLabel`) | boolean |
| `tabIndicatorHeight` | 尺寸 |

### ViewAnimator

`viewflipper`, `viewswitcher` 和 `textswitcher` 继承:

- `animateFirstView` - boolean.
- `displayedChild` - 整数索引.

`viewflipper` 另外支持:

- `isAutoStart` (`autoStart`) - boolean.
- `flipInterval` - 整数, ms.

`textswitcher` 另外支持 TextView 的全部文本属性, 属性会同时应用到内部两个 `JsTextView`. 它还支持:

| 属性 | 类型或可用值 |
| --- | --- |
| `text` (`nextText`) | 字符串. 使用切换动画显示下一文本 |
| `currentText` | 字符串. 不使用切换动画设置当前文本 |
| `anim` (`animation`) | `from left`, `from right`, `from top`, `from bottom`, `micro`, `fade`, `fast fade`, `shrink` 等内置模式 |
| `animIn` (`inAnim`, `inAnimation`) | 动画资源 |
| `animOut` (`outAnim`, `outAnimation`) | 动画资源 |

完整类名或短类名 `<ImageSwitcher>` 支持:

- `imageDrawable` (`drawable`) - Drawable.
- `imageResource` (`resource`) - 整数资源 ID.
- `imageURI` (`uri`) - URI 字符串.

## 选择与输入控件属性

### CompoundButton

`checkbox`, `radio`, `radiobutton`, `switch` 和 `togglebutton` 继承:

| 属性 | 类型 |
| --- | --- |
| `checked` (`check`, `isChecked`) | boolean |
| `buttonDrawable` | Drawable |
| `buttonTint` (`tint`) | 1 个颜色, 或依次表示未选中和选中的 2 个颜色 |

`radiogroup` 和 `radios` 另外支持 `checkedButton`, 值为待选中子按钮 ID.

`switch` 另外支持:

| 属性 | 类型 |
| --- | --- |
| `showText` | boolean |
| `textOff`, `textOn` | 字符串 |
| `thumbDrawable`, `trackDrawable` | Drawable |
| `thumbTextPadding`, `switchMinWidth`, `switchPadding` | 尺寸 |
| `thumbTint`, `trackTint` | 1 个颜色, 或未选中和选中的 2 个颜色 |
| `splitTrack` | boolean |
| `switchTypeface` | 字体系列名称 |

`togglebutton` 另外支持 `textOff` 和 `textOn`.

`checkedtext` 另外支持:

- `checkMarkDrawable` - Drawable.
- `checkMarkTintList` (`checkMarkTint`) - 颜色状态列表.

### Spinner

`spinner` 继承 ViewGroup 和 AdapterView 属性, 其中 AdapterView 提供 `selection` 整数索引. Spinner 另外支持:

| 属性 | 类型 |
| --- | --- |
| `dropDownHorizontalOffset`, `dropDownVerticalOffset`, `dropDownWidth` | 尺寸 |
| `gravity` | Gravity |
| `popupBackgroundDrawable` (`popupBgDrawable`, `popupBackground`, `popupBg`) | Drawable |
| `prompt` | 字符串 |
| `entries` | 使用 `|` 分隔的项目文本 |
| `entryTextColor`, `textColor` | 颜色 |
| `entryTextSize`, `textSize` | 尺寸 |
| `entryTextStyle`, `textStyle` | `bold`, `italic`, `normal`, 可组合 |

创建时属性 `spinnerMode` 接受 `dialog` 或 `dropdown`.

### NumberPicker

`numberpicker` 另外支持:

| 属性 | 类型 |
| --- | --- |
| `maxValue` (`max`), `minValue` (`min`) | 整数 |
| `onLongPressUpdateInterval` (`longPressUpdateInterval`) | 整数, ms |
| `wrapSelectorWheel` | boolean |
| `value` (`selectedIndex`, `currentIndex`) | 整数 |
| `displayedValues` (`values`) | 字符串列表 |
| `distinctDisplayedValues` (`distinctValues`) | 去重后的字符串列表 |
| `textColor` (`color`) | 颜色. Android API 级别低于 `29` 时不执行操作 |
| `textSize` (`size`) | 尺寸. Android API 级别低于 `29` 时不执行操作 |
| `selectionDividerHeight` | 整数 px. Android API 级别低于 `29` 时不执行操作 |

显示值数量与 `maxValue - minValue + 1` 不同时, 实现会把范围重置为 `0` 至 `values.length - 1`.

### Calendar 与 DatePicker

`calendar` 另外支持:

| 属性 | 类型 |
| --- | --- |
| `date` | Unix epoch ms |
| `firstDayOfWeek` | `MON`, `MONDAY` 等英文星期名, 或 Java `Calendar` 星期整数 |
| `minDate`, `maxDate` | `yyyy/MM/dd` 或 `MM/dd/yyyy` |

`datepicker` 另外支持:

- `minDate`, `maxDate`
- `firstDayOfWeek`
- `spinnersShown`
- `calendarViewShown`

后两个属性为已弃用 Android API 的兼容入口.

### TimePicker

`timepicker` 另外支持:

- `hour` (`hh`) - 整数.
- `minute` (`mm`) - 整数.
- `is24HourView` (`is24Hour`, `is24H`, `is24`) - boolean.

### SearchView

`search` 另外支持:

| 属性 | 类型 |
| --- | --- |
| `imeOptions` | 与 TextView 相同 |
| `inputType` | 与 TextView 相同 |
| `maxWidth` | 尺寸 |
| `queryHint` | 字符串 |
| `isIconified` (`iconified`) | boolean |
| `isIconifiedByDefault` (`iconifiedByDefault`) | boolean |
| `isQueryRefinementEnabled` (`queryRefinementEnabled`, `isQueryRefinement`, `enableQueryRefinement`) | boolean |
| `isSubmitButtonEnabled` (`submitButtonEnabled`, `isSubmitButton`, `enableSubmitButton`) | boolean |

## 媒体与专用控件属性

### FloatingActionButton

`fab` 在 ImageView 属性之外支持:

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `customSize` (`fabCustomSize`) | 尺寸 | 自定义直径 |
| `size` (`fabSize`) | 当前实现按尺寸转为整数 | 直接写入 Material FAB size 字段 |
| `elevation` | 尺寸 | compat elevation |
| `useCompatPadding` | boolean | 兼容阴影内边距 |
| `rippleColor` | 颜色 | 波纹颜色 |
| `backgroundTint` (`bgTint`) | 颜色状态列表 | 背景着色 |
| `ensureMinTouchTargetSize` | boolean | 最小触摸区域 |
| `maxImageSize` | 整数 px | 最大图标尺寸 |
| `excludeFromNavigationBar` | 动作属性 | 只要应用即执行排除逻辑, 不检查属性值 |

### QuickContactBadge

`quickcontactbadge` 另外支持:

| 属性 | 类型 |
| --- | --- |
| `overlay` | Drawable |
| `phone` | 电话号码 |
| `email` | 邮箱地址 |
| `prioritizedMimeType` | 联系人 MIME 类型枚举 |

`prioritizedMimeType` 可用值:

`aggregationExceptions`, `contacts`, `directory`, `email`, `event`, `groupMembership`, `groups`, `identity`, `im`, `nickname`, `note`, `organization`, `phone`, `photo`, `rawContacts`, `relation`, `settings`, `sipAddress`, `statusUpdates`, `structuredName`, `structuredPostal`, `website`.

### Chronometer 与 TextClock

`chronometer` 另外支持:

- `base` - `SystemClock.elapsedRealtime()` 时间基准值, 单位为 ms.
- `isCountDown` (`countDown`) - boolean.
- `format` - 字符串.
- `autoStart` (`isAutoStart`) - boolean. 只有真值会调用 `start()`.

`textclock` 另外支持:

- `format12Hour`
- `format24Hour`
- `timeZone`

三个值均按字符串处理.

### ConsoleView

`console` 和 `globalconsole` 另外支持 (属性与 [console](console) 模块的 `setXxx` 方法对应):

| 属性 | 类型 |
| --- | --- |
| `global` | boolean. `true` 显示全局控制台, `false` 显示当前脚本的控制台; 仅 `console` 支持, 可写作裸属性 `<console global>` |
| `title` | 字符串. 设置后显示标题栏 |
| `titleBarVisible` (`showTitleBar`) | boolean |
| `titleTextSize` | 浮点数, sp |
| `titleTextColor` | 颜色 |
| `titleBackgroundColor`, `titleBackgroundTint` | 颜色 |
| `titleBackgroundAlpha` | 0 ~ 1 的浮点数 |
| `titleIconsTint` | 颜色 |
| `textSize` (`contentTextSize`) | 浮点数, sp |
| `textColor` | 颜色. 同时应用于标题及全部日志等级 |
| `textColors` (`contentTextColors`, `contentTextColor`) | 单个颜色, 或最多 6 个颜色依次为 verbose, debug, info, warn, error, assert |
| `verboseTextColor` (`verboseColor`) | 颜色 |
| `debugTextColor` (`debugColor`, `logTextColor`, `logColor`) | 颜色 |
| `infoTextColor` (`infoColor`) | 颜色 |
| `warnTextColor` (`warnColor`) | 颜色 |
| `errorTextColor` (`errorColor`) | 颜色 |
| `assertTextColor` (`assertColor`) | 颜色 |
| `contentBackgroundColor`, `contentBackgroundTint` | 颜色 |
| `contentBackgroundAlpha` | 0 ~ 1 的浮点数 |
| `backgroundColor` (`bgColor`), `backgroundTint` (`bgTint`) | 颜色. 同时应用于标题栏及日志区域 |
| `backgroundAlpha` | 0 ~ 1 的浮点数. 同时应用于标题栏及日志区域 |
| `timeVisible` (`showTime`, `timestampVisible`) | boolean, 默认 `false` |
| `timeFormat` | `SimpleDateFormat` 模式, 默认 `HH:mm:ss.SSS` |
| `colorful` (`logColoring`) | boolean, 默认 `true` |
| `inputVisible` (`showInput`, `inputBarVisible`) | boolean, 默认 `false` |
| `isPinchToZoomEnabled` (`pinchToZoomEnabled`, `enablePinchToZoom`) | boolean |

### CanvasView

`canvas` 基于 TextureView, 另外支持 `isOpaque` (`opaque`) boolean. 绘制方法和事件参阅 [UI Canvas 视图](ui#canvas-视图) 及 [画布](canvas).

### SurfaceView 与 VideoView

完整类名或短类名 `<SurfaceView>` 支持:

| 属性 | 类型 |
| --- | --- |
| `clipBounds` | `left,top,right,bottom` 四个整数 px |
| `secure` (`isSecure`) | boolean |
| `zOrderOnTop` (`isZOrderOnTop`) | boolean |
| `zOrderMediaOverlay` (`isZOrderMediaOverlay`) | boolean |
| `visibility` | `visible`, `invisible`, `gone` |

`video` 另外支持:

| 属性 | 类型 |
| --- | --- |
| `videoPath` (`path`, `src`) | 本地路径或 `@raw/name` |
| `controller` (`mediaController`, `isControllerEnabled`, `controllerEnabled`, `enableController`, `isMediaControllerEnabled`, `mediaControllerEnabled`, `enableMediaController`) | `true` 重置 MediaController, `false` 或 `null` 清除 |

### WebView

`webview` 和 `web` 另外支持:

| 属性 | 类型 |
| --- | --- |
| `url` | URL 或本地文件路径 |
| `scale` (`initialScale`) | 整数 |
| `enableNetwork` (`networkAvailable`) | boolean |
| `blockNetworkImage`, `blockNetworkLoads` | boolean |
| `enableBuiltInZoomControls` (`builtInZoomControls`) | boolean |
| `enableDatabase` (`databaseEnabled`, `isDatabaseEnabled`) | boolean |
| `fontSize` (`defaultFontSize`) | 整数 |
| `fixedFontSize` (`defaultFixedFontSize`) | 整数 |
| `textEncodingName` (`defaultTextEncodingName`) | 字符串 |
| `jsAutoOpenWindows` (`javaScriptAutoOpenWindows`, `javaScriptCanOpenWindowsAutomatically`) | boolean |
| `enableJs` (`enableJavaScript`, `javaScriptEnabled`, `isJavaScriptEnabled`) | boolean |
| `autoLoadImages` (`autoLoadsImages`, `loadsImagesAutomatically`) | boolean |
| `minFontSize` (`minimumFontSize`) | 整数 |
| `sansSerifFontFamily`, `serifFontFamily` | 字符串 |
| `fontFamily` (`standardFontFamily`) | 字符串 |
| `multiWindows` (`multipleWindows`, `supportMultipleWindows`) | boolean |
| `userAgent` (`userAgentString`) | 字符串 |

## List 与 Grid 属性

`list` 基于 RecyclerView, 在 ViewGroup 属性之外支持:

- `orientation` - `vertical` 或 `horizontal`.

`grid` 继续支持:

- `spanCount` - 整数.
- `isUsingSpansToEstimateScrollbarDimensions` (`usingSpansToEstimateScrollbarDimensions`) - boolean.
- `orientation` - `vertical` 或 `horizontal`.

列表项目模板, 数据源和事件参阅 [列表与网格](ui#列表与网格).

## 创建阶段专用属性

以下属性在视图构造时读取. 它们不是普通可重复应用属性, `view.attr(name, value)` 不应作为修改方式.

| 视图 | 属性 | 值 |
| --- | --- | --- |
| 通用动态类 | `style` | 应用样式资源. 类必须具有 `(Context, AttributeSet, int, int)` 构造方法 |
| `button`, `btn` | `isBorderless`, `isColored`, `isBorderlessColored`, `isColoredBorderless` | boolean |
| `progressbar` | `isHorizontal`, `horizontal` | boolean |
| `seekbar` | `isMaterial`, `materialStyle`, `isMaterialStyle` | boolean |
| `spinner` | `spinnerMode` | `dialog`, `dropdown` |

`style` 对 button, progressbar 和 seekbar 优先于其快捷布尔样式.

## AndroidX 与 Material 短类名

动态布局器可解析以下短类名:

`CardView`, `ConstraintLayout`, `CoordinatorLayout`, `NestedScrollView`, `DrawerLayout`, `FragmentContainerView`, `RecyclerView`, `SwipeRefreshLayout`, `ViewPager`, `ViewPager2`, `AppBarLayout`, `MaterialToolbar`, `BottomNavigationView`, `MaterialButton`, `Chip`, `MaterialCalendarGridView`, `FloatingActionButton`, `BaselineLayout`, `CheckableImageButton`, `ClippableRoundedCornerLayout`, `NavigationMenuItemView`, `NavigationMenuView`, `TouchObserverFrameLayout`, `VisibilityAwareImageButton`, `NavigationView`, `TabLayout`, `TextInputEditText`, `TextInputLayout`, `ChipTextInputComboView`, `ClockFaceView`, `ClockHandView`, `TimePickerView`.

`BottomSheetDialog` 和 `Snackbar` 也存在于共享类名映射中, 但它们不是 Android `View`, 不能作为布局节点.

短类名只负责类名解析. 例如 `<ConstraintLayout>` 可以创建视图, 但当前没有 ConstraintLayout 专用属性处理器, 因此只保证 ViewGroup 和 View 属性. 需要未注册的第三方属性时, 应在脚本中通过原生 Java 方法设置.

没有点号且不在上述映射中的大写标签会尝试解析为 `android.widget.<TagName>`, 如 `<ImageSwitcher>` 或 `<HorizontalScrollView>`.

## 明确不支持的属性

这些属性不是静默忽略, 而是在应用时抛出异常.

### View

`accessibilityLiveRegion`, `accessibilityTraversalAfter`, `accessibilityTraversalBefore`, `autofillHints`, `autofilledHighlight`, `defaultFocusHighlightEnabled`, `focusedByDefault`, `importantForAutofill`, `keyboardNavigationCluster`, `layerType`, `nextClusterForward`, `nextFocusDown`, `nextFocusForward`, `nextFocusLeft`, `nextFocusRight`, `nextFocusUp`, `onClick`, `paddingHorizontal`, `paddingVertical`, `scrollbarAlwaysDrawHorizontalTrack`, `scrollbarAlwaysDrawVerticalTrack`, `scrollbarThumbHorizontal`, `scrollbarThumbVertical`, `scrollbarTrackHorizontal`, `scrollbarTrackVertical`, `stateListAnimator`, `tooltipText`.

### ViewGroup

`layoutAnimation`.

### TextView 与 TextSwitcher

`drawableStart`, `drawableEnd`, `editable`, `editorExtras`, `inputMethod`.

### ProgressBar

`animationResolution`, `mirrorForRtl`, `maxWidth`, `maxHeight`, `interpolator`, `indeterminateOnly`, `indeterminateDuration`, `indeterminateBehavior`.

### DatePicker

`startYear`, `endYear`, `calendarTextColor`, `dayOfWeekBackground`, `dayOfWeekTextAppearance`, `headerBackground`, `headerDayOfMonthTextAppearance`, `headerMonthTextAppearance`, `headerYearTextAppearance`, `yearListItemTextAppearance`, `yearListSelectorColor`.

### Spinner 不支持属性

`dropDownSelector`.
