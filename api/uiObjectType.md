# 控件节点 (UiObject)

UiObject 通常被称为 [ 控件 / 节点 / 控件节点 ], 可看做是一个通过安卓无障碍服务包装的 [AccessibilityNodeInfo](https://developer.android.com/reference/android/view/accessibility/AccessibilityNodeInfo) 对象, 代表一个当前活动窗口中的节点, 通过此节点可收集控件信息或执行控件行为, 进而实现一系列自动化操作.

应用界面通常由控件构成, 如 [ImageView](https://developer.android.com/reference/android/widget/ImageView) 构成图像控件, [TextView](https://developer.android.com/reference/android/widget/TextView) 构成文本控件. 通过不同的布局可决定不同控件的位置, 如 [LinearLayout (线性布局)](https://developer.android.com/reference/android/widget/LinearLayout) 按水平或垂直方式排布及显示控件, [AbsListView (列表布局)](https://developer.android.com/reference/android/widget/AbsListView) 按列表方式排布及显示控件.
不同的布局方式形成了 [控件层级](glossaries#控件层级).

控件拥有特定的属性, 可分为两种类型, 状态型及行为型.  
行为型属性可参阅章节 [控件节点行为 (UiObjectActions)](uiObjectActionsType).  
状态型属性访问均被封装为方法调用的形式, 如访问控件的类名, 需使用 `w.className()` 而非 `w.className`.

> 注: 在 AutoJs6 中, 由 [UiObject](uiObjectType) 代表一个控件节点, 它继承自 [AccessibilityNodeInfoCompat](https://developer.android.com/reference/androidx/core/view/accessibility/AccessibilityNodeInfoCompat), 而并非一个 [View](https://developer.android.com/reference/android/view/View).

---

<p style="font: bold 2em sans-serif; color: #FF7043">UiObject</p>

---

## [@] UiObject

**`Global`**

如需获取一个 UiObject 对象, 通常使用 [选择器](uiSelectorType) 获取.

```js
/* 获取一个包含任意文本的 UiObject 对象. */
let w = pickup(/.+/);

/* 当活动窗口中不存在符合筛选条件的控件时返回 null. */
console.log(w === null);

/* 使用 instanceof 操作符查看对象 w 是否为 UiObject "类" 的实例. */
console.log(w instanceof UiObject);
```

多数 UiObject 的实例方法 (如 parent 和 child 等) 均返回自身类型, 因此可实现链式调用:

```js
let w = pickup('hello');
/* 获取 w 控件的三级父控件的 2 号索引子控件. */
w.parent().parent().parent().child(2);
```

## [m#] parent

### parent(i?)

**`[6.3.3]`** **`A11Y`** **`Overload [1-2]/2`**

- **[ i = `1` ]** { [number](dataTypes#number) } - 相对级数
- <ins>**returns**</ins> { [UiObject](uiObjectType) | [null](dataTypes#null) }

返回其父控件.

当指定级数 `i` 时, 返回其对应级数的父控件.

`i` 为 `0` 时, 返回控件自身,  
`i` 为正整数时, 返回第 `i` 级父控件,  
`i` 为负数时, 将抛出异常.

```js
let w = pickup(/.+/);
w.parent();
w.parent(1); /* 同上. */
w.compass('p'); /* 同上. */
detect(w, 'p'); /* 同上. */

w.parent().parent().parent();
w.parent(3); /* 同上. */
w.compass('p3'); /* 同上. */
detect(w, 'p3'); /* 同上. */
```

## [m#] child

### child(i)

**`[6.3.3]`** **`A11Y`**

- **i** { [number](dataTypes#number) } - 索引
- <ins>**returns**</ins> { [UiObject](uiObjectType) | [null](dataTypes#null) }

返回其索引为 `i` 的子控件.

`i` 为正整数或 `0`, 返回正数索引子控件,  
`i` 为负整数, 返回倒数索引子控件,  

```js
let w = pickup(/.+/);
w.child(3);
w.compass('c3'); /* 同上. */
detect(w, 'c3'); /* 同上. */

w.child(3).child(1);
w.compass('c3c1'); /* 同上. */
detect(w, 'c3>1'); /* 同上. */

w.child(-1); /* 最后一个子控件. */

w.child(-2); /* 倒数第 2 个子控件. */
w.compass('c-2'); /* 同上. */
detect(w, 'c-2'); /* 同上. */
```

## [m#] firstChild

### firstChild()

**`6.3.3`** **`A11Y`**

- <ins>**returns**</ins> { [UiObject](uiObjectType) }

返回第一个子控件.

相当于 `child(0)`.

## [m#] lastChild

### lastChild()

**`6.3.3`** **`A11Y`**

- <ins>**returns**</ins> { [UiObject](uiObjectType) }

返回最后一个子控件.

相当于 `child(-1)`.

## [m#] childCount

### childCount()

**`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回当前节点的子控件数量.

别名属性或方法:

- `[m#]` getChildCount

## [m#] hasChildren

### hasChildren()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回当前节点是否有子节点.

相当于 `childCount() > 0`.

## [m#] children

### children()

**`A11Y`**

- <ins>**returns**</ins> { [UiObjectCollection](uiObjectCollectionType) }

返回当前节点的子控件集合.

```js
let cc = pickup({ filter: w => w.children().length > 5 }, 'children');

console.log(cc.length); /* e.g. 10 */

cc.forEach((w) => {
    let content = w.content();
    content && console.log(content);
})
```

如需返回当前节点下的所有子孙控件集合, 可使用 [UiObject#find()](#m-find).

```js
let w = pickup({ filter: w => w.children().length > 5 });
console.log(w.find().length); /* e.g. 20 */
```

## [m#] sibling

### sibling(i)

**`6.3.3`** **`A11Y`**

- **i** { [number](dataTypes#number) } - 索引
- <ins>**returns**</ins> { [UiObject](uiObjectType) | [null](dataTypes#null) }

返回其索引为 `i` 的兄弟控件.

`i` 为正整数或 `0`, 返回正数索引兄弟控件,  
`i` 为负整数, 返回倒数索引兄弟控件,  

当 `i` 与 [indexInParent()](#m-indexinparent) 相同时, 返回其自身.

```js
let w = pickup(/.+/);
w.sibling(0); /* 第 1 (索引为 0) 的兄弟控件. */
w.compass('s0'); /* 同上. */
detect(w, 's0'); /* 同上. */

w.sibling(-2); /* 倒数第 2 个兄弟控件. */
w.compass('s-2'); /* 同上. */
detect(w, 's-2'); /* 同上. */
```

如需获取相邻的兄弟控件, 可使用 [offset](#m-offset), 或使用 [nextSibling](#m-nextsibling) 与 [previousSibling](#m-previoussibling).

## [m#] firstSibling

### firstSibling()

**`6.3.3`** **`A11Y`**

- <ins>**returns**</ins> { [UiObject](uiObjectType) }

返回第一个兄弟控件 (可能为自身).

相当于 `sibling(0)`.

## [m#] lastSibling

### lastSibling()

**`6.3.3`** **`A11Y`**

- <ins>**returns**</ins> { [UiObject](uiObjectType) }

返回最后一个兄弟控件 (可能为自身).

相当于 `sibling(-1)`.

## [m#] offset

### offset(i)

**`6.3.3`** **`A11Y`**

- **i** { [number](dataTypes#number) } - 索引偏移量
- <ins>**returns**</ins> { [UiObject](uiObjectType) | [null](dataTypes#null) }

返回其索引偏移量为 `i` 的兄弟控件.

`i` 为正整数, 返回后向兄弟控件,  
`i` 为负整数, 返回前向兄弟控件,  
`i` 为 `0`, 返回当前控件自身. 

```js
let w = pickup(/.+/);
w.offset(3);
w.compass('s>3'); /* 同上. */
detect(w, 's>3'); /* 同上. */

w.offset(-2);
w.compass('s<2'); /* 同上. */
detect(w, 's<2'); /* 同上. */
```

如需获取相邻的兄弟控件, 除 [offset](#m-offset) 外, 还可使用 [nextSibling](#m-nextsibling) 与 [previousSibling](#m-previoussibling).

## [m#] nextSibling

### nextSibling()

**`6.3.3`** **`A11Y`**

- <ins>**returns**</ins> { [UiObject](uiObjectType) | [null](dataTypes#null) }

返回后一个兄弟控件.

相当于 `offset(1)`.

## [m#] previousSibling

### previousSibling()

**`6.3.3`** **`A11Y`**

- <ins>**returns**</ins> { [UiObject](uiObjectType) | [null](dataTypes#null) }

返回前一个兄弟控件.

相当于 `offset(-1)`.

## [m#] siblingCount

### siblingCount()

**`6.3.3`** **`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回当前节点的兄弟控件总数量 (含自身).

`siblingCount` 返回一个总是大于等于 `1` 的数字.

## [m#] isSingleton

### isSingleton()

**`6.3.3`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回当前节点是否为独身节点, 即除自身外没有其他兄弟节点.

相当于 `siblingCount() === 1`.

## [m#] siblings

### siblings()

**`6.3.3`** **`A11Y`**

- <ins>**returns**</ins> { [UiObjectCollection](uiObjectCollectionType) }

返回当前节点的兄弟控件集合 (含自身).

## [m#] indexInParent

### indexInParent()

**`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回当前节点在其父控件的索引值.

```js
/* 例如 p 控件有 3 个子控件 (a, b, c). */

a.indexInParent(); // 0 
p.child(0); /* 对应 a. */

console.log(c.indexInParent()); // 2
p.child(2); /* 对应 c. */
```

方法 `indexInParent` 通常用于访问临近或相对位置的兄弟节点:

```js
/* 例如 p 控件有 3 个子控件 (a, b, c). */

/* c 是 b 的相邻兄弟节点 (相对索引为 1). */
p.child(b.indexInParent() + 1); /* 对应 c. */
b.compass('s>1'); /* 使用罗盘方法, 效果同上. */

/* a 也是 b 的相邻兄弟节点 (相对索引为 -1). */
p.child(b.indexInParent() - 1); /* 对应 a. */
b.compass('s<1'); /* 使用罗盘方法, 效果同上. */

/* a 是 c 的兄弟节点 (相对索引为 -2). */
p.child(c.indexInParent() - 2); /* 对应 a. */
b.compass('s<2'); /* 使用罗盘方法, 效果同上. */
```

有时也需要获取当前节点的父控件在其父控件的索引值:

```js
let p = pickup({ filter: w => w.depth() > 0 && w.parent().indexInParent() > 0 });
console.log(p.parent().indexInParent()); // e.g. 2
```

## [m#] find

### find()

**`Overload 1/2`** **`A11Y`**

- <ins>**returns**</ins> { [UiObjectCollection](uiObjectCollectionType) }

以当前节点作为根节点, 返回其所有的子孙控件集合.

与 [children](#m-children) 方法不同, `w.children()` 返回子控件集合, 而 `w.find()` 返回所有子孙控件集合.

```js
let root = depth(0).findOnce();
console.log(root.find().length); // e.g. 500
console.log(root.children().length); // e.g. 2
```

子孙控件集合中包含根节点本身:

```js
/* 找出一个没有任何子孙控件的节点. */
let w = pickup({ filter: w => w.childCount() === 0 });

/* find() 返回的集合包含其自身, 而非空集合. */
console.log(w.find().length); // 1
```

因此, `N 层级子孙控件集合数量` = `N + 1 层级子孙控件数量总和` + `1`:

```js
let root = depth(0).findOnce();
let sumA = root.find().length;
let sumB = root.children().reduce((sum, c) => sum + c.find().length, 0);
console.log(sumA, sumB); /* sumA 和 sumB 相差 1. */
```

### find(selector)

**`Overload 2/2`** **`A11Y`**

- **selector** { [selector](uiSelectorType) } - 选择器
- <ins>**returns**</ins> { [UiObjectCollection](uiObjectCollectionType) }

以当前节点作为根节点, 返回其所有满足选择器筛选条件的子孙控件集合.

```js
/* 找出 w 控件下所有符合有效内容长度不小于 10 的子孙控件集合. */
console.log(w.find(contentMatch(/\s*.{10,}\s*/)));
```

## [m#] findOne

### findOne(selector)

**`A11Y`**

- **selector** { [selector](uiSelectorType) } - 选择器
- <ins>**returns**</ins> { [UiObject](uiObjectType) }

以当前节点作为根节点, 在其所有子孙控件中找出一个满足选择器筛选条件的控件.

```js
/* 找出 w 子孙控件中符合有效内容长度不小于 10 的一个控件. */
console.log(w.findOne(contentMatch(/\s*.{10,}\s*/)));
```

## [m#] bounds

### bounds()

**`A11Y`**

- <ins>**returns**</ins> { [AndroidRect](androidRectType) }

方法 [boundsInScreen](#m-boundsinscreen) 的别名.

返回一个 [控件矩形 (Rect)](androidRectType), 表示控件在屏幕的相对位置及空间范围.

```js
let bounds = contentMatch(/.+/).findOnce().bounds();
console.log(bounds); // e.g. Rect(0, 48 - 112, 160)
```

别名属性或方法:

- `[m#]` [boundsInScreen](#m-boundsinscreen)

## [m#] boundsInScreen

### boundsInScreen()

**`A11Y`**

- <ins>**returns**</ins> { [AndroidRect](androidRectType) }

返回一个 [控件矩形 (Rect)](androidRectType), 表示控件在屏幕的相对位置及空间范围.

```js
let bounds = contentMatch(/.+/).findOnce().boundsInScreen();
console.log(bounds); // e.g. Rect(0, 48 - 112, 160)
```

别名属性或方法:

- `[m#]` [bounds](#m-bounds)

## [m#] boundsInParent

### boundsInParent()

**`A11Y`**

**`DEPRECATED`**

- <ins>**returns**</ins> { [AndroidRect](androidRectType) }

返回一个 [控件矩形 (Rect)](androidRectType), 表示控件于其父控件的相对位置及空间范围.

因其父控件实际上是 `View#getParentForAccessibility()` 的结果, 而非此控件的 `viewParent`, 所以得到的结果是不可靠的.

```js
let bounds = contentMatch(/.+/).findOnce().boundsInParent();
console.log(bounds); // e.g. Rect(0, 0 - 112, 112)
```

## [m#] boundsLeft

### boundsLeft()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回控件矩形左边界距屏幕左边缘的像素距离.

```js
let w = pickup(/.+/);
console.log(w.bounds()); // e.g. Rect(0, 48 - 112, 160)
console.log(w.bounds().left); // e.g. 0
console.log(w.boundsLeft()); // e.g. 0
console.log(w.left()); // e.g. 0
```

## [m#] boundsTop

### boundsTop()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回控件矩形上边界距屏幕上边缘的像素距离.

```js
let w = pickup(/.+/);
console.log(w.bounds()); // e.g. Rect(0, 48 - 112, 160)
console.log(w.bounds().top); // e.g. 48
console.log(w.boundsTop()); // e.g. 48
console.log(w.top()); // e.g. 48
```

## [m#] boundsRight

### boundsRight()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回控件矩形右边界距屏幕左边缘的像素距离.

```js
let w = pickup(/.+/);
console.log(w.bounds()); // e.g. Rect(0, 48 - 112, 160)
console.log(w.bounds().right); // e.g. 112
console.log(w.right()); // e.g. 112
console.log(w.boundsRight()); // e.g. 112
```

## [m#] boundsBottom

### boundsBottom()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回控件矩形下边界距屏幕上边缘的像素距离.

```js
let w = pickup(/.+/);
console.log(w.bounds()); // e.g. Rect(0, 48 - 112, 160)
console.log(w.bounds().bottom); // e.g. 160
console.log(w.bottom()); // e.g. 160
console.log(w.boundsBottom()); // e.g. 160
```

## [m#] boundsWidth

### boundsWidth()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回控件矩形的宽度.

```js
let w = pickup(/.+/);
console.log(w.bounds()); // e.g. Rect(0, 48 - 112, 160)
console.log(w.bounds().width()); // e.g. 112
console.log(w.boundsWidth()); // e.g. 112
console.log(w.right() - w.left()); // e.g. 112
```

## [m#] boundsHeight

### boundsHeight()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回控件矩形的高度.

```js
let w = pickup(/.+/);
console.log(w.bounds()); // e.g. Rect(0, 48 - 112, 160)
console.log(w.bounds().height()); // e.g. 112
console.log(w.boundsHeight()); // e.g. 112
console.log(w.bottom() - w.top()); // e.g. 112
```

## [m#] boundsCenterX

### boundsCenterX()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回控件矩形的中心 X 坐标 (中心点距屏幕左边缘的像素距离).

该坐标为整数, 非整数数值将按 **向下取整** 处理, 因此会损失精度.

如需保留精度, 可使用 [boundsExactCenterX](#m-boundsexactcenterx).

```js
let wA = pickup(/.+/);
console.log(wA.bounds()); // e.g. Rect(0, 48 - 112, 160)
console.log(wA.bounds().centerX()); // e.g. 56
console.log(wA.boundsCenterX()); // e.g. 56

let wB = pickup(/.+/);
console.log(wB.bounds()); // e.g. Rect(0, 0 - 11, 20)
console.log(wB.boundsCenterX()); // e.g. 5 (5.5 向下取整得 5)

let wC = pickup(/.+/);
console.log(wC.bounds()); // e.g. Rect(0, 0 - -11, 20)
console.log(wC.boundsCenterX()); // e.g. -6 (-5.5 向下取整得 -6)
```

## [m#] boundsExactCenterX

### boundsExactCenterX()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回控件矩形的中心 X 坐标 (中心点距屏幕左边缘的像素距离).

该坐标将保留精度 (可能为非整数), 如需返回整数结果, 可使用 [boundsCenterX](#m-boundscenterx).

```js
let wA = pickup(/.+/);
console.log(wA.bounds()); // e.g. Rect(0, 48 - 112, 160)
console.log(wA.bounds().exactCenterX()); // e.g. 56
console.log(wA.boundsExactCenterX()); // e.g. 56

let wB = pickup(/.+/);
console.log(wB.bounds()); // e.g. Rect(0, 0 - 11, 20)
console.log(wB.boundsExactCenterX()); // e.g. 5.5

let wC = pickup(/.+/);
console.log(wC.bounds()); // e.g. Rect(0, 0 - -11, 20)
console.log(wC.boundsExactCenterX()); // e.g. -5.5
```

## [m#] boundsCenterY

### boundsCenterY()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回控件矩形的中心 Y 坐标 (中心点距屏幕上边缘的像素距离).

该坐标为整数, 非整数数值将按 **向下取整** 处理, 因此会损失精度.

如需保留精度, 可使用 [boundsExactCenterY](#m-boundsexactcentery).

```js
let wA = pickup(/.+/);
console.log(wA.bounds()); // e.g. Rect(0, 48 - 112, 160)
console.log(wA.bounds().centerY()); // e.g. 104
console.log(wA.boundsCenterY()); // e.g. 104

let wB = pickup(/.+/);
console.log(wB.bounds()); // e.g. Rect(0, 0 - 11, 33)
console.log(wB.boundsCenterY()); // e.g. 16 (16.5 向下取整得 16)

let wC = pickup(/.+/);
console.log(wC.bounds()); // e.g. Rect(0, 0 - 11, -33)
console.log(wC.boundsCenterY()); // e.g. -17 (-16.5 向下取整得 -17)
```

## [m#] boundsExactCenterY

### boundsExactCenterY()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回控件矩形的中心 Y 坐标 (中心点距屏幕上边缘的像素距离).

该坐标将保留精度 (可能为非整数), 如需返回整数结果, 可使用 [boundsCenterY](#m-boundscentery).

```js
let wA = pickup(/.+/);
console.log(wA.bounds()); // e.g. Rect(0, 48 - 112, 160)
console.log(wA.bounds().exactCenterY()); // e.g. 104
console.log(wA.boundsExactCenterY()); // e.g. 104

let wB = pickup(/.+/);
console.log(wB.bounds()); // e.g. Rect(0, 0 - 11, 33)
console.log(wB.boundsExactCenterY()); // e.g. 16.5

let wC = pickup(/.+/);
console.log(wC.bounds()); // e.g. Rect(0, 0 - 11, -33)
console.log(wC.boundsExactCenterY()); // e.g. -16.5
```

## [m#] left

### left()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回控件矩形左边界距屏幕左边缘的像素距离.

[UiObject#boundsLeft](#m-boundsleft) 的别名方法.

## [m#] top

### top()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回控件矩形上边界距屏幕上边缘的像素距离.

[UiObject#boundsTop](#m-boundstop) 的别名方法.

## [m#] right

### right()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回控件矩形右边界距屏幕左边缘的像素距离.

[UiObject#boundsRight](#m-boundsright) 的别名方法.

## [m#] bottom

### bottom()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回控件矩形下边界距屏幕上边缘的像素距离.

[UiObject#boundsBottom](#m-boundsbottom) 的别名方法.

## [m#] width

### width()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回控件矩形的宽度.

[UiObject#boundsWidth](#m-boundswidth) 的别名方法.

## [m#] height

### height()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回控件矩形的高度.

[UiObject#boundsHeight](#m-boundsheight) 的别名方法.

## [m#] centerX

### centerX()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回控件矩形的中心 X 坐标 (中心点距屏幕左边缘的像素距离).

[UiObject#boundsCenterX](#m-boundscenterx) 的别名方法.

## [m#] exactCenterX

### exactCenterX()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回控件矩形的中心 X 坐标 (中心点距屏幕左边缘的像素距离).

[UiObject#boundsExactCenterX](#m-boundsexactcenterx) 的别名方法.

## [m#] centerY

### centerY()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回控件矩形的中心 Y 坐标 (中心点距屏幕上边缘的像素距离).

[UiObject#boundsCenterY](#m-boundscentery) 的别名方法.

## [m#] exactCenterY

### exactCenterY()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回控件矩形的中心 Y 坐标 (中心点距屏幕上边缘的像素距离).

[UiObject#boundsExactCenterY](#m-boundsexactcentery) 的别名方法.

## [m#] point

### point()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [OpenCVPoint](opencvPointType) }

返回控件矩形的中心点 ([Point](opencvPointType)).

该中心点坐标由 [exactCenterX](#m-exactcenterx) 和 [exactCenterY](#m-exactcentery) 计算获得, 因此会保留精度.

是 [center](#m-center) 的别名方法.

```js
let wA = pickup(/.+/);
console.log(wA.bounds()); // e.g. Rect(0, 0 - 10, 12)
console.log(wA.point()); // e.g. {5.0, 6.0}
console.log(wA.point().x); // e.g. 5

let wB = pickup(/.+/);
console.log(wB.bounds()); // e.g. Rect(0, 0 - 11, 13)
console.log(wB.point()); // e.g. {5.5, 6.5}
console.log(wB.point().y); // e.g. 6.5
```

## [m#] center

### center()

**`6.4.2`** **`A11Y`**

- <ins>**returns**</ins> { [OpenCVPoint](opencvPointType) }

返回控件矩形的中心点 ([Point](opencvPointType)).

该中心点坐标由 [exactCenterX](#m-exactcenterx) 和 [exactCenterY](#m-exactcentery) 计算获得, 因此会保留精度.

是 [point](#m-point) 的别名方法.

```js
let wA = pickup(/.+/);
console.log(wA.bounds()); // e.g. Rect(0, 0 - 10, 12)
console.log(wA.center()); // e.g. {5.0, 6.0}
console.log(wA.center().x); // e.g. 5

let wB = pickup(/.+/);
console.log(wB.bounds()); // e.g. Rect(0, 0 - 11, 13)
console.log(wB.center()); // e.g. {5.5, 6.5}
console.log(wB.center().y); // e.g. 6.5
```

## [m#] size

### size()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [OpenCVSize](opencvSizeType) }

返回控件矩形的尺寸 ([Size](opencvSizeType)).

```js
let w = pickup(/.+/);
console.log(w.bounds()); // e.g. Rect(0, 0 - 10, 12)
console.log(w.size()); // e.g. 10x12
console.log(w.size().width); // e.g. 10
console.log(w.size().height); // e.g. 12
```

## [m#] clickBounds

### clickBounds(offsetX?, offsetY?)

**`6.2.0`** **`Overload [1-3]/3`** **`A11Y`**

- **[ offsetX = 0 ]** { [number](dataTypes#number) } - X 坐标偏移量 (支持负值及百分率)
- **[ offsetY = 0 ]** { [number](dataTypes#number) } - Y 坐标偏移量 (支持负值及百分率)
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否点击行为已执行且执行过程中无异常

点击控件矩形的中心点坐标.

点击操作借助 [automator.click(x, y)](automator#m-click) 完成, 此操作需要启用无障碍服务.

```js
let w = pickup(/.+/);

console.log(w.bounds()); // e.g. Rect(0, 60 - 100, 200)

w.clickBounds(); /* 相当于 click(50, 130) . */
click(w.centerX(), w.centerY()); /* 效果同上. */

w.clickBounds(10); /* X 坐标偏移量为 10 像素, 相当于 click(50 + 10, 130) . */
w.clickBounds(10, 15); /* X 与 Y 坐标偏移量分别为 10 和 15 像素, 相当于 click(50 + 10, 130 + 15) . */
w.clickBounds(0, -15); /* Y 坐标偏移量为 -15 像素, 相当于 click(50, 130 - 15) . */
w.clickBounds(0.2); /* X 坐标偏移量为 20% 屏幕宽度, 相当于 click(50 + 0.2 * device.width, 130) . */
w.clickBounds(0.2, -0.05); /* X 与 Y 坐标偏移量为 20% 屏幕宽度和 -5% 屏幕高度. */
```

## [m#] id

### id()

**`A11Y`**

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) }

返回节点的 ID 资源全称 (Fully-Qualified ID Resource Name).

若 ID 不存在, 返回 null.

安卓资源全称格式为 `package:type/entry`, 即 `包名:类型/资源项`.  
ID 资源全称的 `类型` 为 `id`.  
一个有效的 ID 资源全称: `com.test:id/some_entry`.

```js
console.log(idMatch(/.+/).findOnce().id()); // e.g. org.autojs.autojs6:id/action_bar_root
console.log(idMatch(/.+/).findOnce().fullId()); /* 同上. */
console.log(idMatch(/.+/).findOnce().getViewIdResourceName()); /* 同上. */
```

需额外留意, 部分应用的控件 ID 资源全称可能不符合标准:

```js
/* 标准 ID 全称. */
let canonicalId = "com.test:id/hello_world";

/* 可能出现的非标准 ID 全称. */
let peculiarId = "hello_world"; /* 仅含资源项, 无包名及类型标识. */
```

别名属性或方法:

- `[m#]` getViewIdResourceName
- `[m#]` [fullId](#m-fullid)

## [m#] fullId

### fullId()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) }

返回节点的 ID 资源全称 (Fully-Qualified ID Resource Name).

若 ID 不存在, 返回 null.

[UiObject#id](#m-id) 的别名方法.

## [m#] idEntry

### idEntry()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) }

返回节点的 ID 资源项名称 (ID Resource Entry Name).

安卓资源全称格式为 `package:type/entry`, 即 `包名:类型/资源项`.  
例如对于 ID 资源全称 `com.test:id/some_entry`, 其 ID 资源项名称为 `some_entry`.

```js
/* ID 资源全称. */
console.log(idMatch(/.+/).findOnce().id()); // e.g. org.autojs.autojs6:id/action_bar_root

/* ID 资源项名称. */
console.log(idMatch(/.+/).findOnce().idEntry()); // action_bar_root
console.log(idMatch(/.+/).findOnce().simpleId()); /* 同上. */
```

别名属性或方法:

- `[m#]` [simpleId](#m-simpleid)

## [m#] simpleId

### simpleId()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) }

返回节点的 ID 资源项名称 (ID Resource Entry Name).

若 ID 不存在, 返回 null.

[UiObject#idEntry](#m-identry) 的别名方法.

## [m#] idHex

### idHex()

**`A11Y`**

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) }

返回节点的 [ID 资源全称](#m-fullid) 的 [资源 ID](glossaries#资源-ID) 十六进制字符串值, 简称 `ID 资源十六进制代表值`.

1. 获取 `ID 资源全称` 对应的 `资源 ID`
2. 将 `资源 ID` 的十六进制值以 `0x` 作为前缀进行组合
3. 返回组合的字符串值

若 ID 不存在, 返回 null.

```js
console.log(idMatch(/explorer_item_list/).findOnce().idHex()); /* e.g. 0x7f090117 */
```

## [m#] text

### text()

**`A11Y`**

- <ins>**returns**</ins> { [string](dataTypes#string) }

返回控件文本内容.

若文本内容不存在, 返回空字符串.

出于保护隐私目的, `isPassword()` 返回 `true` 的密码类型控件, `text()` 将返回空字符串.

```js
console.log(textMatch(/.+/).findOnce().text()); /* e.g. hello */
```

别名属性或方法:

- `[m#]` getText

## [m#] desc

### desc()

**`A11Y`**

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) }

返回控件的内容描述标签.

若内容描述标签容不存在, 返回 null.

内容描述标签可以帮助需要无障碍服务的用户 (如视力障碍人群等) 理解当前控件的用途或说明.  
如 [TalkBack](https://support.google.com/accessibility/android/topic/10601570?hl=zh-Hans) 开启后可以朗读控件的内容描述标签, 对于理解那些没有文本内容的控件尤其重要.

```js
console.log(descMatch(/.+/).findOnce().desc()); /* e.g. Restart icon */
```

别名属性或方法:

- `[m#]` getContentDescription

## [m#] content

### content()

**`A11Y`**

- <ins>**returns**</ins> { [string](dataTypes#string) }

返回控件内容 (包括内容描述标签或本文内容).

若无内容, 返回空字符串.

`content` 方法相当于 `w.desc() || w.text()`, 即优先获取 [desc](#m-desc) 返回的内容, 若为 null, 继续获取 [text](#m-text) 返回的内容.

```js
console.log(contentMatch(/.+/).findOnce().content()); /* e.g. Avatar */
```

## [m#] className

### className()

**`A11Y`**

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) }

返回控件的类名.

若如类名, 返回 null.

```js
console.log(classNameMatch(/.+/).findOnce().className()); /* e.g. android.widget.EditText */
```

常见类名:

- android.view.View
- android.view.ViewGroup
- android.widget.ImageView
- android.widget.ImageButton
- android.widget.Button
- android.widget.ScrollView
- android.widget.TextView
- android.widget.EditText
- android.widget.Switch
- android.widget.LinearLayout
- android.widget.FrameLayout
- android.widget.RelativeLayout

别名属性或方法:

- `[m#]` getClassName

## [m#] packageName

### packageName()

**`A11Y`**

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) }

返回控件的包名.

若如包名, 返回 null.

```js
console.log(packageNameMatch(/.+/).findOnce().packageName()); /* e.g. org.autojs.autojs6 */
```

别名属性或方法:

- `[m#]` getPackageName

## [m#] depth

### depth()

**`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回 [控件层级](glossaries#控件层级) 深度.

顶层控件 (只有一个) 的深度值为 0, 次级控件 (可能有多个) 的深度值全部为 1, 以此类推.

```js
console.log(findOnce().depth()); // 0
console.log(contentMatch(/.+/).depth()); /* e.g. 5 */
```

## [m#] checkable

### checkable()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回控件是否可勾选.

别名属性或方法:

- `[m#]` isCheckable

关联属性或方法:

- 检查状态
    - `[m#]` [checked](#m-checked) (isChecked)
- 检查可用性
    - `[m#]` [checkable](#m-checkable) (isCheckable)

## [m#] checked

### checked()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回控件是否已勾选.

别名属性或方法:

- `[m#]` isChecked

关联属性或方法:

- 检查状态
    - `[m#]` [checked](#m-checked) (isChecked)
- 检查可用性
    - `[m#]` [checkable](#m-checkable) (isCheckable)

## [m#] focusable

### focusable()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回控件是否可聚焦.

别名属性或方法:

- `[m#]` isFocusable

关联属性或方法:

- 检查状态
    - `[m#]` [focused](#m-focused) (isFocused)
- 检查可用性
    - `[m#]` [focusable](#m-focusable) (isFocusable)

## [m#] focused

### focused()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回控件是否已聚焦.

别名属性或方法:

- `[m#]` isFocused

关联属性或方法:

- 检查状态
    - `[m#]` [focused](#m-focused) (isFocused)
- 检查可用性
    - `[m#]` [focusable](#m-focusable) (isFocusable)

## [m#] visibleToUser

### visibleToUser()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回控件是否对用户可见.

别名属性或方法:

- `[m#]` isVisibleToUser

## [m#] accessibilityFocused

### accessibilityFocused()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回控件是否已获取无障碍焦点.

别名属性或方法:

- `[m#]` isAccessibilityFocused

关联属性或方法:

- 检查状态
    - `[m#]` [accessibilityFocused](#m-accessibilityfocused) (isAccessibilityFocused)
- 执行行为
    - `[m#]` [accessibilityFocus](uiObjectActionsType#m-accessibilityfocus)

## [m#] selected

### selected()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回控件是否已选中.

别名属性或方法:

- `[m#]` isSelected

关联属性或方法:

- 检查状态
    - `[m#]` [selected](#m-selected) (isSelected)
- 执行行为
    - `[m#]` [select](uiObjectActionsType#m-select)

## [m#] clickable

### clickable()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回控件是否可点击.

别名属性或方法:

- `[m#]` isClickable

关联属性或方法:

- 检查状态
    - `[m#]` [clickable](#m-clickable) (isClickable)
- 执行行为
    - `[m#]` [click](uiObjectActionsType#m-click)

## [m#] longClickable

### longClickable()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回控件是否可长按.

别名属性或方法:

- `[m#]` isLongClickable

关联属性或方法:

- 检查状态
    - `[m#]` [longClickable](#m-longclickable) (isLongClickable)
- 执行行为
    - `[m#]` [longClick](uiObjectActionsType#m-longclick)

## [m#] enabled

### enabled()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回控件是否启用 (未被禁用).

别名属性或方法:

- `[m#]` isEnabled

## [m#] password

### password()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回控件是否是密码型控件.

别名属性或方法:

- `[m#]` isPassword

## [m#] scrollable

### scrollable()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回控件是否可滚动.

别名属性或方法:

- `[m#]` isScrollable

关联属性或方法:

- 检查状态
    - `[m#]` [scrollable](#m-scrollable) (isScrollable)
- 执行行为
    - `[m#]` [scrollBackward](uiObjectActionsType#m-scrollbackward)
    - `[m#]` [scrollDown](uiObjectActionsType#m-scrolldown)
    - `[m#]` [scrollForward](uiObjectActionsType#m-scrollforward)
    - `[m#]` [scrollLeft](uiObjectActionsType#m-scrollleft)
    - `[m#]` [scrollRight](uiObjectActionsType#m-scrollright)
    - `[m#]` [scrollTo](uiObjectActionsType#m-scrollto)
    - `[m#]` [scrollUp](uiObjectActionsType#m-scrollup)

## [m#] editable

### editable()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回控件是否可编辑.

别名属性或方法:

- `[m#]` isEditable

## [m#] rowCount

### rowCount()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回 [信息集控件](glossaries#信息集控件) 的行数.

## [m#] columnCount

### columnCount()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回 [信息集控件](glossaries#信息集控件) 的列数.

## [m#] row

### row()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回 [子项信息集控件](glossaries#子项信息集控件) 所在行的索引值.

## [m#] column

### column()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回 [子项信息集控件](glossaries#子项信息集控件) 所在列的索引值.

## [m#] rowSpan

### rowSpan()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回 [子项信息集控件](glossaries#子项信息集控件) 纵跨的行数.

## [m#] columnSpan

### columnSpan()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回 [子项信息集控件](glossaries#子项信息集控件) 横跨的列数.

## [m#] drawingOrder

### drawingOrder()

**`A11Y`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

返回节点的视图绘制次序.

此次序由其父节点决定, 是一个相对于其兄弟节点的索引值.  
在某些情况下, 视图 (View) 绘制的过程本质上是同时发生的, 两个兄弟节点可能返回同一个索引值, 甚至此索引值可能被忽略 (返回默认值 0).

```js
console.log(pickup(/.+/).drawingOrder()); // e.g. 0
```

## [m#] actionNames

### actionNames()

**`A11Y`**

- <ins>**returns**</ins> { [string](dataTypes#string)[[]](dataTypes#array) }

返回控件支持的 [控件行为](uiObjectActionsType) 数组.

```js
let w = pickup(/.+/);

/* e.g. [ ACTION_CLICK, ACTION_SET_SELECTION, ACTION_FOCUS ] */
console.log(w.actionNames());
```

上述示例, 数组中的三个元素代表控件可以执行对应的行为, 即 `w.click()`, `w.setSelection(...)` 及 `w.focus()`.

数组中的元素均为 "ACTION_" 开头的控件行为 ID 的字符串形式.  
更多控件行为 ID 可参阅 [控件节点行为](uiObjectActionsType) 章节的 `行为 ID` 表格.

如需判断一个控件是否支持一个或多个行为, 可使用 [hasAction](#m-hasaction) 方法.

## [m#] hasAction

### hasAction(...actions)

**`A11Y`**

- **actions** { [...](documentation#可变参数)[string](dataTypes#string)[[]](documentation#可变参数) }
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回控件是否 **全部支持** 指定的一个或多个 [控件行为](uiObjectActionsType).

参数 actions 是 [可变参数](documentation#可变参数), 均满足 "ACTION_" 开头的控件行为 ID 的字符串形式 ("ACTION_" 可省略).

```js
let w = pickup(/.+/);

/* 判断 w 是否可点击. */
console.log(w.hasAction("ACTION_CLICK"));
console.log(w.hasAction("CLICK")); /* ACTION_ 前缀可省略. */

/* 判断 w 是否可点击, 可聚焦, 可设置文本. */
console.log(w.hasAction("ACTION_CLICK", "ACTION_FOCUS", "ACTION_SET_TEXT"));
console.log(w.hasAction("CLICK", "FOCUS", "SET_TEXT")); /* ACTION_ 前缀可省略. */
```

更多控件行为 ID 可参阅 [控件节点行为](uiObjectActionsType) 章节的 `行为 ID` 表格.

## [m#] performAction

用于执行指定的控件行为.  
在 [控件节点行为](uiObjectActionsType) 章节已详细描述相关内容, 此处仅注明几个重载方法的签名, 相关内容将不再赘述.

### performAction(action, ...arguments)

**`Overload 1/2`** **`A11Y`**

- **action** { [number](dataTypes#number) } - 行为的唯一标志符 (Action ID)
- **arguments** { [...](documentation#可变参数)[ActionArgument](uiObjectActionsType#i-actionargument)[[]](documentation#可变参数) } - 行为参数, 用于给行为传递参数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

### performAction(action, bundle)

**`Overload 2/2`** **`A11Y`**

- **action** { [number](dataTypes#number) } - 行为的唯一标志符 (Action ID)
- **bundle** { [AndroidBundle](uiObjectActionsType#i-actionargument) } - 行为参数容器, 用于给行为传递参数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

## [m#] click

### click()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 点击 ] 行为](uiObjectActionsType#m-click).

## [m#] longClick

### longClick()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 长按 ] 行为](uiObjectActionsType#m-longclick).

## [m#] accessibilityFocus

### accessibilityFocus()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 获取无障碍焦点 ] 行为](uiObjectActionsType#m-accessibilityfocus).

## [m#] clearAccessibilityFocus

### clearAccessibilityFocus()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 清除无障碍焦点 ] 行为](uiObjectActionsType#m-clearaccessibilityfocus).

## [m#] focus

### focus()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 获取焦点 ] 行为](uiObjectActionsType#m-focus).

## [m#] clearFocus

### clearFocus()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 清除焦点 ] 行为](uiObjectActionsType#m-clearfocus).

## [m#] dragStart

### dragStart()

**`6.2.0`** **`A11Y`** **`API>=32`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 拖放开始 ] 行为](uiObjectActionsType#m-dragstart).

## [m#] dragDrop

### dragDrop()

**`6.2.0`** **`A11Y`** **`API>=32`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 拖放放下 ] 行为](uiObjectActionsType#m-dragdrop).

## [m#] dragCancel

### dragCancel()

**`6.2.0`** **`A11Y`** **`API>=32`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 拖放取消 ] 行为](uiObjectActionsType#m-dragcancel).

## [m#] imeEnter

### imeEnter()

**`6.2.0`** **`A11Y`** **`API>=30`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 输入法 ENTER 键 ] 行为](uiObjectActionsType#m-imeenter).

## [m#] moveWindow

### moveWindow(x, y)

**`6.2.0`** **`A11Y`** **`API>=26`**

- **x** { [number](dataTypes#number) } - X 坐标
- **y** { [number](dataTypes#number) } - Y 坐标
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 移动窗口到新位置 ] 行为](uiObjectActionsType#m-movewindow).

## [m#] nextAtMovementGranularity

### nextAtMovementGranularity(granularity, isExtendSelection)

**`6.2.0`** **`A11Y`**

- **granularity** { [number](dataTypes#number) } - 粒度
- **isExtendSelection** { [boolean](dataTypes#boolean) } - 是否扩展选则文本
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 按粒度移至下一位置 ] 行为](uiObjectActionsType#m-nextatmovementgranularity).

## [m#] nextHtmlElement

### nextHtmlElement(element)

**`6.2.0`** **`A11Y`**

- **element** { [string](dataTypes#string) } - 元素名称
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 按元素移至下一位置 ] 行为](uiObjectActionsType#m-nexthtmlelement).

## [m#] pageLeft

### pageLeft()

**`6.2.0`** **`A11Y`** **`API>=29`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 使视窗左移的翻页 ] 行为](uiObjectActionsType#m-pageleft).

## [m#] pageUp

### pageUp()

**`6.2.0`** **`A11Y`** **`API>=29`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 使视窗上移的翻页 ] 行为](uiObjectActionsType#m-pageup).

## [m#] pageRight

### pageRight()

**`6.2.0`** **`A11Y`** **`API>=29`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 使视窗右移的翻页 ] 行为](uiObjectActionsType#m-pageright).

## [m#] pageDown

### pageDown()

**`6.2.0`** **`A11Y`** **`API>=29`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 使视窗下移的翻页 ] 行为](uiObjectActionsType#m-pagedown).

## [m#] pressAndHold

### pressAndHold()

**`6.2.0`** **`A11Y`** **`API>=30`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 按住 ] 行为](uiObjectActionsType#m-pressandhold).

## [m#] previousAtMovementGranularity

### previousAtMovementGranularity(granularity, isExtendSelection)

**`6.2.0`** **`A11Y`**

- **granularity** { [number](dataTypes#number) } - 粒度
- **isExtendSelection** { [boolean](dataTypes#boolean) } - 是否扩展选则文本
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 按粒度移至上一位置 ] 行为](uiObjectActionsType#m-previousatmovementgranularity).

## [m#] previousHtmlElement

### previousHtmlElement(element)

**`6.2.0`** **`A11Y`**

- **element** { [string](dataTypes#string) } - 元素名称
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 按元素移至上一位置 ] 行为](uiObjectActionsType#m-previoushtmlelement).

## [m#] showTextSuggestions

### showTextSuggestions()

**`6.2.0`** **`A11Y`** **`API>=33`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 显示文本建议 ] 行为](uiObjectActionsType#m-showtextsuggestions).

## [m#] showTooltip

### showTooltip()

**`6.2.0`** **`A11Y`** **`API>=28`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 显示工具提示信息 ] 行为](uiObjectActionsType#m-showtooltip).

## [m#] hideTooltip

### hideTooltip()

**`6.2.0`** **`A11Y`** **`API>=28`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 隐藏工具提示信息 ] 行为](uiObjectActionsType#m-hidetooltip).

## [m#] show

### show()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 显示在视窗内 ] 行为](uiObjectActionsType#m-show).

## [m#] dismiss

### dismiss()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 消隐 ] 行为](uiObjectActionsType#m-dismiss).

## [m#] copy

### copy()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 复制文本 ] 行为](uiObjectActionsType#m-copy).

## [m#] cut

### cut()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 剪切文本 ] 行为](uiObjectActionsType#m-cut).

## [m#] paste

### paste()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 粘贴文本 ] 行为](uiObjectActionsType#m-paste).

## [m#] select

### select()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 选中 ] 行为](uiObjectActionsType#m-select).

## [m#] expand

### expand()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 展开 ] 行为](uiObjectActionsType#m-expand).

## [m#] collapse

### collapse()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 折叠 ] 行为](uiObjectActionsType#m-collapse).

## [m#] scrollLeft

### scrollLeft()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 使视窗左移的滚动 ] 行为](uiObjectActionsType#m-scrollleft).

## [m#] scrollUp

### scrollUp()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 使视窗上移的滚动 ] 行为](uiObjectActionsType#m-scrollup).

## [m#] scrollRight

### scrollRight()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 使视窗右移的滚动 ] 行为](uiObjectActionsType#m-scrollright).

## [m#] scrollDown

### scrollDown()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 使视窗下移的滚动 ] 行为](uiObjectActionsType#m-scrolldown).

## [m#] scrollForward

### scrollForward()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 使视窗前移的滚动 ] 行为](uiObjectActionsType#m-scrollforward).

## [m#] scrollBackward

### scrollBackward()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 使视窗后移的滚动 ] 行为](uiObjectActionsType#m-scrollbackward).

## [m#] scrollTo

### scrollTo(row, column)

**`A11Y`**

- **row** { [number](dataTypes#number) } - 行序数
- **column** { [number](dataTypes#number) } - 列序数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 将指定位置滚动至视窗内 ] 行为](uiObjectActionsType#m-scrollto).

## [m#] contextClick

### contextClick()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 上下文点击 ] 行为](uiObjectActionsType#m-contextclick).

## [m#] setText

### setText(text)

**`A11Y`**

- **text** { [string](dataTypes#string) } - 文本
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 设置文本 ] 行为](uiObjectActionsType#m-settext).

## [m#] setSelection

### setSelection(start, end)

**`A11Y`**

- **start** { [number](dataTypes#number) } - 开始位置
- **end** { [number](dataTypes#number) } - 结束位置
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 选择文本 ] 行为](uiObjectActionsType#m-setselection).

## [m#] clearSelection

### clearSelection()

**`6.2.0`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 取消选择文本 ] 行为](uiObjectActionsType#m-clearselection).

## [m#] setProgress

### setProgress(progress)

**`A11Y`**

- **progress** { [number](dataTypes#number) } - 进度值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

控件节点执行 [[ 设置进度值 ] 行为](uiObjectActionsType#m-setprogress).

## [m#] compass

### compass(compassArg)

**`6.2.0`** **`A11Y`**

- **compassArg** { [DetectCompass](dataTypes#detectcompass) } - 罗盘参数, 用于控制罗盘定位
- <ins>**returns**</ins> { [UiObject](uiObjectType) | [null](dataTypes#null) } - 罗盘最终定位的控件节点

返回罗盘最终定位的 [控件节点](uiObjectType), 若定位失败, 返回 null.

罗盘定位类似于在 [控件层级](glossaries#控件层级) 中自由移动, 最终定位在某个指定的控件节点上.

```js
let w = clickable().findOnce();

console.log(w.parent()); /* 父控件. */
console.log(w.parent().parent()); /* 二级父控件. */
console.log(w.child(0)); /* 索引 0 (首个) 子控件. */
console.log(w.child(2)); /* 索引 2 子控件. */
console.log(w.child(w.childCount() - 1)); /* 末尾子控件. */
console.log(w.parent().child(5)); /* 索引 5 兄弟控件. */
console.log(w.parent().child(w.childCount() - 2)); /* 倒数第 2 兄弟控件. */
console.log(w.parent().child(w.indexInParent() - 1)); /* 相邻左侧兄弟节点. */
console.log(w.parent().child(w.indexInParent() + 1)); /* 相邻右侧兄弟节点. */
console.log(w.parent().parent().parent().parent().child(0).child(1).child(1).child(0)); /* 多级访问. */

/* 使用控件罗盘替代上述所有语句. */

console.log(w.compass('p')); /* 父控件. */
console.log(w.compass('p2')); /* 二级父控件. */
console.log(w.compass('c0')); /* 索引 0 (首个) 子控件. */
console.log(w.compass('c2')); /* 索引 2 子控件. */
console.log(w.compass('c-1')); /* 末尾子控件. */
console.log(w.compass('s5')); /* 索引 5 兄弟控件. */
console.log(w.compass('s-2')); /* 倒数第 2 兄弟控件. */
console.log(w.compass('s<1')); /* 相邻左侧兄弟节点. */
console.log(w.compass('s>1')); /* 相邻右侧兄弟节点. */
console.log(w.compass('p4c0>1>1>0')); /* 多级访问. */
```

罗盘参数有以下几类:

- p: [parent (父控件)](#parent-p)
- c: [child (子控件)](#child-c)
- s: [sibling (兄弟控件)](#sibling-s)
- k: [clickable (可点击控件)](#clickable-k)

不同种类的罗盘参数可以重复使用或组合使用.

#### parent (p)

访问父控件.

如 `w.parent()` 的两种罗盘定位形式:

```js
w.compass('p'); /* 较为常用. */
w.compass('p1');
```

罗盘 `p` 可跟随一个数字, 表示层级跨度:

```js
/* 二级. */
w.parent().parent(); /* 原始方式. */
w.compass('pp');
w.compass('p2'); /* 较为常用. */

/* 五级. */
w.parent().parent().parent().parent().parent(); /* 原始方式. */
w.compass('ppppp');
w.compass('p5'); /* 较为常用. */
w.compass('p4p');
w.compass('p3p2');
w.compass('p2p1p2');
```

罗盘 `p` 每移动一次, 控件的 depth 将减少一级, 当 depth 为 0 时, 后续所有父级访问均返回 null:

```js
console.log(w.depth()); /* e.g. 23 */
console.log(w.compass('p5').depth()); /* e.g. 18 */
console.log(w.compass('p23').depth()); /* e.g. 0 */
console.log(w.compass('p24')); // null
console.log(w.compass('p40')); // null
```

罗盘 `p` 跟随负数时将抛出异常:

```js
/* e.g. java.lang.IllegalArgumentException: 无效的剩余罗盘参数: -2 */
console.log(w.compass('p-2'));
```

`p0` 将返回控件本身:

```js
console.log(w.compass('p0') === w); // true
```

#### child (c)

访问子控件.

如 `w.child(0)` 的罗盘定位形式:

```js
w.compass('c0');
```

罗盘 `c` 可跟随一个整数, 表示子控件索引:

```js
/* 索引 2 子控件 */
w.child(2);
w.compass('c2');

/* 倒数第 2 子控件. */
w.child(w.childCount() - 2);
w.compass('c-2');
```

连续多级子控件访问, 可使用 `cXcYcZ` 或 `cX>Y>Z` 形式:

```js
w.child(1).child(1).child(0).child(5).child(2).child(3);
w.compass('c1c1c0c5c2c3');
w.compass('c1>1>0>5>2>3'); /* 同上. */
```

#### sibling (s)

访问兄弟控件.

例如一个控件有 10 个子控件, 这些子控件互为兄弟控件, 它们拥有同一个父控件.  
10 个子控件中, 索引为 n (n > 0 且 n < 9) 的子控件有两个相邻兄弟控件节点, 即索引为 n - 1 的左邻兄弟和索引为 n + 1 的右邻兄弟.

```js
/* 左邻兄弟节点. */
w.parent().child(w.indexInParent() - 1);
w.compass('s<1');

/* 右邻兄弟节点. */
w.parent().child(w.indexInParent() + 1);
w.compass('s>1');

/* 右侧第 2 个兄弟节点. */
w.parent().child(w.indexInParent() + 2);
w.compass('s>2');

/* 索引 5 的兄弟节点. */
w.parent().child(5);
w.compass('s5');

/* 倒数第 2 个兄弟节点. */
w.parent().child(w.childCount() - 2);
w.compass('s-2');
```

#### clickable (k)

访问可点击控件.

有些控件本身不可点击, 而是包含在一个可点击控件内部:

```js
let w = contentMatch(/.+/).findOnce();
console.log(w.clickable()); // false
console.log(w.parent().clickable()); // true
```

对于上述情况的控件, 通常执行 "父控件.click()" 都会达到预期, 即虽然点击的是父控件, 但实际效果和点击这个控件本身是一样的.

在某些情况下, 这样的可点击父控件可能需要两级甚至更多级:

```js
let w = contentMatch(/.+/).findOnce();
console.log(w.clickable()); // false
console.log(w.parent().clickable()); // false
console.log(w.parent().parent().clickable()); // false
console.log(w.parent().parent().parent().clickable()); // false
console.log(w.parent().parent().parent().parent().clickable()); // true
```

上述示例直到 4 级父控件才是可点击的, 对于这种情况通常需要使用循环语句结合 `clickable` 的条件检测:

```js
let w = contentMatch(/.+/).findOnce();
let max = 5;
let temp = w;
while (max--) {
    if (temp !== null && temp.clickable()) {
        temp.click();
        break;
    }
    temp = temp.parent();
}
```

上述示例的 `max` 变量表示最多尝试的层级数, 层级数过小, 可能导致错过真正可点击的父控件, 过大则可能会得到不相关的可点击控件 (这样的控件点击后将出现非预期结果), 通常这个 `max` 建议设置为 2.

将上述示例用控件罗盘表示:

```js
let w = contentMatch(/.+/).findOnce();
let temp = w.compass('k5'); /* 5 表示尝试的最大层级数, 通常建议设置为 2. */
if (temp !== null && temp.clickable()) {
    temp.click();
}
```

将上述示例用 [拾取选择器](uiSelectorType#m-pickup) 表示:

```js
pickup(/.+/, 'k5', 'click');
```

## [m] isCompass

### isCompass(s)

**`6.2.0`** **`A11Y`**

- **s** { [string](dataTypes#string) } - 罗盘参数
- <ins>**returns**</ins> { [UiObject](uiObjectType) | [null](dataTypes#null) }

检测罗盘参数是否符合既定格式.

```js
console.log(UiObject.isCompass('p2c3')); // true
console.log(UiObject.isCompass('p-2c3')); // true
console.log(UiObject.isCompass('p2c-3')); // true
console.log(UiObject.isCompass('hello')); // false
```

上述示例中的 `p-2c3` 罗盘参数, 在使用时会抛出异常, 但因符合既定格式, 故 `isCompass` 返回 `true`.

## [m] ensureCompass

### ensureCompass(s)

**`6.2.0`** **`A11Y`**

- **s** { [string](dataTypes#string) } - 罗盘参数
- <ins>**returns**</ins> { [UiObject](uiObjectType) | [null](dataTypes#null) }

确保罗盘参数符合既定格式, 若不符合则抛出异常.

```js
UiObject.ensureCompass('p2c3'); /* 无异常. */
UiObject.ensureCompass('world'); /* 抛出异常. */
```

## [m] detect

控件探测.

探测相当于对控件进行一系列组合操作 (罗盘定位, 结果筛选, 参化调用, 回调处理).

部分特性:

- `detect` 已全局化, 支持全局使用.
- `detect` 的首个参数固定为 [UiObject](uiObjectType) 类型.
- [compass](#m-compass) 是 `detect` 的衍生方法.
- [pickup](uiSelectorType#m-pickup) 的内部实现引用了 `detect` 方法.

### detect(w, compass)

**`6.2.0`** **`Global`** **`Overload 1/7`** **`A11Y`**

- **w** { [UiObject](uiObjectType) } - 控件节点
- **compass** { [DetectCompass](dataTypes#detectcompass) } - 罗盘参数
- <ins>**returns**</ins> { [UiObject](uiObjectType) | [null](dataTypes#null) } - 探测后的控件节点

携带 [罗盘参数](dataTypes#detectcompass) 的控件探测.

相当于 [w.compass(compass)](#m-compass), 因此 `compass` 是 `detect` 的衍生方法.

### detect(w, result)

**`6.2.0`** **`Global`** **`Overload 2/7`** **`A11Y`**

- **w** { [UiObject](uiObjectType) } - 控件节点
- **result** { [DetectResult](dataTypes#detectresult) } - 探测结果参数
- <ins>**returns**</ins> { [UiObject](uiObjectType) | [null](dataTypes#null) } - 探测结果

携带 [探测结果参数](dataTypes#detectresult) 的控件探测.

### detect(w, compass, result)

**`6.2.0`** **`Global`** **`Overload 3/7`** **`A11Y`**

- **w** { [UiObject](uiObjectType) } - 控件节点
- **compass** { [DetectCompass](dataTypes#detectcompass) } - 罗盘参数
- **result** { [DetectResult](dataTypes#detectresult) } - 探测结果参数
- <ins>**returns**</ins> { [UiObject](uiObjectType) | [null](dataTypes#null) } - 探测结果

携带 [罗盘参数](dataTypes#detectcompass) 和 [探测结果参数](dataTypes#detectresult) 的控件探测.

需特别留意 compass 和 result 的顺序, 两者均为字符串时, 前者会被解析为 `罗盘参数`.

```js
console.log(w.parent().parent().child(1).child(0).bounds()); /* 潜在的空指针异常. */
console.log(detect(w, 'p2c1>0', 'bounds')); /* 空指针安全. */
```

### detect(w, callback)

**`6.2.0`** **`Global`** **`Overload 4/7`** **`A11Y`**

- **w** { [UiObject](uiObjectType) } - 控件节点
- **callback** { [DetectCallback](dataTypes#detectcallback) } - 探测回调
- <ins>**returns**</ins> { [UiObject](uiObjectType) | [null](dataTypes#null) } - 探测回调的结果

携带 [探测回调](dataTypes#detectcallback) 的控件探测.

```js
detect(pickup(/^[A-Z][a-z]+ ?\d*$/), (w) => {
    w ? w.click() : console.warn('未找到指定控件');
});
```

### detect(w, compass, callback)

**`6.2.0`** **`Global`** **`Overload 5/7`** **`A11Y`**

- **w** { [UiObject](uiObjectType) } - 控件节点
- **compass** { [DetectCompass](dataTypes#detectcompass) } - 罗盘参数
- **callback** { [DetectCallback](dataTypes#detectcallback) } - 探测回调
- <ins>**returns**</ins> { [UiObject](uiObjectType) | [null](dataTypes#null) } - 探测回调的结果

携带 [罗盘参数](dataTypes#detectcompass) 和 [探测回调](dataTypes#detectcallback) 的控件探测.

```js
detect(pickup(/^[A-Z][a-z]+ ?\d*$/), 'k2', (w) => {
    w ? w.click() : console.warn('未找到指定控件');
});
```

### detect(w, result, callback)

**`6.2.0`** **`Global`** **`Overload 6/7`** **`A11Y`**

- **w** { [UiObject](uiObjectType) } - 控件节点
- **result** { [DetectResult](dataTypes#detectresult) } - 探测结果参数
- **callback** { [DetectCallback](dataTypes#detectcallback) } - 探测回调
- <ins>**returns**</ins> { [UiObject](uiObjectType) | [null](dataTypes#null) } - 探测回调的结果

携带 [探测结果参数](dataTypes#detectresult) 和 [探测回调](dataTypes#detectcallback) 的控件探测.

```js
detect(pickup(/^[A-Z][a-z]+ ?\d*$/), 'content', (content) => {
    content ? console.log(content) : console.warn('无文本内容或未能定位指定控件');
});
```

### detect(w, compass, result, callback)

**`6.2.0`** **`Global`** **`Overload 7/7`** **`A11Y`**

- **w** { [UiObject](uiObjectType) } - 控件节点
- **compass** { [DetectCompass](dataTypes#detectcompass) } - 罗盘参数
- **result** { [DetectResult](dataTypes#detectresult) } - 探测结果参数
- **callback** { [DetectCallback](dataTypes#detectcallback) } - 探测回调
- <ins>**returns**</ins> { [UiObject](uiObjectType) | [null](dataTypes#null) } - 探测回调的结果

携带 [罗盘参数](dataTypes#detectcompass), [探测结果参数](dataTypes#detectresult) 和 [探测回调](dataTypes#detectcallback) 的控件探测.

需特别留意 compass 和 result 的顺序, 两者均为字符串时, 前者会被解析为 `罗盘参数`.

```js
detect(pickup({ clickable: true }), 'p2c1', 'content', (content) => {
    content ? console.log(content) : console.warn('无文本内容或未能定位指定控件');
});
```