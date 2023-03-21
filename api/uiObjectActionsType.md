# 控件节点行为 (UiObjectActions)

UiObjectActions 是一个 Java 接口, 代表 [控件节点 (UiObject)](uiObjectType) 的行为集合.

该接口有一个抽象方法 [performAction](#m-performaction) 是执行具体的控件节点行为的核心.  
诸如 [ click / copy / paste ] 等方法均是对 performAction 的封装, 因此用户也可利用 performAction 实现自定义控件节点行为的封装.

下表列出了部分行为 ID 名称, 及对应已实现封装的方法名称 (星号表示 AutoJs6 新增方法):

| 行为 ID                                   | 封装方法名                           | 最低 API 等级          |
|:----------------------------------------|:--------------------------------|--------------------|
| ACTION_ACCESSIBILITY_FOCUS              | accessibilityFocus              | -                  |
| ACTION_CLEAR_ACCESSIBILITY_FOCUS        | clearAccessibilityFocus         | -                  |
| ACTION_CLEAR_FOCUS                      | clearFocus                      | -                  |
| ACTION_CLEAR_SELECTION                  | clearSelection *                | -                  |
| ACTION_CLICK                            | click                           | -                  |
| ACTION_COLLAPSE                         | collapse                        | -                  |
| ACTION_CONTEXT_CLICK                    | contextClick                    | -                  |
| ACTION_COPY                             | copy                            | -                  |
| ACTION_CUT                              | cut                             | -                  |
| ACTION_DISMISS                          | dismiss                         | -                  |
| ACTION_DRAG_CANCEL                      | dragCancel *                    | 32 (12.1) [S_V2]   |
| ACTION_DRAG_DROP                        | dragDrop *                      | 32 (12.1) [S_V2]   |
| ACTION_DRAG_START                       | dragStart *                     | 32 (12.1) [S_V2]   |
| ACTION_EXPAND                           | expand                          | -                  |
| ACTION_FOCUS                            | focus                           | -                  |
| ACTION_HIDE_TOOLTIP                     | hideTooltip *                   | 28 (9) [P]         |
| ACTION_IME_ENTER                        | imeEnter *                      | 30 (11) [R]        |
| ACTION_LONG_CLICK                       | longClick                       | -                  |
| ACTION_MOVE_WINDOW                      | moveWindow *                    | 26 (8) [O]         |
| ACTION_NEXT_AT_MOVEMENT_GRANULARITY     | nextAtMovementGranularity *     | -                  |
| ACTION_NEXT_HTML_ELEMENT                | nextHtmlElement *               | -                  |
| ACTION_PAGE_DOWN                        | pageDown *                      | 29 (10) [Q]        |
| ACTION_PAGE_LEFT                        | pageLeft *                      | 29 (10) [Q]        |
| ACTION_PAGE_RIGHT                       | pageRight *                     | 29 (10) [Q]        |
| ACTION_PAGE_UP                          | pageUp *                        | 29 (10) [Q]        |
| ACTION_PASTE                            | paste                           | -                  |
| ACTION_PRESS_AND_HOLD                   | pressAndHold *                  | 30 (11) [R]        |
| ACTION_PREVIOUS_AT_MOVEMENT_GRANULARITY | previousAtMovementGranularity * | -                  |
| ACTION_PREVIOUS_HTML_ELEMENT            | previousHtmlElement *           | -                  |
| ACTION_SCROLL_BACKWARD                  | scrollBackward                  | -                  |
| ACTION_SCROLL_DOWN                      | scrollDown                      | -                  |
| ACTION_SCROLL_FORWARD                   | scrollForward                   | -                  |
| ACTION_SCROLL_LEFT                      | scrollLeft                      | -                  |
| ACTION_SCROLL_RIGHT                     | scrollRight                     | -                  |
| ACTION_SCROLL_TO_POSITION               | scrollTo                        | -                  |
| ACTION_SCROLL_UP                        | scrollUp                        | -                  |
| ACTION_SELECT                           | select                          | -                  |
| ACTION_SET_PROGRESS                     | setProgress                     | -                  |
| ACTION_SET_SELECTION                    | setSelection                    | -                  |
| ACTION_SET_TEXT                         | setText                         | -                  |
| ACTION_SHOW_ON_SCREEN                   | show                            | -                  |
| ACTION_SHOW_TEXT_SUGGESTIONS            | showTextSuggestions *           | 33 (13) [TIRAMISU] |
| ACTION_SHOW_TOOLTIP                     | showTooltip *                   | 28 (9) [P]         |

若当前设备不满足列表中最低 API 等级要求, 使用对应方法时不会抛出异常, 会静默返回 false:

```js
/* 
    例如 ACTION_IME_ENTER 要求设备运行条件不低于 Android API 30 (11) [R].
    在 API < 30 的设备上一定返回 false 且 IME ENTER 无效果 (但不会抛出异常).
 */
console.log(pickup({
    focusable: true,
    contentMatch: '.+',
}, 'imeEnter'));
```

上表中所有已封装的控件行为对应的方法 **名称** 均已全局化, 有关全局化方法的使用方式及方法的绑定源信息, 可参阅 [全局行为重定向](#全局行为重定向) 小节.

> 参阅: [Android Docs](https://developer.android.com/reference/android/view/accessibility/AccessibilityNodeInfo.AccessibilityAction)

---

<p style="font: bold 2em sans-serif; color: #FF7043">UiObjectActions</p>

---

## [m!] performAction

用于执行指定的控件行为.  
是一个无默认实现的抽象方法.

### performAction(action, ...arguments)

**`A11Y`**

- **action** { [number](dataTypes#number) } - 行为的唯一标志符 (Action ID)
- **arguments** { [...](documentation#可变参数)[ActionArgument](#i-actionargument)[[]](documentation#可变参数) } - 行为参数, 用于给行为传递参数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

实现此方法的类有:

- [UiSelector](uiSelectorType)
- [UiObject](uiObjectType)
- [UiObjectCollection](uiObjectCollectionType)

源代码摘要:

- UiSelector

```kotlin
/* Updated as of Nov 2, 2022. */

override fun performAction(action: Int, vararg arguments: ActionArgument): Boolean {
    return untilFind().performAction(action, *arguments)
}
```

- UiObject

```kotlin
/* Updated as of Nov 2, 2022. */

override fun performAction(action: Int, vararg arguments: ActionArgument): Boolean {
    return performAction(action, Bundle().apply { arguments.forEach { it.putIn(this) } })
}

override fun performAction(action: Int, bundle: Bundle): Boolean = try {
    when (bundle.isEmpty) {
        true -> super.performAction(action)
        else -> super.performAction(action, bundle)
    }
} catch (e: IllegalStateException) {
    false
}
```

- UiObjectCollection

```kotlin
/* Updated as of Nov 2, 2022. */

override fun performAction(action: Int, vararg arguments: ActionArgument): Boolean {
    var success = true
    nodes.filterNotNull().forEach { node ->
        when (arguments.isEmpty()) {
            true -> node.performAction(action)
            else -> node.performAction(action, *arguments)
        }.also { success = success and it }
    }
    return success
}
```

由此可见, [UiSelector](uiSelectorType) 与 [UiObjectCollection](uiObjectCollectionType) 最终都调用了 [UiObject](uiObjectType) 的 `performAction` 方法, 而 `UiObject` 的 `performAction` 则调用了 Android 系统的 [AccessibilityNodeInfoCompat#performAction](https://developer.android.com/reference/androidx/core/view/accessibility/AccessibilityNodeInfoCompat#performAction(int,android.os.Bundle)) 方法

`UiObjectCollection` 相当于对控件集合中的每一个控件执行 `UiObject#performAction` 方法.  
`UiSelector` 相当于先执行 [untilFind](uiSelectorType#m-untilfind) 找到当前窗口中所有控件, 将其作为集合执行 `UiObjectCollection#performAction` 方法.

因全局的 `untilFind()` 是 "无条件" 筛选, 会把窗口中所有控件 (往往会有几十甚至成百上千个控件) 全部加入集合中, 此时执行任何 `行为 (Action)`, 都相当于集合中所有控件执行一遍上述行为, 这样的操作往往是无意义的, 很可能造成非预期结果甚至不可控的操作, 因此不建议使用 `UiSelector` 提供的 `行为 (Action)` 方法.

下面列举一个 `UiSelector` 提供的行为, 再次强调不建议使用:

```js
/* ACTION_SET_TEXT 行为 */

/* 对当前窗口中所有支持设置文本的控件, 将内容设置为 "hello". */
selector().setText("hello");

/* UiSelector 几乎所有方法均已全局化, setText 位列其中. */
setText("hello"); /* 效果同上. */
```

如有上述示例的需求 (对控件设置文本内容), 而且是针对多个控件同时设置, 建议使用选择器定位指定的控件集合, 再统一执行 `行为 (Action)`:

```js
/* 先筛选集合. */
let nodes = pickup({
    focusable: true,
    textMatch: "name",
    boundInside: [ cX(0.2), cYx(0.04), cX(0.8), cY(0.92) ],
}, '[w]');

/* 再执行行为. */
nodes.forEach(w => w.setText("hello"));
```

如需对控件执行自定义行为, 可通过 `UiObject#performAction` 实现:

```js
/* 对控件执行 ACTION_IME_ENTER 行为. */

let { AccessibilityActionCompat } = androidx.core.view.accessibility.AccessibilityNodeInfoCompat;

let w = focusable().contentMatch(/name/).findOnce();
w.performAction(AccessibilityActionCompat.ACTION_IME_ENTER.id);
```

有些 `行为 (Action)` 需要指定参数, 此时可借助 [ActionArgument](#i-actionargument) 接口传入参数:

```js
/* 对控件执行 ACTION_SET_TEXT 及 ACTION_SET_SELECTION 行为. */

let { AccessibilityNodeInfoCompat } = androidx.core.view.accessibility
let { AccessibilityActionCompat } = AccessibilityNodeInfoCompat;
let { ActionArgument } = org.autojs.autojs.core.automator;

let w = focusable().contentMatch(/name/).findOnce();

/* ACTION_SET_TEXT 需要一个 ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE "行为参数". */
w.performAction(
    AccessibilityActionCompat.ACTION_SET_TEXT.id,
    ActionArgument.CharSequenceActionArgument(AccessibilityNodeInfoCompat.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE, "hello"),
);

/* ACTION_SET_SELECTION 需要两个 "行为参数", */
/* ACTION_ARGUMENT_SELECTION_START_INT 及 ACTION_ARGUMENT_SELECTION_END_INT. */
w.performAction(
    AccessibilityActionCompat.ACTION_SET_SELECTION.id,
    ActionArgument.IntActionArgument(AccessibilityNodeInfoCompat.ACTION_ARGUMENT_SELECTION_START_INT, 1),
    ActionArgument.IntActionArgument(AccessibilityNodeInfoCompat.ACTION_ARGUMENT_SELECTION_END_INT, 4),
);
```

`UiObject` 拥有另一个实例方法 [performAction(action, bundle)](uiObjectType#performactionaction-bundle), 因此上述示例也可改写为:

```js
let arguments = new android.os.Bundle();
arguments.putInt(AccessibilityNodeInfoCompat.ACTION_ARGUMENT_SELECTION_START_INT, 1);
arguments.putInt(AccessibilityNodeInfoCompat.ACTION_ARGUMENT_SELECTION_END_INT, 4);
w.performAction(AccessibilityActionCompat.ACTION_SET_SELECTION.id, arguments);
```

如需判断控件是否有某个或某些 `Action`, 可使用 [UiObject#hasAction](uiObjectType#m-hasaction):

```js
console.log(w.hasAction("ACTION_CLICK"));
console.log(w.hasAction("CLICK")); /* 前缀 "ACTION_" 可省略. */

/* 检查是否同时拥有多个 Action. */
console.log(w.hasAction("CLICK", "IME_ENTER", "SCROLL_UP"));
```

如需使用 `Action` 选择器筛选控件, 可使用 [UiSelector#action](uiSelectorType#m-action):

```js
console.log(action("ACTION_CLICK").findOnce());
console.log(action("CLICK").findOnce()); /* 前缀 "ACTION_" 可省略. */

/* 筛选多个 Action. */
console.log(action("CLICK", "IME_ENTER", "SCROLL_UP").findOnce());
```

## [m=] click

### click()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 点击 ] 行为.

检查一个控件节点是否可点击:

```js
console.log(w.clickable());
console.log(w.isClickable()); /* 同上. */
```

以下情况可能导致 `w.click()` 返回 `false`:

- 控件不可点击 (`w.clickable()` 为 `false`)
- 页面无法响应点击事件

有时会出现虽然 `w` 不可点击但 `w.parent()` 或 `w.parent().parent()` 等父级控件可点击的情况:

```js
function tryClick(w) {
    let max = 3;
    let tmp = w;
    while (max--) {
        tmp = tmp.parent();
        if (tmp.isClickable()) {
            return tmp.click();
        }
    }
    return false;
}

console.log(tryClick(w));

/* 上述过程可使用 pickup 简化. */
console.log(pickup(w, 'k3', 'click'));
```

使用控件的 `click` 方法主要优缺点 (相较于坐标模拟点击):

- [优] 速度较快
- [优] 适用于位置不断变化的控件
- [优] 适用于不在窗口可视化范围内的控件
- [优] 适用于上层被其他控件覆盖或遮挡的控件
- [劣] 部分控件难以通过选择器精确定位
- [劣] 部分控件执行 `click` 行为后无响应
- [劣] 无法完全适应控件属性或层级关系改变的情况

鉴于上述优劣项, 控件的 `click` 方法通常与 [ [global.click](global#m-click) ([automator.click](automator#m-click)) / [UiObject#clickByBounds](uiObjectType#m-clickbybounds) ] 等方法配合使用.

## [m=] longClick

### longClick()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 长按 ] 行为.

检查一个控件节点是否可长按:

```js
console.log(w.longClickable());
console.log(w.isLongClickable()); /* 同上. */
```

以下情况可能导致 `w.longClick()` 返回 `false`:

- 控件不可长按 (`w.longClickable()` 为 `false`)
- 页面无法响应长按事件

## [m=] accessibilityFocus

### accessibilityFocus()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 获取无障碍焦点 ] 行为.

只有在当前设备启用了无障碍软件 (如 [TalkBack](https://support.google.com/accessibility/android/topic/10601570?hl=zh-Hans)) 才能正常使用 accessibilityFocus().

以 TalkBack 为例, 启用后, 当前窗口中获取无障碍焦点的控件将被绿色方框标记其边界, 此时按下键盘回车键或无障碍设备 (如 [D-pad](https://en.wikipedia.org/wiki/D-pad)) 的确定键 (取决于不同设备), 即可激活此控件.

```js
/* 获得无障碍焦点. */
console.log(pickup(idEndsWith('fab'), 'accessibilityFocus')); /* boolean 类型结果. */

/* 检查是否已获得无障碍焦点. */
console.log(pickup(idEndsWith('fab'), 'accessibilityFocused')); /* boolean 类型结果. */
```

如需清除焦点, 可使用 [clearAccessibilityFocus](#m-clearaccessibilityfocus) 方法.

## [m=] clearAccessibilityFocus

### clearAccessibilityFocus()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 清除无障碍焦点 ] 行为.

只有在当前设备启用了无障碍软件 (如 [TalkBack](https://support.google.com/accessibility/android/topic/10601570?hl=zh-Hans)) 才能正常使用 clearAccessibilityFocus().

```js
/* 清除无障碍焦点. */
console.log(pickup(idEndsWith('fab'), 'clearAccessibilityFocus')); /* boolean 类型结果. */
```

## [m=] focus

### focus()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 获取焦点 ] 行为.

在当前设备连接外置键盘等输入设备时, 按下 TAB 或 方向键可在控件之间 "切换", 这些控件都是 focusable (可被聚焦) 的.

```js
/* 查看控件是否可被聚焦. */
console.log(w.focusable());
console.log(w.isFocusable()); /* 同上. */
```

当控件被聚焦 (即获取焦点) 后, 可使用输入设备的 ENTER 或 OK 等表示确认的按键激活此控件.  
如果此控件支持文本输入 (例如常见的 EditText 类型控件), 在被聚焦后, 将出现输入光标, 且可能会弹出软键盘用于用户输入内容.

```js
/* 打印当前窗口支持聚焦的控件文本内容数组. */
console.log(pickup({ focusable: true }, 'txt[]'));

/* 按文本内容筛选一个控件并使其获得焦点. */
pickup([ { focusable: true }, /search/ ], 'focus');
```

如需清除焦点, 可使用 [clearFocus](#m-clearfocus) 方法.

## [m=] clearFocus

### clearFocus()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 清除焦点 ] 行为.

对一个可被聚焦的控件, 如果它没有获得焦点, 调用 clearFocus 方法时将返回 false.

```js
/* w 可被聚焦, 但当前未获得焦点. */
console.log(w.focusable()); // true
console.log(w.isFocused()); // false

/* isFocused 返回 false, 因此 clearFocus 也返回 false. */
console.log(w.clearFocus()); // false
```

## [m=] dragStart

### dragStart()

**`6.2.0`** **`A11Y`** **`API>=32`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 拖放开始 ] 行为.

此操作将初始化系统内部的拖放 (Drag & Drop) 功能.  
支持拖放的内容将在拖放行为开始前完成准备.

## [m=] dragDrop

### dragDrop()

**`6.2.0`** **`A11Y`** **`API>=32`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 拖放放下 ] 行为.

此操作针对于已开始 ACTION_DRAG_START 行为的拖放目标.

## [m=] dragCancel

### dragCancel()

**`6.2.0`** **`A11Y`** **`API>=32`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 拖放取消 ] 行为.

此操作针对于已开始 ACTION_DRAG_START 行为的拖放目标.

## [m=] imeEnter

### imeEnter()

**`6.2.0`** **`A11Y`** **`API>=30`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 输入法 ENTER 键 ] 行为.

此操作通常只对获得焦点且可编辑的控件有效.

通常 imeEnter 用来模拟回车键在文本控件实现换行功能.  
另外也可以模拟某些表示确认的操作, 如 [ 搜索 / 发送 / 下一步 / 立即前往 / 开始执行 ] 等.

```js
/* 模拟回车键. */
console.log(pickup({
    className: 'EditText',
    focused: true,
}, 'imeEnter')); /* e.g. true */
```

## [m=] moveWindow

### moveWindow(x, y)

**`6.2.0`** **`A11Y`** **`API>=26`**

- **x** { [number](dataTypes#number) } - X 坐标
- **y** { [number](dataTypes#number) } - Y 坐标
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 移动窗口到新位置 ] 行为.

## [m=] nextAtMovementGranularity

### nextAtMovementGranularity(granularity, isExtendSelection)

**`6.2.0`** **`A11Y`**

- **granularity** { [number](dataTypes#number) } - 粒度
- **isExtendSelection** { [boolean](dataTypes#boolean) } - 是否扩展选则文本
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 按粒度移至下一位置 ] 行为.

按指定粒度移动光标到下一个文本实体位置, 例如移动到下一个单词, 下一行, 下一个段落等.

```js
const AccessibilityNodeInfo = android.view.accessibility.AccessibilityNodeInfo;

let w = pickup([ /.+/, { className: 'EditText' } ]);

/* 按 WORD (单词) 粒度移动. */
/* 除 WORD 外, 还支持 CHARACTER (字符), LINE (行), PARAGRAPH (段落), PAGE (页) 等粒度. */
w.nextAtMovementGranularity(AccessibilityNodeInfo.MOVEMENT_GRANULARITY_WORD, false);
```

## [m=] nextHtmlElement

### nextHtmlElement(element)

**`6.2.0`** **`A11Y`**

- **element** { [string](dataTypes#string) } - 元素名称
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 按元素移至下一位置 ] 行为.

按指定元素名称移动焦点至下一元素位置, 例如移动到下一个按钮, 下一个列表, 下一个输入框等.

```js
console.log(w.nextHtmlElement("BUTTON"));
```

## [m=] pageLeft

### pageLeft()

**`6.2.0`** **`A11Y`** **`API>=29`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 使视窗左移的翻页 ] 行为.

此操作使视窗向左移动, 以便将可翻页控件左侧的更多内容 (如有) 展示在视窗内.  
对于触屏设备, 此操作相当于按住屏幕并向右拖动视图.

- 新可视化内容: 左.
- 视窗移动方向: 左.
- 视图移动方向: 右.

## [m=] pageUp

### pageUp()

**`6.2.0`** **`A11Y`** **`API>=29`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 使视窗上移的翻页 ] 行为.

此操作使视窗向上移动, 以便将可翻页控件上方的更多内容 (如有) 展示在视窗内.  
对于触屏设备, 此操作相当于按住屏幕并向下拖动视图.

- 新可视化内容: 上.
- 视窗移动方向: 上.
- 视图移动方向: 下.

## [m=] pageRight

### pageRight()

**`6.2.0`** **`A11Y`** **`API>=29`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 使视窗右移的翻页 ] 行为.

此操作使视窗向右移动, 以便将可翻页控件右侧的更多内容 (如有) 展示在视窗内.  
对于触屏设备, 此操作相当于按住屏幕并向左拖动视图.

- 新可视化内容: 右.
- 视窗移动方向: 右.
- 视图移动方向: 左.

## [m=] pageDown

### pageDown()

**`6.2.0`** **`A11Y`** **`API>=29`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 使视窗下移的翻页 ] 行为.

此操作使视窗向下移动, 以便将可翻页控件下方的更多内容 (如有) 展示在视窗内.  
对于触屏设备, 此操作相当于按住屏幕并向上拖动视图.

- 新可视化内容: 下.
- 视窗移动方向: 下.
- 视图移动方向: 上.

## [m=] pressAndHold

### pressAndHold()

**`6.2.0`** **`A11Y`** **`API>=30`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 按住 ] 行为.

按住即按下并保持, 与 ACTION_LONG_CLICK (长按) 不同.  
如果控件的单一行为响应是为 "长按" 设计的, 则应该使用封装的 longClick 方法, 而非 pressAndHold 方法.  
只有控件存在对 "按住" 行为的响应, 才会使 pressAndHold 有效.  
通常控件不会同时存在上述两种行为的响应.

## [m=] previousAtMovementGranularity

### previousAtMovementGranularity(granularity, isExtendSelection)

**`6.2.0`** **`A11Y`**

- **granularity** { [number](dataTypes#number) } - 粒度
- **isExtendSelection** { [boolean](dataTypes#boolean) } - 是否扩展选则文本
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 按粒度移至上一位置 ] 行为.

按指定粒度移动光标到上一个文本实体位置, 例如移动到上一个单词, 上一行, 上一个段落等.

```js
const AccessibilityNodeInfo = android.view.accessibility.AccessibilityNodeInfo;

let w = pickup([ /.+/, { className: 'EditText' } ]);

/* 按 WORD (单词) 粒度移动. */
/* 除 WORD 外, 还支持 CHARACTER (字符), LINE (行), PARAGRAPH (段落), PAGE (页) 等粒度. */
w.previousAtMovementGranularity(AccessibilityNodeInfo.MOVEMENT_GRANULARITY_WORD, false);
```

## [m=] previousHtmlElement

### previousHtmlElement(element)

**`6.2.0`** **`A11Y`**

- **element** { [string](dataTypes#string) } - 元素名称
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 按元素移至上一位置 ] 行为.

按指定元素名称移动焦点至上一元素位置, 例如移动到上一个按钮, 上一个列表, 上一个输入框等.

```js
console.log(w.previousHtmlElement("BUTTON"));
```

## [m=] showTextSuggestions

### showTextSuggestions()

**`6.2.0`** **`A11Y`** **`API>=33`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 显示文本建议 ] 行为.

此操作将为一个可编辑文本的控件显示相关输入建议.

## [m=] showTooltip

### showTooltip()

**`6.2.0`** **`A11Y`** **`API>=28`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 显示工具提示信息 ] 行为.

此操作通常只对其视图未在显示工具提示信息的控件有效.

## [m=] hideTooltip

### hideTooltip()

**`6.2.0`** **`A11Y`** **`API>=28`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 隐藏工具提示信息 ] 行为.

此操作通常只对其视图正在显示工具提示信息的控件有效.

## [m=] show

### show()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 显示在视窗内 ] 行为.

此操作使控件的所有边界全部出现在视窗内部.  
如有需要, 页面会发生滚动.

```js
/* "关于应用与开发者" 按钮部分 (或全部) 位于视窗外部. */
let w = pickup("关于应用与开发者");

if (w !== null) {
    /* 控件将随着页面滚动到视窗内部. */
    w.show();
}
```

> 参阅 [View.requestRectangleOnScreen(Rect)](https://developer.android.com/reference/android/view/View#requestRectangleOnScreen(android.graphics.Rect))

## [m=] dismiss

### dismiss()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 消隐 ] 行为.

检查一个控件节点是否可消隐:

```js
console.log(w.dismissable());
console.log(w.isDismissable()); /* 同上. */
```

## [m=] copy

### copy()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 复制文本 ] 行为.

此操作将控件的已选中文本内容复制到剪贴板.

## [m=] cut

### cut()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 剪切文本 ] 行为.

此操作将控件的已选中文本内容剪切并置于剪贴板.

## [m=] paste

### paste()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 粘贴文本 ] 行为.

此操作将剪贴板的文本内容粘贴到控件的可编辑文本区域.

需额外留意, 自 [Android API 29 (10) [Q]](apiLevel) 起, 剪贴板数据的访问将受到限制.  
详情参阅 [getClip](global#m-getclip).

## [m=] select

### select()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 选中 ] 行为.

此操作将选中当前控件.

检查一个控件节点是否已被选中:

```js
console.log(w.selected());
console.log(w.isSelected()); /* 同上. */
```

## [m=] expand

### expand()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 展开 ] 行为.

此操作用于展开可展开的控件.

## [m=] collapse

### collapse()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 折叠 ] 行为.

此操作用于折叠 (或收起) 可展开的控件.

## [m=] scrollLeft

### scrollLeft()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 使视窗左移的滚动 ] 行为.

此操作使视窗向左移动, 以便将可滚动控件左侧的更多内容 (如有) 展示在视窗内.  
对于触屏设备, 此操作相当于按住屏幕并向右拖动视图.

- 新可视化内容: 左.
- 视窗移动方向: 左.
- 视图移动方向: 右.

## [m=] scrollUp

### scrollUp()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 使视窗上移的滚动 ] 行为.

此操作使视窗向上移动, 以便将可滚动控件上方的更多内容 (如有) 展示在视窗内.  
对于触屏设备, 此操作相当于按住屏幕并向下拖动视图.

- 新可视化内容: 上.
- 视窗移动方向: 上.
- 视图移动方向: 下.

## [m=] scrollRight

### scrollRight()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 使视窗右移的滚动 ] 行为.

此操作使视窗向右移动, 以便将可滚动控件右侧的更多内容 (如有) 展示在视窗内.  
对于触屏设备, 此操作相当于按住屏幕并向左拖动视图.

- 新可视化内容: 右.
- 视窗移动方向: 右.
- 视图移动方向: 左.

## [m=] scrollDown

### scrollDown()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 使视窗下移的滚动 ] 行为.

此操作使视窗向下移动, 以便将可滚动控件下方的更多内容 (如有) 展示在视窗内.  
对于触屏设备, 此操作相当于按住屏幕并向上拖动视图.

- 新可视化内容: 下.
- 视窗移动方向: 下.
- 视图移动方向: 上.

## [m=] scrollForward

### scrollForward()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 使视窗前移的滚动 ] 行为.

此操作使视窗向前移动, 以便将可滚动控件前方的更多内容 (如有) 展示在视窗内.  
对于触屏设备, 此操作相当于按住屏幕并向后拖动视图.

- 新可视化内容: 前.
- 视窗移动方向: 前.
- 视图移动方向: 后.

> 注: "前" 包括 "左" 或 "上", "后" 包括 "右" 或 "下".

## [m=] scrollBackward

### scrollBackward()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 使视窗后移的滚动 ] 行为.

此操作使视窗向后移动, 以便将可滚动控件后方的更多内容 (如有) 展示在视窗内.  
对于触屏设备, 此操作相当于按住屏幕并向前拖动视图.

- 新可视化内容: 后.
- 视窗移动方向: 后.
- 视图移动方向: 前.

> 注: "前" 包括 "左" 或 "上", "后" 包括 "右" 或 "下".

## [m=] scrollTo

### scrollTo(row, column)

**`A11Y`**

- **row** { [number](dataTypes#number) } - 行序数
- **column** { [number](dataTypes#number) } - 列序数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 将指定位置滚动至视窗内 ] 行为.

此操作将集合中指定位置 (以 "行" 和 "列" 标记) 滚动至视窗内.

```js
scrollable().find().some((w) => {
    let info = w.getCollectionInfo();
    if (info !== null) {
        console.log(info.getRowCount()); /* e.g. 17 */
        console.log(info.getColumnCount()); /* e.g. 2 */
        
        let randRow = Mathx.randInt(info.getRowCount() - 1);
        let randColumn = Mathx.randInt(info.getColumnCount() - 1);
        console.log(`${randRow},${randColumn}`); /* e.g. 10,1 */
        
        console.log(w.scrollTo(randRow, randColumn)); /* e.g. false */
        
        return /* @some */ true;
    }
});
```

## [m=] contextClick

### contextClick()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 上下文点击 ] 行为.

此操作通常会弹出一个上下文菜单, 类似鼠标右键菜单.

> 注: 在 Microsoft Windows 操作系统中, 单击鼠标右键 (或按下键盘的菜单键) 即类似控件的 Context Click (上下文点击) 行为, 弹出的右键菜单又称为 Context Menu (上下文菜单).

## [m=] setText

### setText(text)

**`A11Y`**

- **text** { [string](dataTypes#string) } - 文本
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 设置文本 ] 行为.

此操作将使用新文本替换原有文本, 并将光标置于文本末尾.

```js
let w = pickup({ className: 'EditText' });

/* 设置文本为 "hello". */
w.setText("hello");

/* 清空文本. */
w.setText("");
```

## [m=] setSelection

### setSelection(start, end)

**`A11Y`**

- **start** { [number](dataTypes#number) } - 开始位置
- **end** { [number](dataTypes#number) } - 结束位置
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 选择文本 ] 行为.

此操作将按指定范围选中控件的文本内容.

```js
let w = pickup({ className: 'EditText' });

/* 选中 2 - 3 的 1 个文本, 起始光标停留在 2 位置, 末尾光标停留在 3 位置. */
w.setSelection(2, 3);

/* 无任何效果, 光标不发生变化. */
w.setSelection(2, 0);
w.setSelection(2, -5);

/* 抛出异常. */
w.setSelection(NaN, 0);
w.setSelection(Infinity, 0);

/* 选中 0 个文本, 此时起始和末尾两个光标重合. */
w.setSelection(2, 2);
```

## [m=] clearSelection

### clearSelection()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 取消选择文本 ] 行为.

## [m=] setProgress

### setProgress(progress)

**`A11Y`**

- **progress** { [number](dataTypes#number) } - 进度值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [ 设置进度值 ] 行为.

```js
pickup({ action: ['SET_PROGRESS'] }, '[]').some((w) => {
    const info = w.getRangeInfo();
    if (info !== null) {
        console.log(w.getMin(), w.getMax());
        let randProgress = Mathx.randInt(w.getMin(), w.getMax());
        console.log(randProgress);
        console.log(w.setProgress(randProgress));
    }
});
```

## [I] ActionArgument

控件的行为参数接口.  
主要用于自定义控件行为的 [performAction](#m-performaction) 抽象方法内.

### [C] IntActionArgument

ActionArgument 的具体类.  
用于传递 Int 类型的行为参数.

#### [c] (name, value)

- **name** { [string](dataTypes#string) } - 行为名称
- **value** { [number](dataTypes#number) } - 行为参数值
- <ins>**returns**</ins> { [ActionArgument](#i-actionargument) }

构造一个 Int 类型的行为参数.

```js
/* 模拟 scrollTo 封装方法. */
function scrollTo(x, y) {
    return w.performAction(
        AccessibilityActionCompat.ACTION_SCROLL_TO_POSITION.id,
        ActionArgument.IntActionArgument(AccessibilityNodeInfoCompat.ACTION_ARGUMENT_ROW_INT, x),
        ActionArgument.IntActionArgument(AccessibilityNodeInfoCompat.ACTION_ARGUMENT_COLUMN_INT, y),
    );
}
```

### [C] BooleanActionArgument

ActionArgument 的具体类.  
用于传递 Boolean 类型的行为参数.

#### [c] (name, value)

- **name** { [string](dataTypes#string) } - 行为名称
- **value** { [boolean](dataTypes#boolean) } - 行为参数值
- <ins>**returns**</ins> { [ActionArgument](#i-actionargument) }

构造一个 Boolean 类型的行为参数.

```js
/* 模拟 nextAtMovementGranularity 封装方法. */
function nextAtMovementGranularity(granularity, isExtendSelection) {
    return w.performAction(
        AccessibilityActionCompat.ACTION_NEXT_AT_MOVEMENT_GRANULARITY.id,
        ActionArgument.IntActionArgument(AccessibilityNodeInfoCompat.ACTION_ARGUMENT_MOVEMENT_GRANULARITY_INT, granularity),
        ActionArgument.BooleanActionArgument(AccessibilityNodeInfoCompat.ACTION_ARGUMENT_EXTEND_SELECTION_BOOLEAN, isExtendSelection),
    );
}
```

### [C] CharSequenceActionArgument

ActionArgument 的具体类.  
用于传递 CharSequence 类型的行为参数.

#### [c] (name, value)

- **name** { [string](dataTypes#string) } - 行为名称
- **value** { [string](dataTypes#string) } - 行为参数值
- <ins>**returns**</ins> { [ActionArgument](#i-actionargument) }

构造一个 CharSequence 类型的行为参数.

```js
/* 模拟 setText 封装方法. */
function setText(text) {
    return w.performAction(
        AccessibilityActionCompat.ACTION_SET_TEXT.id,
        ActionArgument.IntActionArgument(AccessibilityNodeInfoCompat.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE, text),
    );
}
```

### [C] StringActionArgument

ActionArgument 的具体类.  
用于传递 String 类型的行为参数.

#### [c] (name, value)

- **name** { [string](dataTypes#string) } - 行为名称
- **value** { [string](dataTypes#string) } - 行为参数值
- <ins>**returns**</ins> { [ActionArgument](#i-actionargument) }

构造一个 String 类型的行为参数.

```js
/* 模拟 nextHtmlElement 封装方法. */
function nextHtmlElement(element) {
    return w.performAction(
        AccessibilityActionCompat.ACTION_NEXT_HTML_ELEMENT.id,
        ActionArgument.StringActionArgument(AccessibilityNodeInfoCompat.ACTION_ARGUMENT_HTML_ELEMENT_STRING, element),
    );
}
```

### [C] FloatActionArgument

ActionArgument 的具体类.  
用于传递 Float 类型的行为参数.

#### [c] (name, value)

- **name** { [string](dataTypes#string) } - 行为名称
- **value** { [number](dataTypes#number) } - 行为参数值
- <ins>**returns**</ins> { [ActionArgument](#i-actionargument) }

构造一个 Float 类型的行为参数.

```js
/* 模拟 setProgress 封装方法. */
function nextHtmlElement(progress) {
    return w.performAction(
        AccessibilityActionCompat.ACTION_SET_PROGRESS.id,
        ActionArgument.FloatActionArgument(AccessibilityNodeInfoCompat.ACTION_ARGUMENT_PROGRESS_VALUE, progress),
    );
}
```

# 全局行为重定向

本章节所有控件行为对应的方法 **名称** 均已全局化, 即支持 [ `click()` / `paste()` / `scrollDown()` / `show()` ] 等全局直接调用的方式来使用.  
这些方法多数是 UiSelector 实例方法的直接绑定, 但有部分方法被 SimpleActionAutomator 覆盖.

下表列出了控件行为方法对应的绑定源.  
其中 AUTO 代表 SimpleActionAutomator, SEL 代表 UiSelector.

| Global Actions                | AUTO | SEL |        
|-------------------------------|:----:|:---:|
| accessibilityFocus            |      |  √  |
| clearAccessibilityFocus       |      |  √  |
| clearFocus                    |      |  √  |
| clearSelection                |      |  √  |
| click                         |  √   |     |
| collapse                      |      |  √  |
| contextClick                  |      |  √  |
| copy                          |      |  √  |
| cut                           |      |  √  |
| dismiss                       |      |  √  |
| dragCancel                    |      |  √  |
| dragDrop                      |      |  √  |
| dragStart                     |      |  √  |
| expand                        |      |  √  |
| focus                         |      |  √  |
| hideTooltip                   |      |  √  |
| imeEnter                      |      |  √  |
| longClick                     |  √   |     |
| moveWindow                    |      |  √  |
| nextAtMovementGranularity     |      |  √  |
| nextHtmlElement               |      |  √  |
| pageDown                      |      |  √  |
| pageLeft                      |      |  √  |
| pageRight                     |      |  √  |
| pageUp                        |      |  √  |
| paste                         |      |  √  |
| pressAndHold                  |      |  √  |
| previousAtMovementGranularity |      |  √  |
| previousHtmlElement           |      |  √  |
| scrollBackward                |      |  √  |
| scrollDown                    |  √   |     |
| scrollForward                 |      |  √  |
| scrollLeft                    |      |  √  |
| scrollRight                   |      |  √  |
| scrollTo                      |      |  √  |
| scrollUp                      |  √   |     |
| select                        |      |  √  |
| setProgress                   |      |  √  |
| setSelection                  |      |  √  |
| setText                       |  √   |     |
| show                          |      |  √  |
| showTextSuggestions           |      |  √  |
| showTooltip                   |      |  √  |

截至目前 (2022/11), 只有 [ click, longClick, scrollDown, scrollUp, setText ] 全局方法属于 SimpleActionAutomator.

```js
copy(); /* 相当于 selector().copy(). */
paste(); /* 相当于 selector().paste(). */
clearFocus(); /* 相当于 selector().clearFocus(). */
imeEnter(); /* 相当于 selector().imeEnter(). */

click(1, 2); /* 相当于 automator.click(1, 2). */
longClick(1, 2); /* 相当于 automator.longClick(1, 2). */
setText("hello"); /* 相当于 automator.setText("hello"). */
scrollUp(); /* 相当于 automator.scrollUp(). */
scrollDown(); /* 相当于 automator.scrollDown(). */
```

通过 [performAction](#m-performaction) 小节可知, UiSelector 的控件行为方法实际是对当前窗口中所有控件全部执行一次 Action, 因此几乎所有 UiSelector 的控件行为方法均不建议使用.

全局方法 [paste](#m-paste) 是使用率相对较高的控件行为, 且效果往往与预期相符.  
有关全局方法 `paste` 的执行过程及原理分析可参阅 [UiSelector#paste](uiSelectorType#m-paste) 小节.