# 控件集合 (UiObjectCollection)

UiObjectCollection 代表 [控件节点 (UiObject)](uiObjectType) 的对象集合.

---

<p style="font: bold 2em sans-serif; color: #FF7043">UiObjectCollection</p>

---

## [@] UiObjectCollection

**`Global`**

AutoJs6 中几乎所有 UiObjectCollection 实例均已借助 Rhino 引擎将其包装为了 NativeArray 类型.  
因此 JavaScript 的 Array 原型方法在 UiObjectCollection 实例上可以直接使用:

```js
let wc = contentMatch(/.+/).find();
wc.toArray().forEach(w => console.log(w.content()));
wc.forEach(w => console.log(w.content())); /* 效果同上. */

/* 包装后的对象 "是" 一个 JavaScript 数组. */
console.log(Array.isArray(wc)); // true

/* Array 的原型方法 slice. */
console.log(typeof wc.slice); // 'function'
console.log(wc.slice === Array.prototype.slice); // true

/* UiObjectCollection "类" 的实例方法依然全部可用 (如 size, click, each 等). */
console.log(typeof wc.size); // 'function'
console.log(typeof wc.click); // 'function'
console.log(typeof wc.each); // 'function'
```

经过包装的 UiObjectCollection 将不能通过 instanceof 判断其类型, 但仍可通过 getClass 方法判断:

```js
let wc = contentMatch(/.+/).find();
console.log(wc instanceof UiObjectCollection); // false
console.log(wc.getClass() === UiObjectCollection); // true
```

除上述 find 方法, children, untilFind, findOf 以及附带集合类结果筛选器的 pickup, 返回的也都是一个经过包装的 UiObjectCollection:

```js
let s = contentMatch(/.+/);
let w = pickup(s);
let wcList = [
    s.find(),
    s.untilFind(),
    s.findOf(w && w.compass('p2') || pickup()),
    pickup(s, '{}'),
];
console.log(wcList.every(o => o.getClass() === UiObjectCollection)); // true
```

当 pickup 使用 children 等作为结果筛选器时, 返回的是不经过包装的 UiObjectCollection, 因此需要使用一次 toArray 方法才能使用 JavaScript 的数组相关方法:

```js
let wc = pickup(/.+/, 'p', 'children');
/* 需使用 toArray 进行一次转换. */
wc.toArray().forEach(w => console.log(w.content()));

/* 直接使用 children 方法则不需要 toArray 转换. */
pickup(/.+/, 'p').children().forEach( /* ... */ );
```

UiObjectCollection 可能为空集合:

```js
/* 空集合. */
let wc = contentMatch(/[^\s\S]/).find();

console.log(wc.length); // 0

/* 即使是空集合, 依然是 UiObjectCollection 类型. */
console.log(wc === null); // false
console.log(wc.getClass() === UiObjectCollection); // true
```

集合的遍历即可用 UiObjectCollection 的实例方法 (如 each), 或使用 JavaScript 的数组遍历方法 (如 forEach), 或使用 [ for / for...in (不推荐) / for...of ] 循环:

```js
/**
 * @type {UiObjectCollection | Array<UiObject>}
 */
let wc = pickup(/.+/, 'wc');

wc.each(w => console.log(detect(w, 'txt')));

wc.forEach(w => console.log(detect(w, 'txt')));

for (let i = 0; i < wc.length; i += 1) {
    console.log(detect(wc[i], 'txt'));
}

for (let i in wc) {
    if (wc.hasOwnProperty(i) && /^\d+$/.test(i)) {
        console.log(detect(wc[i], 'txt'));
    }
}

for (let w of wc) {
    console.log(detect(w, 'txt'));
}
```

控件集合支持 [控件行为 (UiObject Action)](uiObjectActionsType).  
如 [ click / longClick / imeEnter / setText / focus ] 等.

performAction 源码摘要:

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

由源码摘要可知, 控件集合执行控件行为, 相当于使集合中所有控件依次执行一次控件行为:

```js
let wc = contentMatch(/[^\s\S]/).find();

/* 对控件集合执行 click 控件行为. */
wc.click();

/* 相当于对集合中每个控件元素执行控件行为. */
wc.forEach(w => {
    if (w !== null) {
        w.click();
    }
});
```

执行控件行为后, 返回结果是 [boolean](dataTypes#boolean) 类型, 表示集合中所有控件在执行行为过程中未出现失败或异常.

常见相关方法或属性:

- [UiObject#find](uiObjectType#m-find)
- [UiObject#children](uiObjectType#m-children)
- [UiSelector#find](uiSelectorType#m-find)
- [UiSelector#untilFind](uiSelectorType#m-untilfind)
- [UiSelector.pickup](uiSelectorType#m-pickup)

## [m#] isEmpty

### isEmpty()

**`6.2.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回集合是否为空.

## [m#] isNotEmpty

### isNotEmpty()

**`6.2.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回集合是否非空.

## [m#] empty

### empty()

**`DEPRECATED`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回集合是否为空.

已弃用, 建议使用 [isEmpty](#m-isempty) 替代.

## [m#] nonEmpty

### nonEmpty()

**`DEPRECATED`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回集合是否非空.

已弃用, 建议使用 [isNotEmpty](#m-isnotempty) 替代.

## [m#] toArray

### toArray()

- <ins>**returns**</ins> { [JavaArray](dataTypes#javaarray)<[UiObject](uiObjectType)> }

转换集合为 [Java 数组](dataTypes#javaarray).

## [m#] toList

### toList()

**`6.2.0`**

- <ins>**returns**</ins> { [JavaArrayList](dataTypes#javaarraylist)<[UiObject](uiObjectType)> }

转换集合为 [Java 数组列表](dataTypes#javaarraylist).

## [m#] get

### get(i)

**`DEPRECATED`**

- <ins>**returns**</ins> { [UiObject](uiObjectType) }

按索引获取集合中的 UiObject 元素.

已弃用, 建议使用数组下标形式访问元素.

```js
let wc = pickup(/.+/, '{}');
if (wc.length >= 2) {
    console.log(wc.get(2) instanceof UiObject); // true
    console.log(wc[2] instanceof UiObject); // true
}
```

## [m#] size

### size()

**`DEPRECATED`**

- <ins>**returns**</ins> { [UiObject](uiObjectType) }

返回集合大小.

已弃用, 建议使用 length 属性.

```js
let wc = pickup(/.+/, '{}');
console.log(wc.size()); // e.g. 23
console.log(wc.length); // e.g. 23
```

## [m#] each

### each(consumer)

**`DEPRECATED`**

- **consumer** { [(](dataTypes#function)w: [UiObject](uiObjectType)[)](dataTypes#function) [=>](dataTypes#function) [void](dataTypes#void) } - 消费者
- <ins>**returns**</ins> { [UiObjectCollection](uiObjectCollectionType) }

对集合中每个元素执行一次消费.

已弃用, 建议使用 [forEach](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).

```js
let wc = pickup(/.+/, '{}');
wc.each(w => console.log(w.content()));
wc.forEach(w => console.log(w.content()));
```

## [m#] find

### find(selector)

**`A11Y`**

- **selector** { [UiSelector](uiSelectorType) } - 选择器
- <ins>**returns**</ins> { [UiObjectCollection](uiObjectCollectionType) }

筛选新的控件集合.

以集合中每一个元素为根节点, 依次按选择器筛选出所有满足条件的后代节点加入新集合, 将此新集合作为返回结果.

```js
/* 例如此集合中共有 3 个控件. */
let wc = pickup(/.+/);
console.log(wc.length); // 3

/* 3 个控件作为根节点, 其所有的子孙节点分别有 10, 50, 200 个. */
console.log(wc.map(w => w.find().length)); // [ 10, 50, 200 ]

/* 其中 clickable 为 true 的控件分别有 2, 3, 4 个. */
console.log(wc.map(w => w.find().filter(c => c.clickable()).length)); // [ 2, 3, 4 ]

/* 因此 wc.find(clickable(true)) 应返回 2 + 3 + 4 个. */
console.log(wc.find(clickable(true)).length); // 9
```

## [m#] findOne

### findOne(selector)

**`A11Y`**

- **selector** { [UiSelector](uiSelectorType) } - 选择器
- <ins>**returns**</ins> { [UiObject](uiObjectType) | [null](dataTypes#null) }

筛选一个控件.

以集合中每一个元素为根节点, 遍历其所有后代节点, 当满足选择器的筛选条件时, 返回此控件并停止筛选.  
无满足筛选条件的控件时返回 null.

```js
let wc = pickup(/.+/);
console.log(wc.findOne(clickable(true))); /* 返回一个可点击控件或 null. */
```

## [m#] performAction

用于执行控件集合的行为.

集合中所有控件将全部执行指定的行为.

### performAction(action, ...arguments)

**`A11Y`**

- **action** { [number](dataTypes#number) } - 行为的唯一标志符 (Action ID)
- **arguments** { [...](documentation#可变参数)[ActionArgument](uiObjectActionsType#i-actionargument)[[]](documentation#可变参数) } - 行为参数, 用于给行为传递参数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回行为是否全部执行成功.

> 注: 即使在执行过程中, 某一个控件执行失败, 后续控件依旧继续执行行为, 而非立即终止.

> 参阅: [UiObjectActions](uiObjectActionsType) 章节.

## [m#] click

### click()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 点击 ] 行为](uiObjectActionsType#m-click).

## [m#] longClick

### longClick()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 长按 ] 行为](uiObjectActionsType#m-longclick).

## [m#] accessibilityFocus

### accessibilityFocus()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 获取无障碍焦点 ] 行为](uiObjectActionsType#m-accessibilityfocus).

## [m#] clearAccessibilityFocus

### clearAccessibilityFocus()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 清除无障碍焦点 ] 行为](uiObjectActionsType#m-clearaccessibilityfocus).

## [m#] focus

### focus()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 获取焦点 ] 行为](uiObjectActionsType#m-focus).

## [m#] clearFocus

### clearFocus()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 清除焦点 ] 行为](uiObjectActionsType#m-clearfocus).

## [m#] dragStart

### dragStart()

**`6.2.0`** **`A11Y`** **`API>=32`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 拖放开始 ] 行为](uiObjectActionsType#m-dragstart).

## [m#] dragDrop

### dragDrop()

**`6.2.0`** **`A11Y`** **`API>=32`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 拖放放下 ] 行为](uiObjectActionsType#m-dragdrop).

## [m#] dragCancel

### dragCancel()

**`6.2.0`** **`A11Y`** **`API>=32`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 拖放取消 ] 行为](uiObjectActionsType#m-dragcancel).

## [m#] imeEnter

### imeEnter()

**`6.2.0`** **`A11Y`** **`API>=30`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 输入法 ENTER 键 ] 行为](uiObjectActionsType#m-imeenter).

## [m#] moveWindow

### moveWindow(x, y)

**`6.2.0`** **`A11Y`** **`API>=26`**

- **x** { [number](dataTypes#number) } - X 坐标
- **y** { [number](dataTypes#number) } - Y 坐标
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 移动窗口到新位置 ] 行为](uiObjectActionsType#m-movewindow).

## [m#] nextAtMovementGranularity

### nextAtMovementGranularity(granularity, isExtendSelection)

**`6.2.0`** **`A11Y`**

- **granularity** { [number](dataTypes#number) } - 粒度
- **isExtendSelection** { [boolean](dataTypes#boolean) } - 是否扩展选则文本
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 按粒度移至下一位置 ] 行为](uiObjectActionsType#m-nextatmovementgranularity).

## [m#] nextHtmlElement

### nextHtmlElement(element)

**`6.2.0`** **`A11Y`**

- **element** { [string](dataTypes#string) } - 元素名称
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 按元素移至下一位置 ] 行为](uiObjectActionsType#m-nexthtmlelement).

## [m#] pageLeft

### pageLeft()

**`6.2.0`** **`A11Y`** **`API>=29`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 使视窗左移的翻页 ] 行为](uiObjectActionsType#m-pageleft).

## [m#] pageUp

### pageUp()

**`6.2.0`** **`A11Y`** **`API>=29`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 使视窗上移的翻页 ] 行为](uiObjectActionsType#m-pageup).

## [m#] pageRight

### pageRight()

**`6.2.0`** **`A11Y`** **`API>=29`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 使视窗右移的翻页 ] 行为](uiObjectActionsType#m-pageright).

## [m#] pageDown

### pageDown()

**`6.2.0`** **`A11Y`** **`API>=29`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 使视窗下移的翻页 ] 行为](uiObjectActionsType#m-pagedown).

## [m#] pressAndHold

### pressAndHold()

**`6.2.0`** **`A11Y`** **`API>=30`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 按住 ] 行为](uiObjectActionsType#m-pressandhold).

## [m#] previousAtMovementGranularity

### previousAtMovementGranularity(granularity, isExtendSelection)

**`6.2.0`** **`A11Y`**

- **granularity** { [number](dataTypes#number) } - 粒度
- **isExtendSelection** { [boolean](dataTypes#boolean) } - 是否扩展选则文本
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 按粒度移至上一位置 ] 行为](uiObjectActionsType#m-previousatmovementgranularity).

## [m#] previousHtmlElement

### previousHtmlElement(element)

**`6.2.0`** **`A11Y`**

- **element** { [string](dataTypes#string) } - 元素名称
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 按元素移至上一位置 ] 行为](uiObjectActionsType#m-previoushtmlelement).

## [m#] showTextSuggestions

### showTextSuggestions()

**`6.2.0`** **`A11Y`** **`API>=33`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 显示文本建议 ] 行为](uiObjectActionsType#m-showtextsuggestions).

## [m#] showTooltip

### showTooltip()

**`6.2.0`** **`A11Y`** **`API>=28`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 显示工具提示信息 ] 行为](uiObjectActionsType#m-showtooltip).

## [m#] hideTooltip

### hideTooltip()

**`6.2.0`** **`A11Y`** **`API>=28`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 隐藏工具提示信息 ] 行为](uiObjectActionsType#m-hidetooltip).

## [m#] show

### show()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 显示在视窗内 ] 行为](uiObjectActionsType#m-show).

## [m#] dismiss

### dismiss()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 消隐 ] 行为](uiObjectActionsType#m-dismiss).

## [m#] copy

### copy()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 复制文本 ] 行为](uiObjectActionsType#m-copy).

## [m#] cut

### cut()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 剪切文本 ] 行为](uiObjectActionsType#m-cut).

## [m#] paste

### paste()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 粘贴文本 ] 行为](uiObjectActionsType#m-paste).

## [m#] select

### select()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 选中 ] 行为](uiObjectActionsType#m-select).

## [m#] expand

### expand()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 展开 ] 行为](uiObjectActionsType#m-expand).

## [m#] collapse

### collapse()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 折叠 ] 行为](uiObjectActionsType#m-collapse).

## [m#] scrollLeft

### scrollLeft()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 使视窗左移的滚动 ] 行为](uiObjectActionsType#m-scrollleft).

## [m#] scrollUp

### scrollUp()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 使视窗上移的滚动 ] 行为](uiObjectActionsType#m-scrollup).

## [m#] scrollRight

### scrollRight()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 使视窗右移的滚动 ] 行为](uiObjectActionsType#m-scrollright).

## [m#] scrollDown

### scrollDown()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 使视窗下移的滚动 ] 行为](uiObjectActionsType#m-scrolldown).

## [m#] scrollForward

### scrollForward()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 使视窗前移的滚动 ] 行为](uiObjectActionsType#m-scrollforward).

## [m#] scrollBackward

### scrollBackward()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 使视窗后移的滚动 ] 行为](uiObjectActionsType#m-scrollbackward).

## [m#] scrollTo

### scrollTo(row, column)

**`A11Y`**

- **row** { [number](dataTypes#number) } - 行序数
- **column** { [number](dataTypes#number) } - 列序数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 将指定位置滚动至视窗内 ] 行为](uiObjectActionsType#m-scrollto).

## [m#] contextClick

### contextClick()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 上下文点击 ] 行为](uiObjectActionsType#m-contextclick).

## [m#] setText

### setText(text)

**`A11Y`**

- **text** { [string](dataTypes#string) } - 文本
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 设置文本 ] 行为](uiObjectActionsType#m-settext).

## [m#] setSelection

### setSelection(start, end)

**`A11Y`**

- **start** { [number](dataTypes#number) } - 开始位置
- **end** { [number](dataTypes#number) } - 结束位置
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 选择文本 ] 行为](uiObjectActionsType#m-setselection).

## [m#] clearSelection

### clearSelection()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 取消选择文本 ] 行为](uiObjectActionsType#m-clearselection).

## [m#] setProgress

### setProgress(progress)

**`A11Y`**

- **progress** { [number](dataTypes#number) } - 进度值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

控件集合执行 [[ 设置进度值 ] 行为](uiObjectActionsType#m-setprogress).

## [m] of

### of(list)

- **list** { [UiSelector](uiSelectorType)[[]](dataTypes#array) } - 控件数组
- <ins>**returns**</ins> { [UiObjectCollection](uiObjectCollectionType) }

将控件数组转换为 [UiObjectCollection](uiObjectCollectionType).

```js
let wA = pickup(/hello.+/);
let wB = pickup({ clickable: true });

let wc = UiObjectCollection.of([ wA, wB ]);

/* 对 UiObjectCollection 进行操作. */
wc.click();
```