# 选择器 (UiSelector)

UiSelector (选择器), 亦可看作是 [控件节点](uiObjectType) 的条件筛选器, 用于通过附加不同的条件, 筛选出一个或一组活动窗口中的 `控件节点`, 并做进一步处理, 如 [ 执行 [控件行为](uiObjectActionsType) (点击, 长按, 设置文本等) / 判断位置 / 获取文本内容 / 获取控件特定状态 / 在 [控件层级](glossaries#控件层级) 中进行 [罗盘](uiObjectType#m-compass) 导航 ] 等.

```js
text("立即开始");
```

上述示例是一个选择器, 要求控件满足文本为 "立即开始" 的条件.

选择器的构建通常是基于控件属性的, 如 [ text / desc / className / action / height / id ] 等.

构建式选择器调用后会返回自身类型, 因此可使用 [链式调用](https://zh.m.wikipedia.org/zh-hans/%E6%96%B9%E6%B3%95%E9%93%BE%E5%BC%8F%E8%B0%83%E7%94%A8) 构建出用于多条件筛选的选择器:

```js
text("立即开始").minHeight(0.2).clickable(true);
```

上述示例是一个多条件选择器, 要求控件同时满足三个条件: 文本为 "立即开始", 控件高度值不低于屏幕高度的 20%, 控件可点击. 详情参阅本章 [链式特性](#链式特性) 小节.

在当前章节, 绝大多数方法的返回值类型标均注为 "UiSelector", 它们属于可链式调用的 "选择器构建方法", 其他方法统称为 "动作", 可归纳为 "状态方法" (查看状态的动作), "查找方法" (查找控件的动作), "[行为方法](uiObjectActionsType)" (执行控件行为的动作).

选择器构建方法:

- [m#] text
- [m#] desc
- [m#] id
- [m#] className
- ... ...

状态方法:

- [m#] exists
- [m#] toString

查找方法:

- [m#] findOnce
- [m#] find
- [m#] findOne
- [m#] untilFindOne
- [m#] untilFind / waitFor
- [m] pickup

行为方法:

- [m#] click
- [m#] longClick
- [m#] focus
- [m#] clearFocus
- ... ...

一个选择器构建之后, 需要执行一个上述 "动作" 才能发挥选择器的作用:

```js
let sel = text("立即开始").minHeight(0.2).clickable(true);
console.log(sel.exists()); /* 查看状态的动作. */
console.log(sel.findOnce()); /* 查找控件的动作. */
console.log(sel.click()); /* 执行控件行为的动作. */
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">UiSelector</p>

---

## [@] UiSelector

**`Global`**

如需构建 UiSelector, 可使用本章节的任意 "选择器构建方法", 且它们都是全局可用的:

```js
console.log(text("立即开始") instanceof UiSelector); // true
console.log(text("立即开始").clickable() instanceof UiSelector); // true
```

如需构建一个 "空" 选择器, 可使用 `selector` 方法:

```js
console.log(selector()); // class org.autojs.autojs.core.automator.filter.Selector
console.log(selector() instanceof UiSelector); // true
```

当某个选择器名称与当前作用域中用户已定义的变量名称冲突时, 可利用 `selector` 方法避免冲突:

```js
/* text 选择器被覆写. */
let text = "hello";

/* text 不再是选择器. */
console.log(text("立即开始").exists()); // TypeError: text 是 string 而非函数.

/* 使用 selector() 避免命名冲突. */
console.log(selector().text("立即开始").exists()); // e.g. true
```

## [m#] id

### id(str)

**`[6.2.0]`** **`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

ID 资源选择器.

- 筛选条件说明: ID 资源全称或 ID 资源项名称完全匹配指定字符串
- 关联控件属性: [id](uiObjectType#m-id)

安卓资源全称格式为 `package:type/entry`, 即 `包名:类型/资源项`.  
ID 资源全称的 `类型` 为 `id`.  
一个有效的 ID 资源全称: `com.test:id/some_entry`.  
其中 `com.test` 为包名, `some_entry` 为 ID 资源项名称, `com.test:id/some_entry` 为 ID 资源全称.

在 AutoJs6 中, ID 资源选择器支持两种方式作为筛选条件:

- ID 资源全称 (对应上述示例的 `com.test:id/some_entry`)
- ID 资源项名称 (对应上述示例的 `some_entry`)

例如对于以下 4 个控件:

```js
wA.id(); // com.test.abc:id/some_entry
wB.id(); // com.test.abc:id/some_other_entry
wC.id(); // com.test.jkl:id/some_entry
wD.id(); // com.test.xyz:id/some_entry
```

`id('com.test.abc:id/some_entry')` 是一个 ID 资源全称筛选器, 可以匹配控件 `wA`.

`id('com.test.xyz:id/some_entry')` 同样是 ID 资源全称筛选器, 可以匹配控件 `wD`.

`id('some_entry')` 则是一个 ID 资源项名称筛选器.  
它不包含包名信息, 匹配时只关心资源项名称, 因此 `wA`, `wC` 和 `wD` 均可匹配.  
需额外留意上述匹配方式与 Auto.js 4.x 版本不同, 4.x 版本筛选时会考虑前台活动应用的包名.  
如果编写的代码需兼容不同的 Auto.js 版本, 建议使用 [idEndsWith](#m-idendswith) (如 `idEndsWith('some_entry')`) 或 [idMatches](#m-idmatches) (如 `idMatches(/.*some_entry/)`).

[拾取选择器](#m-pickup) 示例:

```js
pickup(id('some_entry'), '@');
pickup({ id: 'some_entry' }, '@');
pickup({ id: [ 'some_entry' ] }, '@');
```

> 方法变更记录
> - 6.2.0 - 筛选条件为 ID 资源项 (非 ID 资源全称) 时, 忽略包名匹配.

## [m#] idStartsWith

### idStartsWith(str)

**`[6.2.0]`** **`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[ID 资源选择器](#m-id) 的 [前缀匹配筛选器](#xxxstartswith).

- 筛选条件说明: ID 资源全称前缀或 ID 资源项名称前缀匹配指定字符串
- 关联控件属性: [id](uiObjectType#m-id)

在 AutoJs6 中, ID 资源前缀匹配筛选器支持两种方式作为筛选条件:

- ID 资源全称 (如 `com.test:id/some_entry`)
- ID 资源项名称 (如 `some_entry`)

例如对于以下 4 个控件:

```js
wA.id(); // com.test.abc:id/some_entry
wB.id(); // com.test.abc:id/some_other_entry
wC.id(); // com.test.jkl:id/some_entry
wD.id(); // com.test.xyz:id/some_entry
```

`idStartsWith('com.test.abc:id/some_')` 是一个包含包名的 ID 前缀匹配筛选器, 可以匹配控件 `wA` 和 `wB`.

`idStartsWith('com.test.xyz:id/some_')` 同样是一个包含包名的 ID 前缀匹配筛选器, 可以匹配控件 `wD`.

`idStartsWith('some_')` 则是一个仅包含 ID 资源项名称的前缀匹配筛选器.  
它不包含包名信息, 匹配时只关心资源项名称, 因此 `wA`, `wB`, `wC` 和 `wD` 均可匹配.  
需额外留意上述匹配方式与 Auto.js 4.x 版本不同, 4.x 版本筛选时会考虑前台活动应用的包名.  
如果编写的代码需兼容不同的 Auto.js 版本, 建议使用 [idMatches](#m-idmatches) (如 `idMatches(/.*some_.*/)`).

[拾取选择器](#m-pickup) 示例:

```js
pickup(idStartsWith('some_'), '@');
pickup({ idStartsWith: 'some_' }, '@');
pickup({ idStartsWith: [ 'some_' ] }, '@');
```

> 方法变更记录
> - 6.2.0 - 筛选条件为 ID 资源项 (非 ID 资源全称) 时, 忽略包名匹配.

## [m#] idEndsWith

### idEndsWith(str)

**`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[ID 资源选择器](#m-id) 的 [后缀匹配筛选器](#xxxendswith).

- 筛选条件说明: ID 资源全称后缀匹配指定字符串
- 关联控件属性: [id](uiObjectType#m-id)

例如对于以下 4 个控件:

```js
wA.id(); // com.test.abc:id/some_entry
wB.id(); // com.test.abc:id/some_other_entry
wC.id(); // com.test.jkl:id/some_entry
wD.id(); // com.test.xyz:id/some_entry
```

`idEndsWith('abc')` 不可匹配上述任何控件.

`idEndsWith('some_entry')` 可以匹配控件 `wA`, `wC` 和 `wD`.

`idEndsWith('_entry')` 可以匹配控件 `wA`, `wB`, `wC` 和 `wD`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(idEndsWith('_entry'), '@');
pickup({ idEndsWith: '_entry' }, '@');
pickup({ idEndsWith: [ '_entry' ] }, '@');
```

## [m#] idContains

### idContains(str)

**`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[ID 资源选择器](#m-id) 的 [包含匹配筛选器](#xxxcontains).

- 筛选条件说明: ID 资源全称任意长度连续匹配指定字符串
- 关联控件属性: [id](uiObjectType#m-id)

ID 资源包含匹配筛选器在筛选时, 将同时对 `ID 资源全称` 和 `ID 资源项名称` 进行筛选.

例如对于以下 4 个控件:

```js
wA.id(); // com.test.abc:id/some_entry
wB.id(); // com.test.abc:id/some_other_entry
wC.id(); // com.test.jkl:id/some_entry
wD.id(); // com.test.xyz:id/some_entry
```

`idContains('abc')` 可以匹配控件 `wA` 和 `wB`, 因为 `'abc'` 匹配了它们的 ID 资源包名.

`idContains('com.test.')` 可以匹配控件 `wA`, `wB`, `wC` 和 `wD`, 因为 `'com.test.'` 匹配了它们的 ID 资源包名.

`idContains('other')` 可以匹配控件 `wB`, 因为 `'other'` 匹配了它的 ID 资源项名称.

`idContains('some_')` 则可以匹配控件 `wA`, `wB`, `wC` 和 `wD`, 因为 `'some_'` 匹配了它们的 ID 资源项名称.

[拾取选择器](#m-pickup) 示例:

```js
pickup(idContains('some_'), '@');
pickup({ idContains: 'some_' }, '@');
pickup({ idContains: [ 'some_' ] }, '@');
```

## [m#] idMatches

### idMatches(regex)

**`Global`** **`DEPRECATED`**

- **regex** { [string](dataTypes#string) | [RegExp](dataTypes#regexp) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[ID 资源选择器](#m-id) 的 [正则全匹配筛选器](#xxxmatches).

- 筛选条件说明: ID 资源全称的正则表达式规则完全匹配指定参数
- 关联控件属性: [id](uiObjectType#m-id)

ID 正则全匹配筛选器在筛选时, 将同时对 `ID 资源全称` 和 `ID 资源项名称` 进行筛选.

例如对于以下 4 个控件:

```js
wA.id(); // com.test.abc:id/some_entry
wB.id(); // com.test.abc:id/some_other_entry
wC.id(); // com.test.jkl:id/some_entry
wD.id(); // com.test.xyz:id/some_entry
```

`idMatches(/abc/)` 或 `idMatches('abc')` 不可匹配上述任何控件 (因为 `idMatches(/abc/)` 相当于 `idMatch(/^abc$/)`).

`idMatches(/com\.test\..+/)` 或 `idMatches('com\\.test\\..+')` 可以匹配控件 `wA`, `wB`, `wC` 和 `wD`, 因为 `/^com\.test\..+$/` 匹配了它们的 ID 资源包名.

`idMatches(/other/)` 或 `idMatches('other')` 不可匹配上述任何控件.

`idMatches(/.*other.*/)` 或 `idMatches('.*other.*')` 可以匹配控件 `wB`, 因为 `/^.*other.*$/` 匹配了它的 ID 资源项名称.

`idMatches(/some_/)` 或 `idMatches('some_')` 不可匹配上述任何控件.

`idMatches(/.*some_.*/)` 或 `idMatches('.*some_.*')` 可以匹配控件 `wA`, `wB`, `wC` 和 `wD`, 因为 `/^.*some_.*$/` 匹配了它们的 ID 资源项名称.

[拾取选择器](#m-pickup) 示例:

```js
pickup(idMatches(/.*some_.*/), '@');
pickup({ idMatches: /.*some_.*/ }, '@');
pickup({ idMatches: [ /.*some_.*/ ] }, '@');
```

> 注: 自 6.2.0 版本起, idMatches 已弃用, 建议使用 [idMatch](#m-idmatch), 详情参阅 [正则全匹配筛选器](#xxxmatches) 小节.

## [m#] idMatch

### idMatch(regex)

**`6.2.0`** **`Global`**

- **regex** { [string](dataTypes#string) | [RegExp](dataTypes#regexp) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[ID 资源选择器](#m-id) 的 [正则匹配筛选器](#xxxmatch).

- 筛选条件说明: ID 资源全称的正则表达式规则匹配指定参数
- 关联控件属性: [id](uiObjectType#m-id)

ID 正则匹配筛选器在筛选时, 将同时对 `ID 资源全称` 和 `ID 资源项名称` 进行筛选.

例如对于以下 4 个控件:

```js
wA.id(); // com.test.abc:id/some_entry
wB.id(); // com.test.abc:id/some_other_entry
wC.id(); // com.test.jkl:id/some_entry
wD.id(); // com.test.xyz:id/some_entry
```

`idMatch(/abc/)` 或 `idMatch('abc')` 可以匹配控件 `wA` 和 `wB`, 因为 `/abc/` 匹配了它们的 ID 资源包名.

`idMatch(/com\.test\..+/)` 或 `idMatch('com\\.test\\..+')` 可以匹配控件 `wA`, `wB`, `wC` 和 `wD`, 因为 `/com\.test\..+/` 匹配了它们的 ID 资源包名.

`idMatch(/other/)` 或 `idMatch('other')` 可以匹配控件 `wB`, 因为 `/other/` 匹配了它的 ID 资源项名称.

`idMatch(/some_/)` 或 `idMatch('some_')` 可以匹配控件 `wA`, `wB`, `wC` 和 `wD`, 因为 `/some_/` 匹配了它们的 ID 资源项名称.

[拾取选择器](#m-pickup) 示例:

```js
pickup(idMatch(/some_/), '@');
pickup({ idMatch: /some_/ }, '@');
pickup({ idMatch: [ /some_/ ] }, '@');
```

## [m#] idHex

### idHex(str)

**`6.2.0`** **`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[ID 资源十六进制代表值](uiObjectType#m-idhex) 选择器.

```js
console.log(idHex('0x7f090117').findOnce().idEntry()); /* e.g. explorer_item_list */
```

## [m#] text

### text(str)

**`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

文本选择器.

- 筛选条件说明: 文本完全匹配指定字符串
- 关联控件属性: [text](uiObjectType#m-text)

例如对于以下 4 个控件:

```js
wA.text(); // start
wB.text(); // Service Notification
wC.text(); // Contacts
wD.text(); // Coconuts
```

`text('Coconuts')` 是一个文本选择器, 可以匹配控件 `wD`.

`text('start')` 同样是一个文本选择器, 可以匹配控件 `wA`.  
但 `text('START')` 不能匹配上述任何控件, 因为文本匹配是大小写敏感的.

[拾取选择器](#m-pickup) 示例:

```js
pickup(text('start'), '@');
pickup({ text: 'start' }, '@');
pickup({ text: [ 'start' ] }, '@');
```

## [m#] textStartsWith

### textStartsWith(str)

**`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[文本选择器](#m-text) 的 [前缀匹配筛选器](#xxxstartswith).

- 筛选条件说明: 文本前缀匹配指定字符串
- 关联控件属性: [text](uiObjectType#m-text)

例如对于以下 4 个控件:

```js
wA.text(); // start
wB.text(); // Service Notification
wC.text(); // Contacts
wD.text(); // Coconuts
```

`textStartsWith('Co')` 是一个文本选择器, 可以匹配控件 `wC` 和 `wD`.

`textStartsWith('star')` 同样是一个文本选择器, 可以匹配控件 `wA`, 注意文本匹配是大小写敏感的.

[拾取选择器](#m-pickup) 示例:

```js
pickup(textStartsWith('star'), '@');
pickup({ textStartsWith: 'star' }, '@');
pickup({ textStartsWith: [ 'star' ] }, '@');
```

## [m#] textEndsWith

### textEndsWith(str)

**`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[文本选择器](#m-text) 的 [后缀匹配筛选器](#xxxendswith).

- 筛选条件说明: 文本后缀匹配指定字符串
- 关联控件属性: [text](uiObjectType#m-text)

例如对于以下 4 个控件:

```js
wA.text(); // start
wB.text(); // Service Notification
wC.text(); // Contacts
wD.text(); // Coconuts
```

`textEndsWith('vice')` 不可匹配上述任何控件.

`textEndsWith('ts')` 可以匹配控件 `wC` 和 `wD`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(textEndsWith('ts'), '@');
pickup({ textEndsWith: 'ts' }, '@');
pickup({ textEndsWith: [ 'ts' ] }, '@');
```

## [m#] textContains

### textContains(str)

**`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[文本选择器](#m-text) 的 [包含匹配筛选器](#xxxcontains).

- 筛选条件说明: 文本任意长度连续匹配指定字符串
- 关联控件属性: [text](uiObjectType#m-text)

例如对于以下 4 个控件:

```js
wA.text(); // start
wB.text(); // Service Notification
wC.text(); // Contacts
wD.text(); // Coconuts
```

`textContains('t')` 可以匹配控件 `wA`, `wB`, `wC` 和 `wD`.

`textContains('on')` 可以匹配控件 `wB` 和 `wC`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(textContains('on'), '@');
pickup({ textContains: 'on' }, '@');
pickup({ textContains: [ 'on' ] }, '@');
```

## [m#] textMatches

### textMatches(regex)

**`Global`** **`DEPRECATED`**

- **regex** { [string](dataTypes#string) | [RegExp](dataTypes#regexp) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[文本选择器](#m-text) 的 [正则全匹配筛选器](#xxxmatches).

- 筛选条件说明: 文本的正则表达式规则完全匹配指定参数
- 关联控件属性: [text](uiObjectType#m-text)

例如对于以下 4 个控件:

```js
wA.text(); // start
wB.text(); // Service Notification
wC.text(); // Contacts
wD.text(); // Coconuts
```

`textMatches(/star/)` 或 `textMatches('star')` 不可匹配上述任何控件 (因为 `textMatches(/star/)` 相当于 `textMatch(/^star$/)`).

`textMatches(/Co\w+ts/)` 或 `textMatches('Co\\w+ts')` 可以匹配控件 `wC` 和 `wD`, 因为 `/^Co\w+ts$/` 匹配了它们的文本.

`textMatches(/cat/)` 或 `textMatches('cat')` 不可匹配上述任何控件.

`textMatches(/.*cat.*/)` 或 `textMatches('.*cat.*')` 可以匹配控件 `wB`, 因为 `/^.*cat.*$/` 匹配了它的文本.

`textMatches(/t\w{0,3}/)` 或 `textMatches('t\\w{0,3}')` 不可匹配上述任何控件.

`textMatches(/.*t\w{0,3}/)` 或 `textMatches('.*t\\w{0,3}')` 可以匹配控件 `wA`, `wB`, `wC` 和 `wD`, 因为 `/^.*t\w{0,3}$/` 匹配了它们的文本.

[拾取选择器](#m-pickup) 示例:

```js
pickup(textMatches(/.*t\w{0,3}/), '@');
pickup({ textMatches: /.*t\w{0,3}/ }, '@');
pickup({ textMatches: [ /.*t\w{0,3}/ ] }, '@');
```

> 注: 自 6.2.0 版本起, textMatches 已弃用, 建议使用 [textMatch](#m-textmatch), 详情参阅 [正则全匹配筛选器](#xxxmatches) 小节.

## [m#] textMatch

### textMatch(regex)

**`6.2.0`** **`Global`**

- **regex** { [string](dataTypes#string) | [RegExp](dataTypes#regexp) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[文本选择器](#m-text) 的 [正则匹配筛选器](#xxxmatch).

- 筛选条件说明: 文本的正则表达式规则匹配指定参数
- 关联控件属性: [text](uiObjectType#m-text)

例如对于以下 4 个控件:

```js
wA.text(); // start
wB.text(); // Service Notification
wC.text(); // Contacts
wD.text(); // Coconuts
```

`textMatch(/star/)` 或 `textMatch('star')` 可以匹配 `wA` 控件.

`textMatch(/Co\w+ts/)` 或 `textMatch('Co\\w+ts')` 可以匹配控件 `wC` 和 `wD`.

`textMatch(/cat/)` 或 `textMatch('cat')` 可以匹配 `wB` 控件.

`textMatch(/t\w{0,3}/)` 或 `textMatch('t\\w{0,3}')` 可以匹配控件 `wA`, `wB`, `wC` 和 `wD`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(textMatch(/t\w{0,3}/), '@');
pickup({ textMatch: /t\w{0,3}/ }, '@');
pickup({ textMatch: [ /t\w{0,3}/ ] }, '@');
```

## [m#] desc

### desc(str)

**`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

内容描述标签选择器.

- 筛选条件说明: 内容描述标签完全匹配指定字符串
- 关联控件属性: [desc](uiObjectType#m-desc)

例如对于以下 4 个控件:

```js
wA.desc(); // start
wB.desc(); // Service Notification
wC.desc(); // Contacts
wD.desc(); // Coconuts
```

`desc('Coconuts')` 是一个内容描述标签选择器, 可以匹配控件 `wD`.

`desc('start')` 同样是一个内容描述标签选择器, 可以匹配控件 `wA`.  
但 `desc('START')` 不能匹配上述任何控件, 因为内容描述标签匹配是大小写敏感的.

[拾取选择器](#m-pickup) 示例:

```js
pickup(desc('start'), '@');
pickup({ desc: 'start' }, '@');
pickup({ desc: [ 'start' ] }, '@');
```

## [m#] descStartsWith

### descStartsWith(str)

**`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[内容描述标签选择器](#m-desc) 的 [前缀匹配筛选器](#xxxstartswith).

- 筛选条件说明: 内容描述标签前缀匹配指定字符串
- 关联控件属性: [desc](uiObjectType#m-desc)

例如对于以下 4 个控件:

```js
wA.desc(); // start
wB.desc(); // Service Notification
wC.desc(); // Contacts
wD.desc(); // Coconuts
```

`descStartsWith('Co')` 是一个内容描述标签选择器, 可以匹配控件 `wC` 和 `wD`.

`descStartsWith('star')` 同样是一个内容描述标签选择器, 可以匹配控件 `wA`, 注意内容描述标签匹配是大小写敏感的.

[拾取选择器](#m-pickup) 示例:

```js
pickup(descStartsWith('star'), '@');
pickup({ descStartsWith: 'star' }, '@');
pickup({ descStartsWith: [ 'star' ] }, '@');
```

## [m#] descEndsWith

### descEndsWith(str)

**`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[内容描述标签选择器](#m-desc) 的 [后缀匹配筛选器](#xxxendswith).

- 筛选条件说明: 内容描述标签后缀匹配指定字符串
- 关联控件属性: [desc](uiObjectType#m-desc)

例如对于以下 4 个控件:

```js
wA.desc(); // start
wB.desc(); // Service Notification
wC.desc(); // Contacts
wD.desc(); // Coconuts
```

`descEndsWith('vice')` 不可匹配上述任何控件.

`descEndsWith('ts')` 可以匹配控件 `wC` 和 `wD`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(descEndsWith('ts'), '@');
pickup({ descEndsWith: 'ts' }, '@');
pickup({ descEndsWith: [ 'ts' ] }, '@');
```

## [m#] descContains

### descContains(str)

**`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[内容描述标签选择器](#m-desc) 的 [包含匹配筛选器](#xxxcontains).

- 筛选条件说明: 内容描述标签任意长度连续匹配指定字符串
- 关联控件属性: [desc](uiObjectType#m-desc)

例如对于以下 4 个控件:

```js
wA.desc(); // start
wB.desc(); // Service Notification
wC.desc(); // Contacts
wD.desc(); // Coconuts
```

`descContains('t')` 可以匹配控件 `wA`, `wB`, `wC` 和 `wD`.

`descContains('on')` 可以匹配控件 `wB` 和 `wC`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(descContains('on'), '@');
pickup({ descContains: 'on' }, '@');
pickup({ descContains: [ 'on' ] }, '@');
```

## [m#] descMatches

### descMatches(regex)

**`Global`** **`DEPRECATED`**

- **regex** { [string](dataTypes#string) | [RegExp](dataTypes#regexp) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[内容描述标签选择器](#m-desc) 的 [正则全匹配筛选器](#xxxmatches).

- 筛选条件说明: 内容描述标签的正则表达式规则完全匹配指定参数
- 关联控件属性: [desc](uiObjectType#m-desc)

例如对于以下 4 个控件:

```js
wA.desc(); // start
wB.desc(); // Service Notification
wC.desc(); // Contacts
wD.desc(); // Coconuts
```

`descMatches(/star/)` 或 `descMatches('star')` 不可匹配上述任何控件 (因为 `descMatches(/star/)` 相当于 `descMatch(/^star$/)`).

`descMatches(/Co\w+ts/)` 或 `descMatches('Co\\w+ts')` 可以匹配控件 `wC` 和 `wD`, 因为 `/^Co\w+ts$/` 匹配了它们的内容描述标签.

`descMatches(/cat/)` 或 `descMatches('cat')` 不可匹配上述任何控件.

`descMatches(/.*cat.*/)` 或 `descMatches('.*cat.*')` 可以匹配控件 `wB`, 因为 `/^.*cat.*$/` 匹配了它的内容描述标签.

`descMatches(/t\w{0,3}/)` 或 `descMatches('t\\w{0,3}')` 不可匹配上述任何控件.

`descMatches(/.*t\w{0,3}/)` 或 `descMatches('.*t\\w{0,3}')` 可以匹配控件 `wA`, `wB`, `wC` 和 `wD`, 因为 `/^.*t\w{0,3}$/` 匹配了它们的内容描述标签.

[拾取选择器](#m-pickup) 示例:

```js
pickup(descMatches(/.*t\w{0,3}/), '@');
pickup({ descMatches: /.*t\w{0,3}/ }, '@');
pickup({ descMatches: [ /.*t\w{0,3}/ ] }, '@');
```

> 注: 自 6.2.0 版本起, descMatches 已弃用, 建议使用 [descMatch](#m-descmatch), 详情参阅 [正则全匹配筛选器](#xxxmatches) 小节.

## [m#] descMatch

### descMatch(regex)

**`6.2.0`** **`Global`**

- **regex** { [string](dataTypes#string) | [RegExp](dataTypes#regexp) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[内容描述标签选择器](#m-desc) 的 [正则匹配筛选器](#xxxmatch).

- 筛选条件说明: 内容描述标签的正则表达式规则匹配指定参数
- 关联控件属性: [desc](uiObjectType#m-desc)

例如对于以下 4 个控件:

```js
wA.desc(); // start
wB.desc(); // Service Notification
wC.desc(); // Contacts
wD.desc(); // Coconuts
```

`descMatch(/star/)` 或 `descMatch('star')` 可以匹配 `wA` 控件.

`descMatch(/Co\w+ts/)` 或 `descMatch('Co\\w+ts')` 可以匹配控件 `wC` 和 `wD`.

`descMatch(/cat/)` 或 `descMatch('cat')` 可以匹配 `wB` 控件.

`descMatch(/t\w{0,3}/)` 或 `descMatch('t\\w{0,3}')` 可以匹配控件 `wA`, `wB`, `wC` 和 `wD`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(descMatch(/t\w{0,3}/), '@');
pickup({ descMatch: /t\w{0,3}/ }, '@');
pickup({ descMatch: [ /t\w{0,3}/ ] }, '@');
```

## [m#] content

### content(str)

**`6.2.0`** **`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

内容选择器.

- 筛选条件说明: 内容完全匹配指定字符串
- 关联控件属性: [content](uiObjectType#m-content)

例如对于以下 4 个控件:

```js
wA.content(); // start
wB.content(); // Service Notification
wC.content(); // Contacts
wD.content(); // Coconuts
```

`content('Coconuts')` 是一个内容选择器, 可以匹配控件 `wD`.

`content('start')` 同样是一个内容选择器, 可以匹配控件 `wA`.  
但 `content('START')` 不能匹配上述任何控件, 因为内容匹配是大小写敏感的.

[拾取选择器](#m-pickup) 示例:

```js
pickup(content('start'), '@');
pickup({ content: 'start' }, '@');
pickup({ content: [ 'start' ] }, '@');
```

## [m#] contentStartsWith

### contentStartsWith(str)

**`6.2.0`** **`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[内容选择器](#m-content) 的 [前缀匹配筛选器](#xxxstartswith).

- 筛选条件说明: 内容前缀匹配指定字符串
- 关联控件属性: [content](uiObjectType#m-content)

例如对于以下 4 个控件:

```js
wA.content(); // start
wB.content(); // Service Notification
wC.content(); // Contacts
wD.content(); // Coconuts
```

`contentStartsWith('Co')` 是一个内容选择器, 可以匹配控件 `wC` 和 `wD`.

`contentStartsWith('star')` 同样是一个内容选择器, 可以匹配控件 `wA`, 注意内容匹配是大小写敏感的.

[拾取选择器](#m-pickup) 示例:

```js
pickup(contentStartsWith('star'), '@');
pickup({ contentStartsWith: 'star' }, '@');
pickup({ contentStartsWith: [ 'star' ] }, '@');
```

## [m#] contentEndsWith

### contentEndsWith(str)

**`6.2.0`** **`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[内容选择器](#m-content) 的 [后缀匹配筛选器](#xxxendswith).

- 筛选条件说明: 内容后缀匹配指定字符串
- 关联控件属性: [content](uiObjectType#m-content)

例如对于以下 4 个控件:

```js
wA.content(); // start
wB.content(); // Service Notification
wC.content(); // Contacts
wD.content(); // Coconuts
```

`contentEndsWith('vice')` 不可匹配上述任何控件.

`contentEndsWith('ts')` 可以匹配控件 `wC` 和 `wD`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(contentEndsWith('ts'), '@');
pickup({ contentEndsWith: 'ts' }, '@');
pickup({ contentEndsWith: [ 'ts' ] }, '@');
```

## [m#] contentContains

### contentContains(str)

**`6.2.0`** **`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[内容选择器](#m-content) 的 [包含匹配筛选器](#xxxcontains).

- 筛选条件说明: 内容任意长度连续匹配指定字符串
- 关联控件属性: [content](uiObjectType#m-content)

例如对于以下 4 个控件:

```js
wA.content(); // start
wB.content(); // Service Notification
wC.content(); // Contacts
wD.content(); // Coconuts
```

`contentContains('t')` 可以匹配控件 `wA`, `wB`, `wC` 和 `wD`.

`contentContains('on')` 可以匹配控件 `wB` 和 `wC`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(contentContains('on'), '@');
pickup({ contentContains: 'on' }, '@');
pickup({ contentContains: [ 'on' ] }, '@');
```

## [m#] contentMatches

### contentMatches(regex)

**`6.2.0`** **`Global`** **`DEPRECATED`**

- **regex** { [string](dataTypes#string) | [RegExp](dataTypes#regexp) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[内容选择器](#m-content) 的 [正则全匹配筛选器](#xxxmatches).

- 筛选条件说明: 内容的正则表达式规则完全匹配指定参数
- 关联控件属性: [content](uiObjectType#m-content)

例如对于以下 4 个控件:

```js
wA.content(); // start
wB.content(); // Service Notification
wC.content(); // Contacts
wD.content(); // Coconuts
```

`contentMatches(/star/)` 或 `contentMatches('star')` 不可匹配上述任何控件 (因为 `contentMatches(/star/)` 相当于 `contentMatch(/^star$/)`).

`contentMatches(/Co\w+ts/)` 或 `contentMatches('Co\\w+ts')` 可以匹配控件 `wC` 和 `wD`, 因为 `/^Co\w+ts$/` 匹配了它们的内容.

`contentMatches(/cat/)` 或 `contentMatches('cat')` 不可匹配上述任何控件.

`contentMatches(/.*cat.*/)` 或 `contentMatches('.*cat.*')` 可以匹配控件 `wB`, 因为 `/^.*cat.*$/` 匹配了它的内容.

`contentMatches(/t\w{0,3}/)` 或 `contentMatches('t\\w{0,3}')` 不可匹配上述任何控件.

`contentMatches(/.*t\w{0,3}/)` 或 `contentMatches('.*t\\w{0,3}')` 可以匹配控件 `wA`, `wB`, `wC` 和 `wD`, 因为 `/^.*t\w{0,3}$/` 匹配了它们的内容.

[拾取选择器](#m-pickup) 示例:

```js
pickup(contentMatches(/.*t\w{0,3}/), '@');
pickup({ contentMatches: /.*t\w{0,3}/ }, '@');
pickup({ contentMatches: [ /.*t\w{0,3}/ ] }, '@');
```

> 注: 自 6.2.0 版本起, contentMatches 已弃用, 建议使用 [contentMatch](#m-contentmatch), 详情参阅 [正则全匹配筛选器](#xxxmatches) 小节.

## [m#] contentMatch

### contentMatch(regex)

**`6.2.0`** **`Global`**

- **regex** { [string](dataTypes#string) | [RegExp](dataTypes#regexp) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[内容选择器](#m-content) 的 [正则匹配筛选器](#xxxmatch).

- 筛选条件说明: 内容的正则表达式规则匹配指定参数
- 关联控件属性: [content](uiObjectType#m-content)

例如对于以下 4 个控件:

```js
wA.content(); // start
wB.content(); // Service Notification
wC.content(); // Contacts
wD.content(); // Coconuts
```

`contentMatch(/star/)` 或 `contentMatch('star')` 可以匹配 `wA` 控件.

`contentMatch(/Co\w+ts/)` 或 `contentMatch('Co\\w+ts')` 可以匹配控件 `wC` 和 `wD`.

`contentMatch(/cat/)` 或 `contentMatch('cat')` 可以匹配 `wB` 控件.

`contentMatch(/t\w{0,3}/)` 或 `contentMatch('t\\w{0,3}')` 可以匹配控件 `wA`, `wB`, `wC` 和 `wD`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(contentMatch(/t\w{0,3}/), '@');
pickup({ contentMatch: /t\w{0,3}/ }, '@');
pickup({ contentMatch: [ /t\w{0,3}/ ] }, '@');
```

## [m#] className

### className(str)

**`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

类名选择器.

- 筛选条件说明: 类名或安卓控件类名简称完全匹配指定字符串
- 关联控件属性: [className](uiObjectType#m-classname)

在 AutoJs6 中, 类名选择器支持两种方式作为筛选条件:

- 类名全称 (如 `android.widget.EditText`)
- 安卓控件类名简称 (如 `EditText`)

例如对于以下 4 个控件:

```js
wA.className(); // android.view.View
wB.className(); // android.widget.Button
wC.className(); // android.widget.EditText
wD.className(); // androidx.recyclerview.widget.RecyclerView
```

`className('android.widget.Button')` 是一个类名选择器, 可以匹配控件 `wB`.  
`className('Button')` 与上述选择器效果相同, 它使用安卓控件类名简称作为筛选条件.

`className('androidx.recyclerview.widget.RecyclerView')` 同样是一个类名选择器, 可以匹配控件 `wD`.  
但 `className('RecyclerView')` 不能匹配上述任何控件, 因为只有 `android.widget.` 开头的类名才能使用简称形式进行筛选.

[拾取选择器](#m-pickup) 示例:

```js
pickup(className('Button'), '@');
pickup({ className: 'Button' }, '@');
pickup({ className: [ 'Button' ] }, '@');
```

## [m#] classNameStartsWith

### classNameStartsWith(str)

**`[6.2.0]`** **`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[类名选择器](#m-classname) 的 [前缀匹配筛选器](#xxxstartswith).

- 筛选条件说明: 类名前缀匹配指定字符串
- 关联控件属性: [className](uiObjectType#m-classname)

在 AutoJs6 中, 类名前缀匹配筛选器支持两种方式作为筛选条件:

- 类名全称 (如 `android.widget.EditText`)
- 安卓控件类名简称 (如 `EditText`)

例如对于以下 4 个控件:

```js
wA.className(); // android.view.View
wB.className(); // android.widget.Button
wC.className(); // android.widget.EditText
wD.className(); // androidx.recyclerview.widget.RecyclerView
```

`classNameStartsWith('android.widget.Bu')` 是一个类名前缀选择器, 可以匹配控件 `wB`.  
`classNameStartsWith('Bu')` 与上述选择器效果相同, 它使用安卓控件类名简称作为筛选条件.

`classNameStartsWith('androidx.recyclerview.widget.Rec')` 同样是一个类名前缀选择器, 可以匹配控件 `wD`.  
但 `classNameStartsWith('Rec')` 不能匹配上述任何控件, 因为只有 `android.widget.` 开头的类名才能使用简称形式进行前缀筛选.

需额外留意上述匹配方式与 Auto.js 4.x 版本不同, 4.x 版本在做类名前缀筛选时, 不支持简称形式.  
如果编写的代码需兼容不同的 Auto.js 版本, 建议使用 [classNameEndsWith](#m-classnameendswith) (如 `classNameEndsWith('RecyclerView')`) 或 [classNameMatches](#m-classnamematches) (如 `classNameMatches(/.*Rec.*/)`).

[拾取选择器](#m-pickup) 示例:

```js
pickup(classNameStartsWith('Rec'), '@');
pickup({ classNameStartsWith: 'Rec' }, '@');
pickup({ classNameStartsWith: [ 'Rec' ] }, '@');
```

> 方法变更记录
> - 6.2.0 - 支持安卓控件类名简称作为类名前缀筛选条件.

## [m#] classNameEndsWith

### classNameEndsWith(str)

**`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[类名选择器](#m-classname) 的 [后缀匹配筛选器](#xxxendswith).

- 筛选条件说明: 类名后缀匹配指定字符串
- 关联控件属性: [className](uiObjectType#m-classname)

例如对于以下 4 个控件:

```js
wA.className(); // android.view.View
wB.className(); // android.widget.Button
wC.className(); // android.widget.EditText
wD.className(); // androidx.recyclerview.widget.RecyclerView
```

`classNameEndsWith('View')` 可以匹配控件 `wA` 和 `wD`.  
而 `classNameEndsWith('view')` 不可匹配上述任何控件, 因为类名匹配是大小写敏感的.

`classNameEndsWith('Button')` 可以匹配控件 `wB`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(classNameEndsWith('Button'), '@');
pickup({ classNameEndsWith: 'Button' }, '@');
pickup({ classNameEndsWith: [ 'Button' ] }, '@');
```

## [m#] classNameContains

### classNameContains(str)

**`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[类名选择器](#m-classname) 的 [包含匹配筛选器](#xxxcontains).

- 筛选条件说明: 类名任意长度连续匹配指定字符串
- 关联控件属性: [className](uiObjectType#m-classname)

例如对于以下 4 个控件:

```js
wA.className(); // android.view.View
wB.className(); // android.widget.Button
wC.className(); // android.widget.EditText
wD.className(); // androidx.recyclerview.widget.RecyclerView
```

`classNameContains('android')` 可以匹配控件 `wA`, `wB`, `wC` 和 `wD`.

`classNameContains('Button')` 可以匹配控件 `wB`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(classNameContains('Button'), '@');
pickup({ classNameContains: 'Button' }, '@');
pickup({ classNameContains: [ 'Button' ] }, '@');
```

## [m#] classNameMatches

### classNameMatches(regex)

**`Global`** **`DEPRECATED`**

- **regex** { [string](dataTypes#string) | [RegExp](dataTypes#regexp) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[类名选择器](#m-classname) 的 [正则全匹配筛选器](#xxxmatches).

- 筛选条件说明: 类名的正则表达式规则完全匹配指定参数
- 关联控件属性: [className](uiObjectType#m-classname)

例如对于以下 4 个控件:

```js
wA.className(); // android.view.View
wB.className(); // android.widget.Button
wC.className(); // android.widget.EditText
wD.className(); // androidx.recyclerview.widget.RecyclerView
```

`classNameMatches(/EditText/)` 或 `classNameMatches('EditText')` 不可匹配上述任何控件 (因为 `classNameMatches(/EditText/)` 相当于 `classNameMatch(/^EditText$/)`).

`classNameMatches(/android.+View/)` 或 `classNameMatches('android.+View')` 可以匹配控件 `wA` 和 `wD`, 因为 `/^android.+View$/` 匹配了它们的类名.

`classNameMatches(/Edit/)` 或 `classNameMatches('Edit')` 不可匹配上述任何控件.

`classNameMatches(/.*Edit.*/)` 或 `classNameMatches('.*Edit.*')` 可以匹配控件 `wC`, 因为 `/^.*Edit.*$/` 匹配了它的类名.

`classNameMatches(/V\w{0,3}/)` 或 `classNameMatches('V\\w{0,3}')` 不可匹配上述任何控件.

`classNameMatches(/.*V\w{0,3}/)` 或 `classNameMatches('.*V\\w{0,3}')` 可以匹配控件 `wA` 和 `wD`, 因为 `/^.*V\w{0,3}$/` 匹配了它们的类名.

[拾取选择器](#m-pickup) 示例:

```js
pickup(classNameMatches(/.*V\w{0,3}/), '@');
pickup({ classNameMatches: /.*V\w{0,3}/ }, '@');
pickup({ classNameMatches: [ /.*V\w{0,3}/ ] }, '@');
```

> 注: 自 6.2.0 版本起, classNameMatches 已弃用, 建议使用 [classNameMatch](#m-classnamematch), 详情参阅 [正则全匹配筛选器](#xxxmatches) 小节.

## [m#] classNameMatch

### classNameMatch(regex)

**`6.2.0`** **`Global`**

- **regex** { [string](dataTypes#string) | [RegExp](dataTypes#regexp) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[类名选择器](#m-classname) 的 [正则匹配筛选器](#xxxmatch).

- 筛选条件说明: 类名的正则表达式规则匹配指定参数
- 关联控件属性: [className](uiObjectType#m-classname)

例如对于以下 4 个控件:

```js
wA.className(); // android.view.View
wB.className(); // android.widget.Button
wC.className(); // android.widget.EditText
wD.className(); // androidx.recyclerview.widget.RecyclerView
```

`classNameMatch(/EditText/)` 或 `classNameMatch('EditText')` 可以匹配 `wC` 控件.  
`classNameMatch(/Edit/)` 或 `classNameMatch('Edit')` 也可以匹配 `wC` 控件.

`classNameMatch(/^android/)` 或 `classNameMatch('^android')` 可以匹配 `wA`, `wB`, `wC` 和 `wD` 控件.

`classNameMatch(/V\w{0,3}$/)` 或 `classNameMatch('V\\w{0,3}$')` 可以匹配控件 `wA` 和 `wD`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(classNameMatch(/V\w{0,3}$/), '@');
pickup({ classNameMatch: /V\w{0,3}$/ }, '@');
pickup({ classNameMatch: [ /V\w{0,3}$/ ] }, '@');
```

## [m#] packageName

### packageName(str)

**`Overload 1/2`** **`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

包名选择器.

- 筛选条件说明: 包名完全匹配指定字符串
- 关联控件属性: [packageName](uiObjectType#m-packagename)

例如对于以下 4 个控件:

```js
wA.packageName(); // org.mozilla.firefox
wB.packageName(); // com.microsoft.office.word
wC.packageName(); // com.twitter.android
wD.packageName(); // com.accuweather.android
```

`packageName('com.twitter.android')` 是一个包名选择器, 可以匹配控件 `wC`.

`packageName('com.microsoft.office.word)` 同样是一个包名选择器, 可以匹配控件 `wB`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(packageName(com.microsoft.office.word), '@');
pickup({ packageName: com.microsoft.office.word }, '@');
pickup({ packageName: [ com.microsoft.office.word ] }, '@');
```

### packageName(app)

**`6.2.0`** **`Overload 2/2`** **`Global`**

- **app** { [App](appType) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

包名选择器.

- 筛选条件说明: 包名完全匹配指定 [应用枚举类](appType) 实例的包名
- 关联控件属性: [packageName](uiObjectType#m-packagename)

例如对于以下 4 个控件:

```js
wA.packageName(); // org.mozilla.firefox
wB.packageName(); // com.microsoft.office.word
wC.packageName(); // com.twitter.android
wD.packageName(); // com.accuweather.android
```

`packageName(App.TWITTER)` 是一个包名选择器, 可以匹配控件 `wC`, 它使用 `应用枚举类` 实例对象作为筛选条件.

`packageName(App.WORD)` 同样是一个包名选择器, 可以匹配控件 `wB`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(packageName(App.WORD), '@');
pickup({ packageName: App.WORD }, '@');
pickup({ packageName: [ App.WORD ] }, '@');
```

## [m#] packageNameStartsWith

### packageNameStartsWith(str)

**`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[包名选择器](#m-packagename) 的 [前缀匹配筛选器](#xxxstartswith).

- 筛选条件说明: 包名前缀匹配指定字符串
- 关联控件属性: [packageName](uiObjectType#m-packagename)

例如对于以下 4 个控件:

```js
wA.packageName(); // org.mozilla.firefox
wB.packageName(); // com.microsoft.office.word
wC.packageName(); // com.twitter.android
wD.packageName(); // com.accuweather.android
```

`packageNameStartsWith('com.')` 是一个包名前缀选择器, 可以匹配控件 `wB`, `wC` 和 `wD`.

`packageNameStartsWith('com.a)` 同样是一个包名前缀选择器, 可以匹配控件 `wD`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(packageNameStartsWith('com.a'), '@');
pickup({ packageNameStartsWith: 'com.a' }, '@');
pickup({ packageNameStartsWith: [ 'com.a' ] }, '@');
```

## [m#] packageNameEndsWith

### packageNameEndsWith(str)

**`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[包名选择器](#m-packagename) 的 [后缀匹配筛选器](#xxxendswith).

- 筛选条件说明: 包名后缀匹配指定字符串
- 关联控件属性: [packageName](uiObjectType#m-packagename)

例如对于以下 4 个控件:

```js
wA.packageName(); // org.mozilla.firefox
wB.packageName(); // com.microsoft.office.word
wC.packageName(); // com.twitter.android
wD.packageName(); // com.accuweather.android
```

`packageNameEndsWith('android')` 可以匹配控件 `wC` 和 `wD`.  
而 `packageNameEndsWith('Android')` 不可匹配上述任何控件, 因为包名匹配是大小写敏感的.

`packageNameEndsWith('firefox')` 可以匹配控件 `wA`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(packageNameEndsWith('firefox'), '@');
pickup({ packageNameEndsWith: 'firefox' }, '@');
pickup({ packageNameEndsWith: [ 'firefox' ] }, '@');
```

## [m#] packageNameContains

### packageNameContains(str)

**`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[包名选择器](#m-packagename) 的 [包含匹配筛选器](#xxxcontains).

- 筛选条件说明: 包名任意长度连续匹配指定字符串
- 关联控件属性: [packageName](uiObjectType#m-packagename)

例如对于以下 4 个控件:

```js
wA.packageName(); // org.mozilla.firefox
wB.packageName(); // com.microsoft.office.word
wC.packageName(); // com.twitter.android
wD.packageName(); // com.accuweather.android
```

`packageNameContains('com')` 可以匹配控件 `wB`, `wC` 和 `wD`.

`packageNameContains('office')` 可以匹配控件 `wB`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(packageNameContains('office'), '@');
pickup({ packageNameContains: 'office' }, '@');
pickup({ packageNameContains: [ 'office' ] }, '@');
```

## [m#] packageNameMatches

### packageNameMatches(regex)

**`Global`** **`DEPRECATED`**

- **regex** { [string](dataTypes#string) | [RegExp](dataTypes#regexp) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[包名选择器](#m-packagename) 的 [正则全匹配筛选器](#xxxmatches).

- 筛选条件说明: 包名的正则表达式规则完全匹配指定参数
- 关联控件属性: [packageName](uiObjectType#m-packagename)

例如对于以下 4 个控件:

```js
wA.packageName(); // org.mozilla.firefox
wB.packageName(); // com.microsoft.office.word
wC.packageName(); // com.twitter.android
wD.packageName(); // com.accuweather.android
```

`packageNameMatches(/office/)` 或 `packageNameMatches('office')` 不可匹配上述任何控件 (因为 `packageNameMatches(/office/)` 相当于 `packageNameMatch(/^office$/)`).

`packageNameMatches(/com.+android/)` 或 `packageNameMatches('com.+android')` 可以匹配控件 `wC` 和 `wD`, 因为 `/^com.+android$/` 匹配了它们的包名.

`packageNameMatches(/twitter/)` 或 `packageNameMatches('twitter')` 不可匹配上述任何控件.

`packageNameMatches(/.*twitter.*/)` 或 `packageNameMatches('.*twitter.*')` 可以匹配控件 `wC`, 因为 `/^.*twitter.*$/` 匹配了它的包名.

`packageNameMatches(/\.\w*r\w*d/)` 或 `packageNameMatches('\\.\\w*r\\w*d')` 不可匹配上述任何控件.

`packageNameMatches(/.*\.\w*r\w*d/)` 或 `packageNameMatches('.*\\.\\w*r\\w*d')` 可以匹配控件 `wB`, `wC` 和 `wD`, 因为 `/^.*\.\w*r\w*d$/` 匹配了它们的包名.

[拾取选择器](#m-pickup) 示例:

```js
pickup(packageNameMatches(/.*\.\w*r\w*d/), '@');
pickup({ packageNameMatches: /.*\.\w*r\w*d/ }, '@');
pickup({ packageNameMatches: [ /.*\.\w*r\w*d/ ] }, '@');
```

> 注: 自 6.2.0 版本起, packageNameMatches 已弃用, 建议使用 [packageNameMatch](#m-packagenamematch), 详情参阅 [正则全匹配筛选器](#xxxmatches) 小节.

## [m#] packageNameMatch

### packageNameMatch(regex)

**`6.2.0`** **`Global`**

- **regex** { [string](dataTypes#string) | [RegExp](dataTypes#regexp) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[包名选择器](#m-packagename) 的 [正则匹配筛选器](#xxxmatch).

- 筛选条件说明: 包名的正则表达式规则匹配指定参数
- 关联控件属性: [packageName](uiObjectType#m-packagename)

例如对于以下 4 个控件:

```js
wA.packageName(); // org.mozilla.firefox
wB.packageName(); // com.microsoft.office.word
wC.packageName(); // com.twitter.android
wD.packageName(); // com.accuweather.android
```

`packageNameMatch(/office/)` 或 `packageNameMatch('office')` 可以匹配 `wC` 控件.

`packageNameMatch(/android$/)` 或 `packageNameMatch('android$')` 可以匹配 `wC` 和 `wD` 控件.

`packageNameMatch(/\.\w*r\w*d$/)` 或 `packageNameMatch('\\.\\w*r\\w*d$')` 可以匹配控件 `wB`, `wC` 和 `wD`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(packageNameMatch(/\.\w*r\w*d$/), '@');
pickup({ packageNameMatch: /\.\w*r\w*d$/ }, '@');
pickup({ packageNameMatch: [ /\.\w*r\w*d$/ ] }, '@');
```

## [m#] currentApp

### currentApp(app)

**`6.2.0`** **`Overload 1/2`** **`Global`**

- **app** { [App](appType) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

应用选择器.

- 筛选条件说明: 包名完全匹配指定 [应用枚举类](appType) 实例的包名
- 关联控件属性: [packageName](uiObjectType#m-packagename)

currentApp 传入 `应用枚举类` 实例时, 与 [packageName(app)](#packagenameapp) 效果相同.

例如对于以下 4 个控件:

```js
wA.packageName(); // org.mozilla.firefox
wB.packageName(); // com.microsoft.office.word
wC.packageName(); // com.twitter.android
wD.packageName(); // com.accuweather.android
```

`currentApp(App.TWITTER)` 是一个应用选择器, 可以匹配控件 `wC`.  
`packageName(App.TWITTER)` 是一个 [包名选择器](#m-packagename), 与上述选择器效果相同.

`currentApp(App.WORD)` 同样是一个应用选择器, 可以匹配控件 `wB`.
`packageName(App.WORD)` 与上述选择器效果相同.

[拾取选择器](#m-pickup) 示例:

```js
pickup(currentApp(App.WORD), '@');
pickup({ currentApp: App.WORD }, '@');
pickup({ currentApp: [ App.WORD ] }, '@');
```

### currentApp(name)

**`6.2.0`** **`Overload 2/2`** **`Global`**

- **name** { [string](dataTypes#string) } - 应用枚举类实例的 [ 别名 / 当前语言应用名 / 简体中文应用名 / 英文应用名 ]
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

应用选择器.

- 筛选条件说明: 包名完全匹配指定参数对应的 [应用枚举类](appType) 实例的包名
- 关联控件属性: [packageName](uiObjectType#m-packagename)

1. 解析 `name` 参数, 通过 [ 别名 / 当前语言应用名 / 简体中文应用名 / 英文应用名 ] 确定 `应用枚举类` 唯一实例
2. 获取上述 `应用枚举类` 实例的包名作为参照值
3. 筛选包名可匹配上述参照值的控件

例如对于以下控件:

```js
w.packageName(); // com.eg.android.AlipayGphone
```

`currentApp('支付宝')` 是一个应用选择器, 可以匹配控件 `w`, 它使用 `应用枚举类` 实例的简体中文应用名作为筛选条件.

`currentApp('Alipay')` 是一个应用选择器, 可以匹配控件 `w`, 它使用 `应用枚举类` 实例的英文应用名作为筛选条件.

`currentApp('alipay')` 是一个应用选择器, 可以匹配控件 `w`, 它使用 `应用枚举类` 实例的别名作为筛选条件.

[拾取选择器](#m-pickup) 示例:

```js
pickup(currentApp('alipay'), '@');
pickup({ currentApp: 'alipay' }, '@');
pickup({ currentApp: [ 'alipay' ] }, '@');
```

## [m#] bounds

### bounds(left, top, right, bottom)

**`[6.2.0]`** **`Global`**

- **left** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形左边界 X 坐标或百分比
- **top** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形上边界 Y 坐标或百分比
- **right** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形右边界 X 坐标或百分比
- **bottom** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形下边界 Y 坐标或百分比
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 选择器.

- 筛选条件说明: 控件矩形完全匹配指定的边界参数
- 关联控件属性: [bounds](uiObjectType#m-bounds)

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(0, 48 - 112, 160)
wB.bounds(); // Rect(0, 192 - 972, 1728)
wC.bounds(); // Rect(0, 192 - 1080, 1920)
```

`bounds(0, 48, 112, 160)` 是一个控件矩形选择器, 可以匹配控件 `wA`, 它使用 4 个绝对坐标值作为筛选条件.

`bounds(0, 0.1, 0.9, 0.9)` 是一个控件矩形选择器, 有可能会匹配控件 `wB`, 它使用屏幕宽度和高度的百分比作为筛选条件.

`bounds(0, 192, -1, -1)` 是一个控件矩形选择器, 有可能会匹配控件 `wC`, 它使用绝对坐标值和屏幕宽高的指代值作为筛选条件.

打印选择器信息时, 百分比参数取保留三位小数的近似值:

```js
/* 设备屏幕: 1080 × 1920. */

console.log(655 / device.width); // 0.6064814814814815
console.log(bounds(655 / device.width, 0.1, 0.9, 0.9)); // bounds(0.606, 0.1, 0.9, 0.9)
```

百分比参数转换为实际像素值进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将同时筛选最近的两个整数:

```js
/* 设备屏幕: 1080 × 1920. */

/* 对于选择器 bounds(0.606, 0.1, 0.9, 0.9) . */

console.log('left: ' + 0.606 * device.width); // 654.48
console.log('top: ' + 0.1 * device.height); // 192
console.log('right: ' + 0.9 * device.width); // 972
console.log('bottom: ' + 0.9 * device.height); // 1728

/* 注意到 left 坐标不是整数, 因此会同时筛选 654 和 655 两个 left 坐标. */
/* 如果控件 w 的控件矩形为 Rect(655, 192 - 972, 1728), 则它可以被上述选择器匹配. */
```

[拾取选择器](#m-pickup) 示例:

```js
pickup(bounds(0, 192, -1, -1), '@');
pickup({ bounds: [ 0, 192, -1, -1 ] }, '@');
```

## [m#] boundsInside

### boundsInside(left, top, right, bottom)

**`[6.2.0]`** **`Global`**

- **left** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形左边界 X 坐标或百分比
- **top** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形上边界 Y 坐标或百分比
- **right** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形右边界 X 坐标或百分比
- **bottom** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形下边界 Y 坐标或百分比
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 选择器.

- 筛选条件说明: 控件矩形完全位于指定的边界内
- 关联控件属性: [bounds](uiObjectType#m-bounds)

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(0, 48 - 112, 160)
wB.bounds(); // Rect(0, 192 - 972, 1728)
wC.bounds(); // Rect(0, 192 - 1080, 1920)
```

`boundsInside(0, 32, 112, 160)` 是一个控件矩形选择器, 可以匹配控件 `wA`, 它使用 4 个绝对坐标值作为筛选条件.

`boundsInside(0, 0.02, 0.95, 0.95)` 是一个控件矩形选择器, 有可能会匹配控件 `wB`, 它使用屏幕宽度和高度的百分比作为筛选条件.

`boundsInside(0, 128, -1, -1)` 是一个控件矩形选择器, 有可能会匹配控件 `wB` 和 `wC`, 它使用绝对坐标值和屏幕宽高的指代值作为筛选条件.

`boundsInside(0, 0, -1, -1)` 是一个特殊的控件矩形筛选器, 它筛选边界全部位于屏幕内部的控件, 因此 `wA`, `wB` 和 `wC` 均可匹配, 但不可匹配 `Rect(0, -10 - 20, 20)`, 因其 `top` 坐标出界.

打印选择器信息时, 百分比参数取保留三位小数的近似值:

```js
/* 设备屏幕: 1080 × 1920. */

console.log(655 / device.width); // 0.6064814814814815
console.log(boundsInside(655 / device.width, 0.1, 0.9, 0.9)); // boundsInside(0.606, 0.1, 0.9, 0.9)
```

百分比参数转换为实际像素值进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对边界做 [控件矩形外展](glossaries#控件矩形外展) 处理:

```js
/* 设备屏幕: 1080 × 1920. */

/* 对于选择器 boundsInside(0.606, 0.1, 0.9, 0.9) . */

console.log('left: ' + 0.606 * device.width); // 654.48
console.log('top: ' + 0.1 * device.height); // 192
console.log('right: ' + 0.9 * device.width); // 972
console.log('bottom: ' + 0.9 * device.height); // 1728

/* 注意到 left 坐标不是整数, 因此会外展 left 坐标, 得到 654. */
/* 如果控件 w 的控件矩形为 Rect(655, 192 - 972, 1728), 则它可以被上述选择器匹配. */
```

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsInside(0, 0.02, 0.95, 0.95), '@');
pickup({ boundsInside: [ 0, 0.02, 0.95, 0.95 ] }, '@');
```

## [m#] boundsContains

### boundsContains(left, top, right, bottom)

**`[6.2.0]`** **`Global`**

- **left** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形左边界 X 坐标或百分比
- **top** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形上边界 Y 坐标或百分比
- **right** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形右边界 X 坐标或百分比
- **bottom** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形下边界 Y 坐标或百分比
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 选择器.

- 筛选条件说明: 控件矩形完全包含指定的边界
- 关联控件属性: [bounds](uiObjectType#m-bounds)

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(0, 48 - 112, 160)
wB.bounds(); // Rect(0, 192 - 972, 1728)
wC.bounds(); // Rect(0, 192 - 1080, 1920)
```

`boundsContains(0, 55, 112, 160)` 是一个控件矩形选择器, 可以匹配控件 `wA`, 它使用 4 个绝对坐标值作为筛选条件.

`boundsContains(0, 0.3, 0.85, 0.85)` 是一个控件矩形选择器, 有可能会匹配控件 `wB` 和 `wC`, 它使用屏幕宽度和高度的百分比作为筛选条件.

`boundsContains(0, 0.3, -1, -1)` 是一个控件矩形选择器, 有可能会匹配控件 `wC`, 它使用绝对坐标值和屏幕宽高的指代值作为筛选条件.

打印选择器信息时, 百分比参数取保留三位小数的近似值:

```js
/* 设备屏幕: 1080 × 1920. */

console.log(655 / device.width); // 0.6064814814814815
console.log(boundsContains(655 / device.width, 0.1, 0.9, 0.9)); // boundsContains(0.606, 0.1, 0.9, 0.9)
```

百分比参数转换为实际像素值进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对边界做 [控件矩形内收](glossaries#控件矩形内收) 处理:

```js
/* 设备屏幕: 1080 × 1920. */

/* 对于选择器 boundsContains(0.606, 0.1, 0.9, 0.9) . */

console.log('left: ' + 0.606 * device.width); // 654.48
console.log('top: ' + 0.1 * device.height); // 192
console.log('right: ' + 0.9 * device.width); // 972
console.log('bottom: ' + 0.9 * device.height); // 1728

/* 注意到 left 坐标不是整数, 因此会内收 left 坐标, 得到 655. */
/* 如果控件 w 的控件矩形为 Rect(655, 192 - 972, 1728), 则它可以被上述选择器匹配. */
```

boundsContains 选择器除了可用于 "矩形区域" 限定, 还可以用于 "线区域" 甚至 "点区域" 限定:

```js
/* "线区域" 限定. */
boundsContains(0.23, 0.1, 0.23, 0.98); /* 注意到 left 与 right 相同. */
boundsContains(0.1, 0.75, 0.9, 0.75); /* 注意到 top 与 bottom 相同. */

/* "点区域" 限定. */
boundsContains(0.23, 0.1, 0.23, 0.1); /* 注意到 left 与 right 相同, 且 top 与 bottom 相同. */
```

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsContains(0, 0.3, 0.85, 0.85), '@');
pickup({ boundsContains: [ 0, 0.3, 0.85, 0.85 ] }, '@');
```

## [m#] boundsLeft

### boundsLeft(value)

**`6.2.0`** **`Global`**

- **value** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形左边界 X 坐标或百分比
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的左边界与指定边界相符
- 关联控件属性: [ [boundsLeft](uiObjectType#m-boundsleft) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(108, 48 - 112, 160)
wB.bounds(); // Rect(108, 96 - 256, 1280)
wC.bounds(); // Rect(108, 112 - 1040, 1600)
```

`boundsLeft(108)` 是一个控件矩形边界选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用绝对坐标值作为筛选条件.

`boundsLeft(0.1)` 也是一个控件矩形边界选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕宽度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsLeft(0.1), '@');
pickup({ boundsLeft: 0.1 }, '@');
```

### boundsLeft(min, max)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以 X 坐标或百分比表示的左边界最小值
- **max** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以 X 坐标或百分比表示的左边界最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的左边界与指定的边界限制相符
- 关联控件属性: [ [boundsLeft](uiObjectType#m-boundsleft) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(108, 48 - 112, 160)
wB.bounds(); // Rect(108, 96 - 256, 1280)
wC.bounds(); // Rect(108, 112 - 1040, 1600)
```

`boundsLeft(100, 200)` 是一个控件矩形边界选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用绝对坐标值作为筛选条件.

`boundsLeft(0.05, 0.15)` 也是一个控件矩形边界选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕宽度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsLeft(0.05, 0.15), '@');
pickup({ boundsLeft: [ 0.05, 0.15 ] }, '@');
```

## [m#] boundsTop

### boundsTop(value)

**`6.2.0`** **`Global`**

- **value** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形上边界 Y 坐标或百分比
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的上边界与指定边界相符
- 关联控件属性: [ [boundsTop](uiObjectType#m-boundstop) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(10, 96 - 112, 160)
wB.bounds(); // Rect(30, 96 - 256, 1280)
wC.bounds(); // Rect(24, 96 - 1040, 1600)
```

`boundsTop(96)` 是一个控件矩形边界选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用绝对坐标值作为筛选条件.

`boundsTop(0.05)` 也是一个控件矩形边界选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕高度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsTop(0.1), '@');
pickup({ boundsTop: 0.1 }, '@');
```

### boundsTop(min, max)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以 Y 坐标或百分比表示的上边界最小值
- **max** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以 Y 坐标或百分比表示的上边界最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的上边界与指定的边界限制相符
- 关联控件属性: [ [boundsTop](uiObjectType#m-boundstop) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(10, 96 - 112, 160)
wB.bounds(); // Rect(30, 96 - 256, 1280)
wC.bounds(); // Rect(24, 96 - 1040, 1600)
```

`boundsTop(60, 120)` 是一个控件矩形边界选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用绝对坐标值作为筛选条件.

`boundsTop(0.02, 0.12)` 也是一个控件矩形边界选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕高度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsTop(0.02, 0.12), '@');
pickup({ boundsTop: [ 0.02, 0.12 ] }, '@');
```

## [m#] boundsRight

### boundsRight(value)

**`6.2.0`** **`Global`**

- **value** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形右边界 X 坐标或百分比
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的右边界与指定边界相符
- 关联控件属性: [ [boundsRight](uiObjectType#m-boundsright) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(18, 48 - 256, 160)
wB.bounds(); // Rect(50, 96 - 256, 1280)
wC.bounds(); // Rect(66, 112 - 256, 1600)
```

`boundsRight(256)` 是一个控件矩形边界选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用绝对坐标值作为筛选条件.

`boundsRight(0.237)` 也是一个控件矩形边界选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕宽度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsRight(0.237), '@');
pickup({ boundsRight: 0.237 }, '@');
```

### boundsRight(min, max)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以 X 坐标或百分比表示的右边界最小值
- **max** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以 X 坐标或百分比表示的右边界最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的右边界与指定的边界限制相符
- 关联控件属性: [ [boundsRight](uiObjectType#m-boundsright) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(18, 48 - 256, 160)
wB.bounds(); // Rect(50, 96 - 256, 1280)
wC.bounds(); // Rect(66, 112 - 256, 1600)
```

`boundsRight(210, 320)` 是一个控件矩形边界选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用绝对坐标值作为筛选条件.

`boundsRight(0.2, 0.25)` 也是一个控件矩形边界选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕宽度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsRight(0.2, 0.25), '@');
pickup({ boundsRight: [ 0.2, 0.25 ] }, '@');
```

## [m#] boundsBottom

### boundsBottom(value)

**`6.2.0`** **`Global`**

- **value** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形下边界 Y 坐标或百分比
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的下边界与指定边界相符
- 关联控件属性: [ [boundsBottom](uiObjectType#m-boundsbottom) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(10, 48 - 112, 1632)
wB.bounds(); // Rect(30, 96 - 256, 1632)
wC.bounds(); // Rect(24, 112 - 1040, 1632)
```

`boundsBottom(1632)` 是一个控件矩形边界选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用绝对坐标值作为筛选条件.

`boundsBottom(0.85)` 也是一个控件矩形边界选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕高度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsBottom(0.85), '@');
pickup({ boundsBottom: 0.85 }, '@');
```

### boundsBottom(min, max)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以 Y 坐标或百分比表示的下边界最小值
- **max** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以 Y 坐标或百分比表示的下边界最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的下边界与指定的边界限制相符
- 关联控件属性: [ [boundsBottom](uiObjectType#m-boundsbottom) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(10, 48 - 112, 1632)
wB.bounds(); // Rect(30, 96 - 256, 1632)
wC.bounds(); // Rect(24, 112 - 1040, 1632)
```

`boundsBottom(1600, -1)` 是一个控件矩形边界选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用绝对坐标值和屏幕高度代指值作为筛选条件.

`boundsBottom(0.8, 0.9)` 也是一个控件矩形边界选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕高度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsBottom(0.8, 0.9), '@');
pickup({ boundsBottom: [ 0.8, 0.9 ] }, '@');
```

## [m#] boundsWidth

### boundsWidth(value)

**`6.2.0`** **`Global`**

- **value** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形横向宽度或百分比度量
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的尺寸选择器.

- 筛选条件说明: 控件矩形的宽度与指定度量相符
- 关联控件属性: [ [boundsWidth](uiObjectType#m-boundswidth) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(18, 48 - 256, 160)
wA.boundsWidth(); // 238
wB.bounds(); // Rect(50, 96 - 256, 1280)
wB.boundsWidth(); // 206
wC.bounds(); // Rect(66, 112 - 256, 1600)
wC.boundsWidth(); // 190
```

`boundsWidth(206)` 是一个控件矩形尺寸选择器, 可以匹配控件 `wB`, 它使用宽度值作为筛选条件.

`boundsWidth(0.191)` 也是一个控件矩形尺寸选择器, 可能会匹配控件 `wB`, 它使用屏幕宽度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsWidth(206), '@');
pickup({ boundsWidth: 206 }, '@');
```

### boundsWidth(min, max)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形横向宽度或百分比度量的最小值
- **max** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形横向宽度或百分比度量的最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的尺寸选择器.

- 筛选条件说明: 控件矩形的宽度与指定的度量限制相符
- 关联控件属性: [ [boundsWidth](uiObjectType#m-boundswidth) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(18, 48 - 256, 160)
wA.boundsWidth(); // 238
wB.bounds(); // Rect(50, 96 - 256, 1280)
wB.boundsWidth(); // 206
wC.bounds(); // Rect(66, 112 - 256, 1600)
wC.boundsWidth(); // 190
```

`boundsWidth(150, 300)` 是一个控件矩形尺寸选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用宽度值作为筛选条件.

`boundsWidth(0.139, 0.278)` 也是一个控件矩形尺寸选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕宽度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsWidth(0.139, 0.278), '@');
pickup({ boundsWidth: [ 0.139, 0.278 ] }, '@');
```

## [m#] boundsHeight

### boundsHeight(value)

**`6.2.0`** **`Global`**

- **value** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形纵向高度或百分比度量
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的尺寸选择器.

- 筛选条件说明: 控件矩形的高度与指定度量相符
- 关联控件属性: [ [boundsHeight](uiObjectType#m-boundsheight) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(10, 48 - 112, 1632)
wA.boundsHeight(); // 1584
wB.bounds(); // Rect(30, 96 - 256, 1632)
wB.boundsHeight(); // 1536
wC.bounds(); // Rect(24, 112 - 1040, 1632)
wC.boundsHeight(); // 1520
```

`boundsHeight(1536)` 是一个控件矩形尺寸选择器, 可以匹配控件 `wB`, 它使用高度值作为筛选条件.

`boundsHeight(0.8)` 也是一个控件矩形尺寸选择器, 可能会匹配控件 `wB`, 它使用屏幕高度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsHeight(0.8), '@');
pickup({ boundsHeight: 0.8 }, '@');
```

### boundsHeight(min, max)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形纵向高度或百分比度量的最小值
- **max** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形纵向高度或百分比度量的最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的高度与指定的度量限制相符
- 关联控件属性: [ [boundsHeight](uiObjectType#m-boundsheight) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(10, 48 - 112, 1632)
wA.boundsHeight(); // 1584
wB.bounds(); // Rect(30, 96 - 256, 1632)
wB.boundsHeight(); // 1536
wC.bounds(); // Rect(24, 112 - 1040, 1632)
wC.boundsHeight(); // 1520
```

`boundsHeight(1500, -1)` 是一个控件矩形尺寸选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用高度值和屏幕高度代指值作为筛选条件.

`boundsHeight(0.781, 0.982)` 也是一个控件矩形尺寸选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕高度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsHeight(0.781, 0.982), '@');
pickup({ boundsHeight: [ 0.781, 0.982 ] }, '@');
```

## [m#] boundsCenterX

### boundsCenterX(value)

**`6.2.0`** **`Global`**

- **value** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形中心点 X 坐标或百分比
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的中心点选择器.

- 筛选条件说明: 控件矩形中心点 X 坐标与指定的坐标相符
- 关联控件属性: [ [boundsCenterX](uiObjectType#m-boundscenterx) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(18, 48 - 256, 160)
wA.boundsCenterX(); // 137
wB.bounds(); // Rect(50, 96 - 256, 1280)
wB.boundsCenterX(); // 153
wC.bounds(); // Rect(66, 112 - 256, 1600)
wC.boundsCenterX(); // 161
```

`boundsCenterX(153)` 是一个控件矩形中心点选择器, 可以匹配控件 `wB`, 它使用坐标值作为筛选条件.

`boundsCenterX(0.142)` 也是一个控件矩形中心点选择器, 可能会匹配控件 `wB`, 它使用屏幕宽度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsCenterX(0.142), '@');
pickup({ boundsCenterX: 0.142 }, '@');
```

### boundsCenterX(min, max)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以坐标值或百分比表示的中心点 X 坐标最小值
- **max** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以坐标值或百分比表示的中心点 X 坐标最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的中心点选择器.

- 筛选条件说明:控件矩形中心点 X 坐标与指定的坐标限制相符
- 关联控件属性: [ [boundsCenterX](uiObjectType#m-boundscenterx) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(18, 48 - 256, 160)
wA.boundsCenterX(); // 137
wB.bounds(); // Rect(50, 96 - 256, 1280)
wB.boundsCenterX(); // 153
wC.bounds(); // Rect(66, 112 - 256, 1600)
wC.boundsCenterX(); // 161
```

`boundsCenterX(120, 240)` 是一个控件矩形中心点选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用坐标值作为筛选条件.

`boundsCenterX(0.111, 0.222)` 也是一个控件矩形中心点选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕宽度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsCenterX(0.111, 0.222), '@');
pickup({ boundsCenterX: [ 0.111, 0.222 ] }, '@');
```

## [m#] boundsCenterY

### boundsCenterY(value)

**`6.2.0`** **`Global`**

- **value** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形中心点 Y 坐标或百分比
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的中心点选择器.

- 筛选条件说明: 控件矩形中心点 Y 坐标与指定的坐标相符
- 关联控件属性: [ [boundsCenterY](uiObjectType#m-boundscentery) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(10, 48 - 112, 1632)
wA.boundsCenterY(); // 840
wB.bounds(); // Rect(30, 96 - 256, 1632)
wB.boundsCenterY(); // 864
wC.bounds(); // Rect(24, 112 - 1040, 1632)
wC.boundsCenterY(); // 872
```

`boundsCenterY(864)` 是一个控件矩形中心点选择器, 可以匹配控件 `wB`, 它使用坐标值作为筛选条件.

`boundsCenterY(0.45)` 也是一个控件矩形中心点选择器, 可能会匹配控件 `wB`, 它使用屏幕高度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsCenterY(0.45), '@');
pickup({ boundsCenterY: 0.45 }, '@');
```

### boundsCenterY(min, max)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以坐标值或百分比表示的中心点 Y 坐标最小值
- **max** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以坐标值或百分比表示的中心点 Y 坐标最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形中心点 Y 坐标与指定的坐标限制相符
- 关联控件属性: [ [boundsCenterY](uiObjectType#m-boundscentery) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(10, 48 - 112, 1632)
wA.boundsCenterY(); // 840
wB.bounds(); // Rect(30, 96 - 256, 1632)
wB.boundsCenterY(); // 864
wC.bounds(); // Rect(24, 112 - 1040, 1632)
wC.boundsCenterY(); // 872
```

`boundsCenterY(800, 900)` 是一个控件矩形中心点选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用坐标值作为筛选条件.

`boundsCenterY(0.417, 0.469)` 也是一个控件矩形中心点选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕高度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsCenterY(0.417, 0.469), '@');
pickup({ boundsCenterY: [ 0.417, 0.469 ] }, '@');
```

## [m#] boundsMinLeft

### boundsMinLeft(min)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以 X 坐标或百分比表示的左边界最小值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的左边界与指定的边界限制相符
- 关联控件属性: [ [boundsLeft](uiObjectType#m-boundsleft) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(108, 48 - 112, 160)
wB.bounds(); // Rect(108, 96 - 256, 1280)
wC.bounds(); // Rect(108, 112 - 1040, 1600)
```

`boundsMinLeft(100)` 是一个控件矩形边界选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用绝对坐标值作为筛选条件.

`boundsMinLeft(0.05)` 也是一个控件矩形边界选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕宽度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsMinLeft(0.05), '@');
pickup({ boundsMinLeft: 0.05 }, '@');
```

## [m#] boundsMinTop

### boundsMinTop(min)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以 Y 坐标或百分比表示的上边界最小值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的上边界与指定的边界限制相符
- 关联控件属性: [ [boundsTop](uiObjectType#m-boundstop) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(10, 96 - 112, 160)
wB.bounds(); // Rect(30, 96 - 256, 1280)
wC.bounds(); // Rect(24, 96 - 1040, 1600)
```

`boundsMinTop(60)` 是一个控件矩形边界选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用绝对坐标值作为筛选条件.

`boundsMinTop(0.02)` 也是一个控件矩形边界选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕高度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsMinTop(0.02), '@');
pickup({ boundsMinTop: 0.02 }, '@');
```

## [m#] boundsMinRight

### boundsMinRight(min)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以 X 坐标或百分比表示的右边界最小值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的右边界与指定的边界限制相符
- 关联控件属性: [ [boundsRight](uiObjectType#m-boundsright) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(18, 48 - 256, 160)
wB.bounds(); // Rect(50, 96 - 256, 1280)
wC.bounds(); // Rect(66, 112 - 256, 1600)
```

`boundsMinRight(210)` 是一个控件矩形边界选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用绝对坐标值作为筛选条件.

`boundsMinRight(0.2)` 也是一个控件矩形边界选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕宽度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsMinRight(0.2), '@');
pickup({ boundsMinRight: 0.2 }, '@');
```

## [m#] boundsMinBottom

### boundsMinBottom(min)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以 Y 坐标或百分比表示的下边界最小值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的下边界与指定的边界限制相符
- 关联控件属性: [ [boundsBottom](uiObjectType#m-boundsbottom) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(10, 48 - 112, 1632)
wB.bounds(); // Rect(30, 96 - 256, 1632)
wC.bounds(); // Rect(24, 112 - 1040, 1632)
```

`boundsMinBottom(1600)` 是一个控件矩形边界选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用绝对坐标值作为筛选条件.

`boundsMinBottom(0.8)` 也是一个控件矩形边界选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕高度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsMinBottom(0.8), '@');
pickup({ boundsMinBottom: 0.8 }, '@');
```

## [m#] boundsMinWidth

### boundsMinWidth(min)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形横向宽度或百分比度量的最小值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的尺寸选择器.

- 筛选条件说明: 控件矩形的宽度与指定的度量限制相符
- 关联控件属性: [ [boundsWidth](uiObjectType#m-boundswidth) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(18, 48 - 256, 160)
wA.boundsMinWidth(); // 238
wB.bounds(); // Rect(50, 96 - 256, 1280)
wB.boundsMinWidth(); // 206
wC.bounds(); // Rect(66, 112 - 256, 1600)
wC.boundsMinWidth(); // 190
```

`boundsMinWidth(150)` 是一个控件矩形尺寸选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用宽度值作为筛选条件.

`boundsMinWidth(0.139)` 也是一个控件矩形尺寸选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕宽度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsMinWidth(0.139), '@');
pickup({ boundsMinWidth: 0.139 }, '@');
```

## [m#] boundsMinHeight

### boundsMinHeight(min)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形纵向高度或百分比度量的最小值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的高度与指定的度量限制相符
- 关联控件属性: [ [boundsHeight](uiObjectType#m-boundsheight) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(10, 48 - 112, 1632)
wA.boundsMinHeight(); // 1584
wB.bounds(); // Rect(30, 96 - 256, 1632)
wB.boundsMinHeight(); // 1536
wC.bounds(); // Rect(24, 112 - 1040, 1632)
wC.boundsMinHeight(); // 1520
```

`boundsMinHeight(1500)` 是一个控件矩形尺寸选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用高度值作为筛选条件.

`boundsMinHeight(0.781)` 也是一个控件矩形尺寸选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕高度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsMinHeight(0.781), '@');
pickup({ boundsMinHeight: 0.781 }, '@');
```

## [m#] boundsMinCenterX

### boundsMinCenterX(min)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以坐标值或百分比表示的中心点 X 坐标最小值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的中心点选择器.

- 筛选条件说明:控件矩形中心点 X 坐标与指定的坐标限制相符
- 关联控件属性: [ [boundsCenterX](uiObjectType#m-boundscenterx) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(18, 48 - 256, 160)
wA.boundsMinCenterX(); // 137
wB.bounds(); // Rect(50, 96 - 256, 1280)
wB.boundsMinCenterX(); // 153
wC.bounds(); // Rect(66, 112 - 256, 1600)
wC.boundsMinCenterX(); // 161
```

`boundsMinCenterX(120)` 是一个控件矩形中心点选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用坐标值作为筛选条件.

`boundsMinCenterX(0.111)` 也是一个控件矩形中心点选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕宽度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsMinCenterX(0.111), '@');
pickup({ boundsMinCenterX: 0.111 }, '@');
```

## [m#] boundsMinCenterY

### boundsMinCenterY(min)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以坐标值或百分比表示的中心点 Y 坐标最小值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形中心点 Y 坐标与指定的坐标限制相符
- 关联控件属性: [ [boundsCenterY](uiObjectType#m-boundscentery) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(10, 48 - 112, 1632)
wA.boundsMinCenterY(); // 840
wB.bounds(); // Rect(30, 96 - 256, 1632)
wB.boundsMinCenterY(); // 864
wC.bounds(); // Rect(24, 112 - 1040, 1632)
wC.boundsMinCenterY(); // 872
```

`boundsMinCenterY(800)` 是一个控件矩形中心点选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用坐标值作为筛选条件.

`boundsMinCenterY(0.417)` 也是一个控件矩形中心点选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕高度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsMinCenterY(0.417), '@');
pickup({ boundsMinCenterY: 0.417 }, '@');
```

## [m#] boundsMaxLeft

### boundsMaxLeft(max)

**`6.2.0`** **`Global`**

- **max** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以 X 坐标或百分比表示的左边界最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的左边界与指定的边界限制相符
- 关联控件属性: [ [boundsLeft](uiObjectType#m-boundsleft) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(108, 48 - 112, 160)
wB.bounds(); // Rect(108, 96 - 256, 1280)
wC.bounds(); // Rect(108, 112 - 1040, 1600)
```

`boundsMaxLeft(200)` 是一个控件矩形边界选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用绝对坐标值作为筛选条件.

`boundsMaxLeft(0.15)` 也是一个控件矩形边界选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕宽度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsMaxLeft(0.15), '@');
pickup({ boundsMaxLeft: 0.15 }, '@');
```

## [m#] boundsMaxTop

### boundsMaxTop(max)

**`6.2.0`** **`Global`**

- **max** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以 Y 坐标或百分比表示的上边界最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的上边界与指定的边界限制相符
- 关联控件属性: [ [boundsTop](uiObjectType#m-boundstop) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(10, 96 - 112, 160)
wB.bounds(); // Rect(30, 96 - 256, 1280)
wC.bounds(); // Rect(24, 96 - 1040, 1600)
```

`boundsMaxTop(120)` 是一个控件矩形边界选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用绝对坐标值作为筛选条件.

`boundsMaxTop(0.12)` 也是一个控件矩形边界选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕高度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsMaxTop(0.12), '@');
pickup({ boundsMaxTop: 0.12 }, '@');
```

## [m#] boundsMaxRight

### boundsMaxRight(max)

**`6.2.0`** **`Global`**

- **max** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以 X 坐标或百分比表示的右边界最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的右边界与指定的边界限制相符
- 关联控件属性: [ [boundsRight](uiObjectType#m-boundsright) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(18, 48 - 256, 160)
wB.bounds(); // Rect(50, 96 - 256, 1280)
wC.bounds(); // Rect(66, 112 - 256, 1600)
```

`boundsMaxRight(320)` 是一个控件矩形边界选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用绝对坐标值作为筛选条件.

`boundsMaxRight(0.25)` 也是一个控件矩形边界选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕宽度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsMaxRight(0.25), '@');
pickup({ boundsMaxRight: 0.25 }, '@');
```

## [m#] boundsMaxBottom

### boundsMaxBottom(max)

**`6.2.0`** **`Global`**

- **max** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以 Y 坐标或百分比表示的下边界最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的下边界与指定的边界限制相符
- 关联控件属性: [ [boundsBottom](uiObjectType#m-boundsbottom) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(10, 48 - 112, 1632)
wB.bounds(); // Rect(30, 96 - 256, 1632)
wC.bounds(); // Rect(24, 112 - 1040, 1632)
```

`boundsMaxBottom(-1)` 是一个控件矩形边界选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕高度代指值作为筛选条件.

`boundsMaxBottom(0.9)` 也是一个控件矩形边界选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕高度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsMaxBottom(0.9), '@');
pickup({ boundsMaxBottom: 0.9 }, '@');
```

## [m#] boundsMaxWidth

### boundsMaxWidth(max)

**`6.2.0`** **`Global`**

- **max** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形横向宽度或百分比度量的最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的尺寸选择器.

- 筛选条件说明: 控件矩形的宽度与指定的度量限制相符
- 关联控件属性: [ [boundsWidth](uiObjectType#m-boundswidth) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(18, 48 - 256, 160)
wA.boundsMaxWidth(); // 238
wB.bounds(); // Rect(50, 96 - 256, 1280)
wB.boundsMaxWidth(); // 206
wC.bounds(); // Rect(66, 112 - 256, 1600)
wC.boundsMaxWidth(); // 190
```

`boundsMaxWidth(300)` 是一个控件矩形尺寸选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用宽度值作为筛选条件.

`boundsMaxWidth(0.278)` 也是一个控件矩形尺寸选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕宽度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsMaxWidth(0.278), '@');
pickup({ boundsMaxWidth: 0.278 }, '@');
```

## [m#] boundsMaxHeight

### boundsMaxHeight(max)

**`6.2.0`** **`Global`**

- **max** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形纵向高度或百分比度量的最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的高度与指定的度量限制相符
- 关联控件属性: [ [boundsHeight](uiObjectType#m-boundsheight) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(10, 48 - 112, 1632)
wA.boundsMaxHeight(); // 1584
wB.bounds(); // Rect(30, 96 - 256, 1632)
wB.boundsMaxHeight(); // 1536
wC.bounds(); // Rect(24, 112 - 1040, 1632)
wC.boundsMaxHeight(); // 1520
```

`boundsMaxHeight(-1)` 是一个控件矩形尺寸选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕高度代指值作为筛选条件.

`boundsMaxHeight(0.982)` 也是一个控件矩形尺寸选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕高度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsMaxHeight(0.982), '@');
pickup({ boundsMaxHeight: 0.982 }, '@');
```

## [m#] boundsMaxCenterX

### boundsMaxCenterX(max)

**`6.2.0`** **`Global`**

- **max** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以坐标值或百分比表示的中心点 X 坐标最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的中心点选择器.

- 筛选条件说明:控件矩形中心点 X 坐标与指定的坐标限制相符
- 关联控件属性: [ [boundsCenterX](uiObjectType#m-boundscenterx) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(18, 48 - 256, 160)
wA.boundsMaxCenterX(); // 137
wB.bounds(); // Rect(50, 96 - 256, 1280)
wB.boundsMaxCenterX(); // 153
wC.bounds(); // Rect(66, 112 - 256, 1600)
wC.boundsMaxCenterX(); // 161
```

`boundsMaxCenterX(240)` 是一个控件矩形中心点选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用坐标值作为筛选条件.

`boundsMaxCenterX(0.222)` 也是一个控件矩形中心点选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕宽度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsMaxCenterX(0.222), '@');
pickup({ boundsMaxCenterX: 0.222 }, '@');
```

## [m#] boundsMaxCenterY

### boundsMaxCenterY(max)

**`6.2.0`** **`Global`**

- **max** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以坐标值或百分比表示的中心点 Y 坐标最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形中心点 Y 坐标与指定的坐标限制相符
- 关联控件属性: [ [boundsCenterY](uiObjectType#m-boundscentery) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
wA.bounds(); // Rect(10, 48 - 112, 1632)
wA.boundsMaxCenterY(); // 840
wB.bounds(); // Rect(30, 96 - 256, 1632)
wB.boundsMaxCenterY(); // 864
wC.bounds(); // Rect(24, 112 - 1040, 1632)
wC.boundsMaxCenterY(); // 872
```

`boundsMaxCenterY(900)` 是一个控件矩形中心点选择器, 可以匹配控件 `wA`, `wB` 和 `wC`, 它使用坐标值作为筛选条件.

`boundsMaxCenterY(0.469)` 也是一个控件矩形中心点选择器, 可能会匹配控件 `wA`, `wB` 和 `wC`, 它使用屏幕高度百分比作为筛选条件.

百分比参数转换为像素值坐标进行筛选时, 若数值为整数, 则直接筛选, 若非整数, 将对数值做四舍五入处理.

[拾取选择器](#m-pickup) 示例:

```js
pickup(boundsMaxCenterY(0.469), '@');
pickup({ boundsMaxCenterY: 0.469 }, '@');
```

## [m#] left

### left(value)

**`6.2.0`** **`Global`**

- **value** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形左边界 X 坐标或百分比
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的左边界与指定边界相符
- 关联控件属性: [ [boundsLeft](uiObjectType#m-boundsleft) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsLeft](#boundsleftvalue) 的别名方法.

### left(min, max)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以 X 坐标或百分比表示的左边界最小值
- **max** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以 X 坐标或百分比表示的左边界最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的左边界与指定的边界限制相符
- 关联控件属性: [ [boundsLeft](uiObjectType#m-boundsleft) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsLeft](#boundsleftmin-max) 的别名方法.

## [m#] top

### top(value)

**`6.2.0`** **`Global`**

- **value** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形上边界 Y 坐标或百分比
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的上边界与指定边界相符
- 关联控件属性: [ [boundsTop](uiObjectType#m-boundstop) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsTop](#boundstopvalue) 的别名方法.

### top(min, max)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以 Y 坐标或百分比表示的上边界最小值
- **max** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以 Y 坐标或百分比表示的上边界最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的上边界与指定的边界限制相符
- 关联控件属性: [ [boundsTop](uiObjectType#m-boundstop) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsTop](#boundstopmin-max) 的别名方法.

## [m#] right

### right(value)

**`6.2.0`** **`Global`**

- **value** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形右边界 X 坐标或百分比
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的右边界与指定边界相符
- 关联控件属性: [ [boundsRight](uiObjectType#m-boundsright) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsRight](#boundsrightvalue) 的别名方法.

### right(min, max)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以 X 坐标或百分比表示的右边界最小值
- **max** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以 X 坐标或百分比表示的右边界最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的右边界与指定的边界限制相符
- 关联控件属性: [ [boundsRight](uiObjectType#m-boundsright) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsRight](#boundsrightmin-max) 的别名方法.

## [m#] bottom

### bottom(value)

**`6.2.0`** **`Global`**

- **value** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形下边界 Y 坐标或百分比
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的下边界与指定边界相符
- 关联控件属性: [ [boundsBottom](uiObjectType#m-boundsbottom) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsBottom](#boundsbottomvalue) 的别名方法.

### bottom(min, max)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以 Y 坐标或百分比表示的下边界最小值
- **max** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以 Y 坐标或百分比表示的下边界最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的下边界与指定的边界限制相符
- 关联控件属性: [ [boundsBottom](uiObjectType#m-boundsbottom) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsBottom](#boundsbottommin-max) 的别名方法.

## [m#] width

### width(value)

**`6.2.0`** **`Global`**

- **value** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形横向宽度或百分比度量
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的尺寸选择器.

- 筛选条件说明: 控件矩形的宽度与指定度量相符
- 关联控件属性: [ [boundsWidth](uiObjectType#m-boundswidth) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsWidth](#boundswidthvalue) 的别名方法.

### width(min, max)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形横向宽度或百分比度量的最小值
- **max** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形横向宽度或百分比度量的最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的尺寸选择器.

- 筛选条件说明: 控件矩形的宽度与指定的度量限制相符
- 关联控件属性: [ [boundsWidth](uiObjectType#m-boundswidth) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsWidth](#boundswidthmin-max) 的别名方法.

## [m#] height

### height(value)

**`6.2.0`** **`Global`**

- **value** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形纵向高度或百分比度量
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的尺寸选择器.

- 筛选条件说明: 控件矩形的高度与指定度量相符
- 关联控件属性: [ [boundsHeight](uiObjectType#m-boundsheight) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsHeight](#boundsheightvalue) 的别名方法.

### height(min, max)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形纵向高度或百分比度量的最小值
- **max** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形纵向高度或百分比度量的最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的高度与指定的度量限制相符
- 关联控件属性: [ [boundsHeight](uiObjectType#m-boundsheight) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsHeight](#boundsheightmin-max) 的别名方法.

## [m#] centerX

### centerX(value)

**`6.2.0`** **`Global`**

- **value** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形中心点 X 坐标或百分比
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的中心点选择器.

- 筛选条件说明: 控件矩形中心点 X 坐标与指定的坐标相符
- 关联控件属性: [ [boundsCenterX](uiObjectType#m-boundscenterx) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsCenterX](#boundscenterxvalue) 的别名方法.

### centerX(min, max)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以坐标值或百分比表示的中心点 X 坐标最小值
- **max** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以坐标值或百分比表示的中心点 X 坐标最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的中心点选择器.

- 筛选条件说明:控件矩形中心点 X 坐标与指定的坐标限制相符
- 关联控件属性: [ [boundsCenterX](uiObjectType#m-boundscenterx) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsCenterX](#boundscenterxmin-max) 的别名方法.

## [m#] centerY

### centerY(value)

**`6.2.0`** **`Global`**

- **value** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形中心点 Y 坐标或百分比
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的中心点选择器.

- 筛选条件说明: 控件矩形中心点 Y 坐标与指定的坐标相符
- 关联控件属性: [ [boundsCenterY](uiObjectType#m-boundscentery) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsCenterY](#boundscenteryvalue) 的别名方法.

### centerY(min, max)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以坐标值或百分比表示的中心点 Y 坐标最小值
- **max** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以坐标值或百分比表示的中心点 Y 坐标最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形中心点 Y 坐标与指定的坐标限制相符
- 关联控件属性: [ [boundsCenterY](uiObjectType#m-boundscentery) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsCenterY](#boundscenterymin-max) 的别名方法.

## [m#] minLeft

### minLeft(min)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以 X 坐标或百分比表示的左边界最小值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的左边界与指定的边界限制相符
- 关联控件属性: [ [boundsLeft](uiObjectType#m-boundsleft) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsMinLeft](#boundsminleftmin) 的别名方法.

## [m#] minTop

### minTop(min)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以 Y 坐标或百分比表示的上边界最小值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的上边界与指定的边界限制相符
- 关联控件属性: [ [boundsTop](uiObjectType#m-boundstop) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsMinTop](#boundsmintopmin) 的别名方法.

## [m#] minRight

### minRight(min)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以 X 坐标或百分比表示的右边界最小值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的右边界与指定的边界限制相符
- 关联控件属性: [ [boundsRight](uiObjectType#m-boundsright) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsMinRight](#boundsminrightmin) 的别名方法.

## [m#] minBottom

### minBottom(min)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以 Y 坐标或百分比表示的下边界最小值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的下边界与指定的边界限制相符
- 关联控件属性: [ [boundsBottom](uiObjectType#m-boundsbottom) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsMinBottom](#boundsminbottommin) 的别名方法.

## [m#] minWidth

### minWidth(min)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形横向宽度或百分比度量的最小值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的尺寸选择器.

- 筛选条件说明: 控件矩形的宽度与指定的度量限制相符
- 关联控件属性: [ [boundsWidth](uiObjectType#m-boundswidth) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsMinWidth](#boundsminwidthmin) 的别名方法.

## [m#] minHeight

### minHeight(min)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形纵向高度或百分比度量的最小值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的高度与指定的度量限制相符
- 关联控件属性: [ [boundsHeight](uiObjectType#m-boundsheight) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsMinHeight](#boundsminheightmin) 的别名方法.

## [m#] minCenterX

### minCenterX(min)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以坐标值或百分比表示的中心点 X 坐标最小值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的中心点选择器.

- 筛选条件说明:控件矩形中心点 X 坐标与指定的坐标限制相符
- 关联控件属性: [ [boundsCenterX](uiObjectType#m-boundscenterx) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsMinCenterX](#boundsmincenterxmin) 的别名方法.

## [m#] minCenterY

### minCenterY(min)

**`6.2.0`** **`Global`**

- **min** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以坐标值或百分比表示的中心点 Y 坐标最小值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形中心点 Y 坐标与指定的坐标限制相符
- 关联控件属性: [ [boundsCenterY](uiObjectType#m-boundscentery) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsMinCenterY](#boundsmincenterymin) 的别名方法.

## [m#] maxLeft

### maxLeft(max)

**`6.2.0`** **`Global`**

- **max** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以 X 坐标或百分比表示的左边界最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的左边界与指定的边界限制相符
- 关联控件属性: [ [boundsLeft](uiObjectType#m-boundsleft) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsMaxLeft](#boundsmaxleftmax) 的别名方法.

## [m#] maxTop

### maxTop(max)

**`6.2.0`** **`Global`**

- **max** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以 Y 坐标或百分比表示的上边界最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的上边界与指定的边界限制相符
- 关联控件属性: [ [boundsTop](uiObjectType#m-boundstop) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsMaxTop](#boundsmaxtopmax) 的别名方法.

## [m#] maxRight

### maxRight(max)

**`6.2.0`** **`Global`**

- **max** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以 X 坐标或百分比表示的右边界最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的右边界与指定的边界限制相符
- 关联控件属性: [ [boundsRight](uiObjectType#m-boundsright) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsMaxRight](#boundsmaxrightmax) 的别名方法.

## [m#] maxBottom

### maxBottom(max)

**`6.2.0`** **`Global`**

- **max** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以 Y 坐标或百分比表示的下边界最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的下边界与指定的边界限制相符
- 关联控件属性: [ [boundsBottom](uiObjectType#m-boundsbottom) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsMaxBottom](#boundsmaxbottommax) 的别名方法.

## [m#] maxWidth

### maxWidth(max)

**`6.2.0`** **`Global`**

- **max** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形横向宽度或百分比度量的最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的尺寸选择器.

- 筛选条件说明: 控件矩形的宽度与指定的度量限制相符
- 关联控件属性: [ [boundsWidth](uiObjectType#m-boundswidth) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsMaxWidth](#boundsmaxwidthmax) 的别名方法.

## [m#] maxHeight

### maxHeight(max)

**`6.2.0`** **`Global`**

- **max** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形纵向高度或百分比度量的最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形的高度与指定的度量限制相符
- 关联控件属性: [ [boundsHeight](uiObjectType#m-boundsheight) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsMaxHeight](#boundsmaxheightmax) 的别名方法.

## [m#] maxCenterX

### maxCenterX(max)

**`6.2.0`** **`Global`**

- **max** { [ScreenMetricNumberX](dataTypes#screenmetricnumberx) } - 矩形以坐标值或百分比表示的中心点 X 坐标最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的中心点选择器.

- 筛选条件说明:控件矩形中心点 X 坐标与指定的坐标限制相符
- 关联控件属性: [ [boundsCenterX](uiObjectType#m-boundscenterx) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsMaxCenterX](#boundsmaxcenterxmax) 的别名方法.

## [m#] maxCenterY

### maxCenterY(max)

**`6.2.0`** **`Global`**

- **max** { [ScreenMetricNumberY](dataTypes#screenmetricnumbery) } - 矩形以坐标值或百分比表示的中心点 Y 坐标最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的边界选择器.

- 筛选条件说明: 控件矩形中心点 Y 坐标与指定的坐标限制相符
- 关联控件属性: [ [boundsCenterY](uiObjectType#m-boundscentery) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#boundsMaxCenterY](#boundsmaxcenterymax) 的别名方法.

## [m#] screenCenterX

### screenCenterX(b, tolerance)

**`6.2.0`** **`Global`**

- **b** { [boolean](dataTypes#boolean) } - X 坐标是否居中
- **tolerance** { [number](dataTypes#number) } - 居中误差容限
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的中心点选择器.

- 筛选条件说明: 控件矩形中心点 X 坐标与屏幕中点 X 坐标的差值是否在误差容限内的情况与指定参数 (b) 相符
- 关联控件属性: [ [boundsCenterX](uiObjectType#m-boundscenterx) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
device.width; // 1080

wA.bounds(); // Rect(520, 48 - 560, 160)
wA.boundsCenterX(); // 540
Math.abs(wA.boundsCenterX() - device.width / 2) / device.width; // 0

wB.bounds(); // Rect(50, 96 - 1040, 1280)
wB.boundsCenterX(); // 545
Math.abs(wB.boundsCenterX() - device.width / 2) / device.width; /* 约为 0.005 . */

wC.bounds(); // Rect(66, 112 - 256, 1600)
wC.boundsCenterX(); // 161
Math.abs(wC.boundsCenterX() - device.width / 2) / device.width; /* 约为 0.351 . */
```

`screenCenterX(true, 0)` 是一个控件矩形中心点选择器, 可以匹配控件 `wA`, 参数 `0` 表示严格横向居中, 不允许丝毫误差, `true` 表示正常筛选, 如果为 `false`, 表示反向筛选, 即筛选不满足严格横向居中的控件.

`screenCenterX(true, 0.1)` 也是一个控件矩形中心点选择器, 可以匹配控件 `wA` 和 `wB`, 因为 `wA` 是严格横向居中的, `wB` 的居中误差约为 `0.005`, 小于指定的 `0.1`, `wC` 的居中误差过大, 因此未能被筛选.

[拾取选择器](#m-pickup) 示例:

```js
pickup(screenCenterX(0.1), '@');
pickup({ screenCenterX: 0.1 }, '@');
```

### screenCenterX(b)

**`6.2.0`** **`Global`**

- **b** { [boolean](dataTypes#boolean) } - X 坐标是否居中
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的中心点选择器.

- 筛选条件说明: 控件矩形中心点 X 坐标与屏幕中点 X 坐标的差值是否在误差容限内的情况与指定参数 (b) 相符
- 关联控件属性: [ [boundsCenterX](uiObjectType#m-boundscenterx) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#screenCenterX](#screencenterx)(`b`, `0.016`) 的重载方法.

### screenCenterX(tolerance)

**`6.2.0`** **`Global`**

- **tolerance** { [number](dataTypes#number) } - 居中误差容限
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的中心点选择器.

- 筛选条件说明: 控件矩形中心点 X 坐标与屏幕中点 X 坐标的差值在误差容限内
- 关联控件属性: [ [boundsCenterX](uiObjectType#m-boundscenterx) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#screenCenterX](#screencenterx)(`true`, `tolerance`) 的重载方法.

### screenCenterX()

**`6.2.0`** **`Global`**

- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的中心点选择器.

- 筛选条件说明: 控件矩形中心点 X 坐标与屏幕中点 X 坐标的差值不大于 0.016
- 关联控件属性: [ [boundsCenterX](uiObjectType#m-boundscenterx) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#screenCenterX](#screencenterx)(`true`, `0.016`) 的重载方法.

## [m#] screenCenterY

### screenCenterY(b, tolerance)

**`6.2.0`** **`Global`**

- **b** { [boolean](dataTypes#boolean) } - Y 坐标是否居中
- **tolerance** { [number](dataTypes#number) } - 居中误差容限
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的中心点选择器.

- 筛选条件说明: 控件矩形中心点 Y 坐标与屏幕中点 Y 坐标的差值是否在误差容限内的情况与指定参数 (b) 相符
- 关联控件属性: [ [boundsCenterY](uiObjectType#m-boundscentery) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 3 个控件:

```js
device.height; // 1920

wA.bounds(); // Rect(10, 48 - 260, 1872)
wA.boundsCenterY(); // 960
Math.abs(wA.boundsCenterY() - device.width / 2) / device.width; // 0

wB.bounds(); // Rect(150, 96 - 1020, 1820)
wB.boundsCenterY(); // 958
Math.abs(wB.boundsCenterY() - device.width / 2) / device.width; /* 约为 0.001 . */

wC.bounds(); // Rect(266, 1400 - 356, 1600)
wC.boundsCenterY(); // 1500
Math.abs(wC.boundsCenterY() - device.width / 2) / device.width; /* 约为 0.281 . */
```

`screenCenterY(true, 0)` 是一个控件矩形中心点选择器, 可以匹配控件 `wA`, 参数 `0` 表示严格纵向居中, 不允许丝毫误差, `true` 表示正常筛选, 如果为 `false`, 表示反向筛选, 即筛选不满足严格纵向居中的控件.

`screenCenterY(true, 0.1)` 也是一个控件矩形中心点选择器, 可以匹配控件 `wA` 和 `wB`, 因为 `wA` 是严格纵向居中的, `wB` 的居中误差约为 `0.001`, 小于指定的 `0.1`, `wC` 的居中误差过大, 因此未能被筛选.

[拾取选择器](#m-pickup) 示例:

```js
pickup(screenCenterY(0.1), '@');
pickup({ screenCenterY: 0.1 }, '@');
```

### screenCenterY(b)

**`6.2.0`** **`Global`**

- **b** { [boolean](dataTypes#boolean) } - Y 坐标是否居中
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的中心点选择器.

- 筛选条件说明: 控件矩形中心点 Y 坐标与屏幕中点 Y 坐标的差值是否在误差容限内的情况与指定参数 (b) 相符
- 关联控件属性: [ [boundsCenterY](uiObjectType#m-boundscentery) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#screenCenterY](#screencentery)(`b`, `0.016`) 的重载方法.

### screenCenterY(tolerance)

**`6.2.0`** **`Global`**

- **tolerance** { [number](dataTypes#number) } - 居中误差容限
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的中心点选择器.

- 筛选条件说明: 控件矩形中心点 Y 坐标与屏幕中点 Y 坐标的差值在误差容限内
- 关联控件属性: [ [boundsCenterY](uiObjectType#m-boundscentery) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#screenCenterY](#screencentery)(`true`, `tolerance`) 的重载方法.

### screenCenterY()

**`6.2.0`** **`Global`**

- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的中心点选择器.

- 筛选条件说明: 控件矩形中心点 Y 坐标与屏幕中点 Y 坐标的差值不大于 0.016
- 关联控件属性: [ [boundsCenterY](uiObjectType#m-boundscentery) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#screenCenterY](#screencentery)(`true`, `0.016`) 的重载方法.

## [m#] screenCoverage

### screenCoverage(min)

**`6.2.0`** **`Global`**

- **min** { [number](dataTypes#number) } - 矩形可视化部分的空间占比最小值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的空间选择器.

- 筛选条件说明: 控件矩形可视化部分的空间占比 (即屏幕覆盖率) 满足指定的参数
- 关联控件属性: [ [boundsWidth](uiObjectType#m-boundswidth) / [boundsHeight](uiObjectType#m-boundsheight) / [bounds](uiObjectType#m-bounds) ]

例如对于以下 5 个控件:

```js
device.width; // 1080
device.height; // 1920

wA.bounds(); // Rect(0, 0 - 1080, 1896)
(wA.width() * wA.height()) / (device.width * device.height); // 0.9875

wB.bounds(); // Rect(150, 96 - 1020, 1820)
(wB.width() * wB.height()) / (device.width * device.height); /* 约为 0.723 .*/

wC.bounds(); /* Rect(-2000, -1400 - 80, 1920), 屏幕覆盖率约为 7.4% . */
wD.bounds(); /* Rect(-200, 0 - 1080, 1920), 屏幕覆盖率为 100% . */
wE.bounds(); /* Rect(20, 30 - 840, 4000), 屏幕覆盖率约为 74.7% . */
```

`screenCoverage(0.95)` 是一个控件矩形空间选择器, 可以匹配控件 `wA` 和 `wD`, 参数 `0.95` 表示可视化部分的空间占比不小于 `95%`, `wD` 较为特殊, 它的左边界为负数, 表示左边界超出屏幕可视化区域, 因此计算时按 `0` 处理.

同样特殊的, 还有 `wC` 及 `wE`.  
`wC` 的左边界及上边界均为负数, 超出了屏幕可视化区域, 计算面积时均按 `0` 处理:

```js
/* (right - left) * (bottom - top) */
(80 - 0) * (1920 - 0)
```

`wE` 的下边界为 `4000`, 大于示例中的设备高度 `1920`, 超出了屏幕可视化区域, 计算面积时按设备高度 `1920` 处理:

```js
/* (right - left) * (bottom - top) */
(840 - 20) * (1920 - 30)
```

因此 5 个控件中, `wC` 的屏幕覆盖率是最低的, 对于选择器 `screenCoverage(0.7)`, 除 `wC` 外的 4 个控件均可被筛选.

[拾取选择器](#m-pickup) 示例:

```js
pickup(screenCoverage(0.7), '@');
pickup({ screenCoverage: 0.7 }, '@');
```

### screenCoverage()

**`6.2.0`** **`Global`**

- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件矩形 (Rect)](androidRectType) 的空间选择器.

- 筛选条件说明: 控件矩形可视化部分的屏幕占比不小于 `94.8%`
- 关联控件属性: [ [boundsWidth](uiObjectType#m-boundswidth) / [boundsHeight](uiObjectType#m-boundsheight) / [bounds](uiObjectType#m-bounds) ]

[UiSelector#screenCoverage](#screencoverage)(`0.948`) 的重载方法.

## [m#] algorithm

### algorithm(str)

**`Global`**

- **str** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

选择器的算法配置器.

- 配置器说明: 用于配置在检索窗口控件时使用的遍历方式
- 配置选项 (非大小写敏感):
    - `DFS` - 深度优先搜索 (默认)
    - `BFS` - 广度优先搜索
- 关联控件属性: [ 无 ]

```js
console.log('DFS 搜索耗时: ' +
    recorder(() => text('hi').algorithm('DFS').findOnce()));
console.log('BFS 搜索耗时: ' +
    recorder(() => text('hi').algorithm('BFS').findOnce()));
```

BFS 在控件的 [深度](uiObjectType#m-depth) 较低或 [控件层级](glossaries#控件层级) 总数较少时, 可能会提升部分搜索效率.

[拾取选择器](#m-pickup) 示例:

```js
pickup(algorithm('BFS'), '@');
pickup({ algorithm: 'BFS' }, '@');
```

## [m#] action

### action(...actions)

**`6.2.0`** **`Global`**

- **actions** { [...](documentation#可变参数)[string](dataTypes#string)[[]](documentation#可变参数) } - 控件行为 ID
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

[控件行为](uiObjectActionsType) 选择器.

- 筛选条件说明: 控件支持指定的全部行为参数
- 关联控件属性: [ [actionNames](uiObjectType#m-actionnames) / [hasAction](uiObjectType#m-hasaction) ]

一个控件可能支持多种控件行为, 如点击, 长按, 设置文本等, 每个行为对应一个控件行为 ID, 如点击的 ID 为 `ACTION_CLICK`, 设置文本的 ID 为 `ACTION_SET_TEXT`, 更多控件行为 ID 可参阅 [控件节点行为](uiObjectActionsType) 章节的 `行为 ID` 表格.

`action('ACTION_SET_TEXT')` 是一个控件行为选择器, 要求控件满足支持设置文本的条件.

`action('ACTION_CLICK')` 也是一个控件行为选择器, 要求控件满足支持点击的条件.

参数中的 `'ACTION_'` 前缀可省略, 即 `action('SET_TEXT')` 与 `action('ACTION_SET_TEXT')` 等价.

action 选择器支持 [变长参数](documentation#可变参数), `action('SET_TEXT', 'CLICK')` 选择器则要求控件同时满足支持设置文本和支持点击的条件.

[拾取选择器](#m-pickup) 示例:

```js
pickup(action('SET_TEXT'), '@');
pickup({ action: 'SET_TEXT' }, '@');

pickup(action('SET_TEXT', 'CLICK'), '@');
pickup({ action: [ 'SET_TEXT', 'CLICK' ] }, '@');
```

## [m#] filter

### filter(f)

**`Global`**

- **f** { [(](dataTypes#function)w: [UiObject](uiObjectType)[)](dataTypes#function) [=>](dataTypes#function) [boolean](dataTypes#boolean) } - 过滤器
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

过滤器选择器, 将过滤器作为测试条件直接进行控件筛选.

- 筛选条件说明: 控件可通过过滤器测试条件
- 关联控件属性: [ 无 ]

filter 选择器相当于高度自定义的条件筛选器, 它可以实现更具体更符合特定需求的控件筛选.

```js
filter(w => w.text().length >= 5); /* 筛选文本长度不小于 5 的控件. */
filter(w => w.top() < cY(0.5) && w.width() > cX(0.9)); /* 筛选控件矩形上边界位于屏幕上半部分且宽度大于屏幕宽度 90% 的控件. */
filter(w => w.childCount() >= 2); /* 筛选至少有 2 个子节点的控件. */
```

[拾取选择器](#m-pickup) 示例:

```js
pickup(filter(w => w.childCount() >= 2), '@');
pickup({ filter: w => w.childCount() >= 2 }, '@');
```

## [m#] hasChildren

### hasChildren(b?)

**`6.2.0`** **`Overload [1-2]/2`** **`Global`**

- **[ b = true ]** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件子节点存在状态选择器.

- 筛选条件说明: 控件的子节点存在状态与指定参数相符
- 关联控件属性: [ [hasChildren](uiObjectType#m-haschildren) / [childCount](uiObjectType#m-childcount) ]

例如对于以下控件:

```js
/* 表示控件存在至少一个子节点, 即控件不是叶子结点. */
w.hasChildren(); // true
```

`hasChildren()` 及 `hasChildren(true)` 均可匹配控件 `w`.

`hasChildren()` 选择器相当于 `filter(w => w.childCount() > 0)` 选择器.

[拾取选择器](#m-pickup) 示例:

```js
pickup(hasChildren(), '@');
pickup({ hasChildren: [] }, '@');
pickup({ hasChildren: null }, '@'); /* 不推荐. */

pickup(hasChildren(true), '@');
pickup({ hasChildren: true }, '@');
```

## [m#] checkable

### checkable(b?)

**`Overload [1-2]/2`** **`Global`**

- **[ b = true ]** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件勾选可用性选择器.

- 筛选条件说明: 控件的勾选可用性与指定参数相符
- 关联控件属性: [checkable](uiObjectType#m-checkable)

例如对于以下控件:

```js
/* 表示控件可被选中. */
w.checkable(); // true
```

`checkable()` 及 `checkable(true)` 均可匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(checkable(), '@');
pickup({ checkable: [] }, '@');
pickup({ checkable: null }, '@'); /* 不推荐. */

pickup(checkable(true), '@');
pickup({ checkable: true }, '@');
```

## [m#] checked

### checked(b?)

**`Overload [1-2]/2`** **`Global`**

- **[ b = true ]** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件勾选状态选择器.

- 筛选条件说明: 控件的勾选状态与指定参数相符
- 关联控件属性: [checked](uiObjectType#m-checked)

例如对于以下控件:

```js
/* 表示控件已被选中. */
w.checked(); // true
```

`checked()` 及 `checked(true)` 均可匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(checked(), '@');
pickup({ checked: [] }, '@');
pickup({ checked: null }, '@'); /* 不推荐. */

pickup(checked(true), '@');
pickup({ checked: true }, '@');
```

## [m#] focusable

### focusable(b?)

**`Overload [1-2]/2`** **`Global`**

- **[ b = true ]** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件聚焦可用性选择器.

- 筛选条件说明: 控件的聚焦可用性与指定参数相符
- 关联控件属性: [focusable](uiObjectType#m-focusable)

例如对于以下控件:

```js
/* 表示控件可被聚焦. */
w.focusable(); // true
```

`focusable()` 及 `focusable(true)` 均可匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(focusable(), '@');
pickup({ focusable: [] }, '@');
pickup({ focusable: null }, '@'); /* 不推荐. */

pickup(focusable(true), '@');
pickup({ focusable: true }, '@');
```

## [m#] focused

### focused(b?)

**`Overload [1-2]/2`** **`Global`**

- **[ b = true ]** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件聚焦状态选择器.

- 筛选条件说明: 控件的聚焦状态与指定参数相符
- 关联控件属性: [focused](uiObjectType#m-focused)

例如对于以下控件:

```js
/* 表示控件已被聚焦. */
w.focused(); // true
```

`focused()` 及 `focused(true)` 均可匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(focused(), '@');
pickup({ focused: [] }, '@');
pickup({ focused: null }, '@'); /* 不推荐. */

pickup(focused(true), '@');
pickup({ focused: true }, '@');
```

## [m#] visibleToUser

### visibleToUser(b?)

**`Overload [1-2]/2`** **`Global`**

- **[ b = true ]** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件对用户可见状态选择器.

- 筛选条件说明: 控件的对用户可见状态与指定参数相符
- 关联控件属性: [visibleToUser](uiObjectType#m-visibletouser)

例如对于以下控件:

```js
/* 表示控件对用户可见. */
w.visibleToUser(); // true
```

`visibleToUser()` 及 `visibleToUser(true)` 均可匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(visibleToUser(), '@');
pickup({ visibleToUser: [] }, '@');
pickup({ visibleToUser: null }, '@'); /* 不推荐. */

pickup(visibleToUser(true), '@');
pickup({ visibleToUser: true }, '@');
```

## [m#] accessibilityFocused

### accessibilityFocused(b?)

**`Overload [1-2]/2`** **`Global`**

- **[ b = true ]** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件获取无障碍焦点状态选择器.

- 筛选条件说明: 控件的获取无障碍焦点状态与指定参数相符
- 关联控件属性: [accessibilityFocused](uiObjectType#m-accessibilityfocused)

例如对于以下控件:

```js
/* 表示控件支持无障碍聚焦行为. */
w.accessibilityFocused(); // true
```

`accessibilityFocused()` 及 `accessibilityFocused(true)` 均可匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(accessibilityFocused(), '@');
pickup({ accessibilityFocused: [] }, '@');
pickup({ accessibilityFocused: null }, '@'); /* 不推荐. */

pickup(accessibilityFocused(true), '@');
pickup({ accessibilityFocused: true }, '@');
```

## [m#] selected

### selected(b?)

**`Overload [1-2]/2`** **`Global`**

- **[ b = true ]** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件选中状态选择器.

- 筛选条件说明: 控件的选中状态与指定参数相符
- 关联控件属性: [selected](uiObjectType#m-selected)

例如对于以下控件:

```js
/* 表示控件支持选中行为. */
w.selected(); // true
```

`selected()` 及 `selected(true)` 均可匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(selected(), '@');
pickup({ selected: [] }, '@');
pickup({ selected: null }, '@'); /* 不推荐. */

pickup(selected(true), '@');
pickup({ selected: true }, '@');
```

## [m#] clickable

### clickable(b?)

**`Overload [1-2]/2`** **`Global`**

- **[ b = true ]** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件点击可用性选择器.

- 筛选条件说明: 控件的点击可用性与指定参数相符
- 关联控件属性: [clickable](uiObjectType#m-clickable)

例如对于以下控件:

```js
/* 表示控件支持点击行为. */
w.clickable(); // true
```

`clickable()` 及 `clickable(true)` 均可匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(clickable(), '@');
pickup({ clickable: [] }, '@');
pickup({ clickable: null }, '@'); /* 不推荐. */

pickup(clickable(true), '@');
pickup({ clickable: true }, '@');
```

## [m#] longClickable

### longClickable(b?)

**`Overload [1-2]/2`** **`Global`**

- **[ b = true ]** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件长按可用性选择器.

- 筛选条件说明: 控件的长按可用性与指定参数相符
- 关联控件属性: [longClickable](uiObjectType#m-longclickable)

例如对于以下控件:

```js
/* 表示控件支持长按行为. */
w.longClickable(); // true
```

`longClickable()` 及 `longClickable(true)` 均可匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(longClickable(), '@');
pickup({ longClickable: [] }, '@');
pickup({ longClickable: null }, '@'); /* 不推荐. */

pickup(longClickable(true), '@');
pickup({ longClickable: true }, '@');
```

## [m#] enabled

### enabled(b?)

**`Overload [1-2]/2`** **`Global`**

- **[ b = true ]** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件启用状态选择器.

- 筛选条件说明: 控件的启用状态与指定参数相符
- 关联控件属性: [enabled](uiObjectType#m-enabled)

例如对于以下控件:

```js
/* 表示控件是启用的 (未被禁用的). */
w.enabled(); // true
```

`enabled()` 及 `enabled(true)` 均可匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(enabled(), '@');
pickup({ enabled: [] }, '@');
pickup({ enabled: null }, '@'); /* 不推荐. */

pickup(enabled(true), '@');
pickup({ enabled: true }, '@');
```

## [m#] password

### password(b?)

**`Overload [1-2]/2`** **`Global`**

- **[ b = true ]** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件密码型状态选择器.

- 筛选条件说明: 控件的密码型状态与指定参数相符
- 关联控件属性: [password](uiObjectType#m-password)

例如对于以下控件:

```js
/* 表示控件是密码型控件. */
w.password(); // true
```

`password()` 及 `password(true)` 均可匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(password(), '@');
pickup({ password: [] }, '@');
pickup({ password: null }, '@'); /* 不推荐. */

pickup(password(true), '@');
pickup({ password: true }, '@');
```

## [m#] scrollable

### scrollable(b?)

**`Overload [1-2]/2`** **`Global`**

- **[ b = true ]** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件滚动可用性选择器.

- 筛选条件说明: 控件的滚动可用性与指定参数相符
- 关联控件属性: [scrollable](uiObjectType#m-scrollable)

例如对于以下控件:

```js
/* 表示控件可滚动. */
w.scrollable(); // true
```

`scrollable()` 及 `scrollable(true)` 均可匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(scrollable(), '@');
pickup({ scrollable: [] }, '@');
pickup({ scrollable: null }, '@'); /* 不推荐. */

pickup(scrollable(true), '@');
pickup({ scrollable: true }, '@');
```

## [m#] editable

### editable(b?)

**`Overload [1-2]/2`** **`Global`**

- **[ b = true ]** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件编辑可用性选择器.

- 筛选条件说明: 控件的编辑可用性与指定参数相符
- 关联控件属性: [editable](uiObjectType#m-editable)

例如对于以下控件:

```js
/* 表示控件可编辑. */
w.editable(); // true
```

`editable()` 及 `editable(true)` 均可匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(editable(), '@');
pickup({ editable: [] }, '@');
pickup({ editable: null }, '@'); /* 不推荐. */

pickup(editable(true), '@');
pickup({ editable: true }, '@');
```

## [m#] contentValid

### contentValid(b?)

**`Overload [1-2]/2`** **`Global`**

- **[ b = true ]** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件内容有效状态选择器.

- 筛选条件说明: 控件的内容有效的状态与指定参数相符
- 关联控件属性: isContentValid

例如对于以下控件:

```js
/* 表示控件是内容有效的. */
w.isContentValid(); // true
```

`contentValid()` 及 `contentValid(true)` 均可匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(contentValid(), '@');
pickup({ contentValid: [] }, '@');
pickup({ contentValid: null }, '@'); /* 不推荐. */

pickup(contentValid(true), '@');
pickup({ contentValid: true }, '@');
```

## [m#] contextClickable

### contextClickable(b?)

**`Overload [1-2]/2`** **`Global`**

- **[ b = true ]** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件上下文点击有效性选择器.

- 筛选条件说明: 控件的上下文点击有效性与指定参数相符
- 关联控件属性: isContextClickable

例如对于以下控件:

```js
/* 表示控件支持上下文点击行为. */
w.isContextClickable(); // true
```

`contextClickable()` 及 `contextClickable(true)` 均可匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(contextClickable(), '@');
pickup({ contextClickable: [] }, '@');
pickup({ contextClickable: null }, '@'); /* 不推荐. */

pickup(contextClickable(true), '@');
pickup({ contextClickable: true }, '@');
```

## [m#] multiLine

### multiLine(b?)

**`Overload [1-2]/2`** **`Global`**

- **[ b = true ]** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件多行文本编辑有效性选择器.

- 筛选条件说明: 控件的多行文本编辑的有效性与指定参数相符
- 关联控件属性: isMultiLine

例如对于以下控件:

```js
/* 表示控件是文本可编辑的, 且支持多行编辑. */
w.isMultiLine(); // true
```

`multiLine()` 及 `multiLine(true)` 均可匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(multiLine(), '@');
pickup({ multiLine: [] }, '@');
pickup({ multiLine: null }, '@'); /* 不推荐. */

pickup(multiLine(true), '@');
pickup({ multiLine: true }, '@');
```

## [m#] dismissable

### dismissable(b?)

**`Overload [1-2]/2`** **`Global`**

- **[ b = true ]** { [boolean](dataTypes#boolean) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件消隐有效性选择器.

- 筛选条件说明: 控件的消隐有效性与指定参数相符
- 关联控件属性: isDismissable

例如对于以下控件:

```js
/* 表示控件可被消隐. */
w.isDismissable(); // true
```

`dismissable()` 及 `dismissable(true)` 均可匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(dismissable(), '@');
pickup({ dismissable: [] }, '@');
pickup({ dismissable: null }, '@'); /* 不推荐. */

pickup(dismissable(true), '@');
pickup({ dismissable: true }, '@');
```

## [m#] depth

### depth(d)

**`Global`**

- **d** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件的 [控件层级](glossaries#控件层级) 深度数值选择器.

- 筛选条件说明: 控件的控件层级深度与指定参数相符
- 关联控件属性: [depth](uiObjectType#m-depth)

例如对于以下控件:

```js
w.depth(); // 5
```

`depth(5)` 是一个控件数值选择器, 可以匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(depth(5), '@');
pickup({ depth: 5 }, '@');
```

## [m#] rowCount

### rowCount(d)

**`Global`**

- **d** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件的 [信息集控件](glossaries#信息集控件) 的行数数值选择器.

- 筛选条件说明: 控件的信息集控件行数与指定参数相符
- 关联控件属性: [rowCount](uiObjectType#m-rowcount)

例如对于以下控件:

```js
w.rowCount(); // 5
```

`rowCount(5)` 是一个控件数值选择器, 可以匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(rowCount(5), '@');
pickup({ rowCount: 5 }, '@');
```

## [m#] columnCount

### columnCount(d)

**`Global`**

- **d** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件深度数值选择器.

- 筛选条件说明: 控件的控件层级深度与指定参数相符
- 关联控件属性: [columnCount](uiObjectType#m-columncount)

例如对于以下控件:

```js
w.columnCount(); // 5
```

`columnCount(5)` 是一个控件数值选择器, 可以匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(columnCount(5), '@');
pickup({ columnCount: 5 }, '@');
```

## [m#] row

### row(d)

**`Global`**

- **d** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件的 [子项信息集控件](glossaries#子项信息集控件) 所在行的索引数值选择器.

- 筛选条件说明: 控件的子项信息集控件所在行的索引数值与指定参数相符
- 关联控件属性: [row](uiObjectType#m-row)

例如对于以下控件:

```js
w.row(); // 5
```

`row(5)` 是一个控件数值选择器, 可以匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(row(5), '@');
pickup({ row: 5 }, '@');
```

## [m#] column

### column(d)

**`Global`**

- **d** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件的 [子项信息集控件](glossaries#子项信息集控件) 所在列的索引数值选择器.

- 筛选条件说明: 控件的子项信息集控件所在列的索引值与指定参数相符
- 关联控件属性: [column](uiObjectType#m-column)

例如对于以下控件:

```js
w.column(); // 5
```

`column(5)` 是一个控件数值选择器, 可以匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(column(5), '@');
pickup({ column: 5 }, '@');
```

## [m#] rowSpan

### rowSpan(d)

**`Global`**

- **d** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件的 [子项信息集控件](glossaries#子项信息集控件) 纵跨的行数数值选择器.

- 筛选条件说明: 控件的子项信息集控件纵跨的行数与指定参数相符
- 关联控件属性: [rowSpan](uiObjectType#m-rowspan)

例如对于以下控件:

```js
w.rowSpan(); // 5
```

`rowSpan(5)` 是一个控件数值选择器, 可以匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(rowSpan(5), '@');
pickup({ rowSpan: 5 }, '@');
```

## [m#] columnSpan

### columnSpan(d)

**`Global`**

- **d** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件的 [子项信息集控件](glossaries#子项信息集控件) 横跨的列数数值选择器.

- 筛选条件说明: 控件的子项信息集控件横跨的列数与指定参数相符
- 关联控件属性: [columnSpan](uiObjectType#m-columnspan)

例如对于以下控件:

```js
w.columnSpan(); // 5
```

`columnSpan(5)` 是一个控件数值选择器, 可以匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(columnSpan(5), '@');
pickup({ columnSpan: 5 }, '@');
```

## [m#] drawingOrder

### drawingOrder(order)

**`6.2.0`** **`Global`**

- **order** { [number](dataTypes#number) } - 控件视图绘制次序
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件视图绘制次序数值选择器.

- 筛选条件说明: 控件视图绘制次序与指定参数相符
- 关联控件属性: [drawingOrder](uiObjectType#m-drawingorder)

例如对于以下控件:

```js
w.drawingOrder(); // 23
```

`drawingOrder(23)` 可以匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(drawingOrder(23), '@');
pickup({ drawingOrder: 23 }, '@');
```

## [m#] indexInParent

### indexInParent(d)

**`Global`**

- **d** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件在其父控件索引数值选择器.

- 筛选条件说明: 控件在其父控件的索引值与指定参数相符
- 关联控件属性: [indexInParent](uiObjectType#m-indexinparent)

例如对于以下控件:

```js
w.indexInParent(); // 5
```

`indexInParent(5)` 是一个控件数值选择器, 可以匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(indexInParent(5), '@');
pickup({ indexInParent: 5 }, '@');
```

## [m#] childCount

### childCount(d)

**`6.2.0`** **`Global`**

- **d** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件子节点数量数值选择器.

- 筛选条件说明: 控件的子节点数量与指定参数相符
- 关联控件属性: [childCount](uiObjectType#m-childcount)

例如对于以下控件:

```js
w.childCount(); // 5
```

`childCount(5)` 是一个控件数值选择器, 可以匹配控件 `w`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(childCount(5), '@');
pickup({ childCount: 5 }, '@');
```

## [m#] minChildCount

### minChildCount(min)

**`6.2.0`** **`Global`**

- **min** { [number](dataTypes#number) } - 控件子节点数量最小值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件子节点数量数值选择器.

- 筛选条件说明: 控件的子节点数量与指定参数限制相符
- 关联控件属性: [childCount](uiObjectType#m-childcount)

例如对于以下控件:

```js
wA.childCount(); // 0
wB.childCount(); // 3
wB.childCount(); // 5
```

`minChildCount(2)` 是一个控件数值选择器, 可以匹配控件 `wB` 和 `wC`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(minChildCount(2), '@');
pickup({ minChildCount: 2 }, '@');
```

## [m#] maxChildCount

### maxChildCount(max)

**`6.2.0`** **`Global`**

- **max** { [number](dataTypes#number) } - 控件子节点数量最大值
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) }

控件子节点数量数值选择器.

- 筛选条件说明: 控件的子节点数量与指定参数限制相符
- 关联控件属性: [childCount](uiObjectType#m-childcount)

例如对于以下控件:

```js
wA.childCount(); // 0
wB.childCount(); // 3
wB.childCount(); // 5
```

`maxChildCount(4)` 是一个控件数值选择器, 可以匹配控件 `wA` 和 `wB`.

[拾取选择器](#m-pickup) 示例:

```js
pickup(maxChildCount(4), '@');
pickup({ maxChildCount: 4 }, '@');
```

## [m#] findOnce

### findOnce()

**`Global`** **`Overload 1/2`** **`A11Y`**

- <ins>**returns**</ins> { [UiObject](uiObjectType) | [null](dataTypes#null) }

根据选择器条件筛选控件.  
筛选结果为单个控件, 不存在任何符合筛选条件的控件时, 返回 null.

特性:

- 阻塞筛选 - [ × ]
- 集合结果 - [ × ]

```js
let sel = text('hello').boundsCenterY(0.3);
let w = sel.findOnce();
```

上述示例中, `w` 表示符合筛选条件的首个控件 (可能为 null).

### findOnce(index)

**`Global`** **`Overload 2/2`** **`A11Y`**

- **index** { [number](dataTypes#number) } - 控件索引
- <ins>**returns**</ins> { [UiObject](uiObjectType) | [null](dataTypes#null) }

根据选择器条件筛选控件.  
筛选结果为索引参数指定的单个控件, 不存在时返回 null.

特性:

- 阻塞筛选 - [ × ]
- 集合结果 - [ × ]

```js
let sel = text('hello').boundsCenterY(0.3);
let wA = sel.findOnce();
let wB = sel.findOnce(0);
let wC = sel.findOnce(4);
```

上述示例中, `wB` 与 `wA` 等价, 表示符合筛选条件的首个 (第 1 个) 控件 (可能为 null).  
`wC` 表示第 5 个符合筛选条件的控件 (可能为 null).

## [m#] exists

### exists()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

根据选择器条件判断是否存在满足筛选条件的控件.

相当于 `UiSelector#findOnce() !== null`.

## [m#] find

### find()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [UiObjectCollection](uiObjectCollectionType) }

根据选择器条件筛选全部符合筛选条件的控件.  
筛选结果为 [控件集合](uiObjectCollectionType), 不存在任何符合筛选条件的控件时, 返回空集合.

特性:

- 阻塞筛选 - [ × ]
- 集合结果 - [ √ ]

```js
let sel = text('hello').boundsCenterY(0.3);
let wc = sel.find();
wc.forEach(w => console.log(w.centerY()));
```

上述示例中, `wc` 表示符合筛选条件的控件集合.

## [m#] findOne

### findOne(timeout)

**`Global`** **`Overload 1/2`** **`A11Y`** **`Non-UI`**

- <ins>**returns**</ins> { [UiObject](uiObjectType) | [null](dataTypes#null) }

根据选择器条件持续筛选控件, 直到出现符合筛选条件的控件或筛选超时.  
筛选结果为单个控件, 指定时限内不存在任何符合筛选条件的控件时, 返回 null.

特性:

- 阻塞筛选 - [ √ ]
- 集合结果 - [ × ]

```js
let sel = text('hello').boundsCenterY(0.3);
let w = sel.findOne(3e3); /* 3000 毫秒, 即 3 秒. */
console.log(w.centerY());
```

上述示例中, `w` 表示 3 秒内符合筛选条件的首个控件, 超时则为 null.

### findOne()

**`Global`** **`Overload 2/2`** **`A11Y`** **`Non-UI`** **`DEPRECATED`**

- <ins>**returns**</ins> { [UiObject](uiObjectType) }

根据选择器条件持续筛选控件, 直到出现符合筛选条件的控件.  
意味着此方法可能导致脚本 **永久阻塞**.  
筛选结果为单个控件.

特性:

- 阻塞筛选 - [ √ ]
- 集合结果 - [ × ]

此方法相当于 `UiSelector#findOne(-1)`.  
因 `findOne()` 易造成歧义及混淆, 因此被弃用, 建议使用 `findOne(-1)` 或 `untilFindOne()` 替代.

```js
let sel = text('hello').boundsCenterY(0.3);
let w = sel.findOne();
console.log(w.centerY());
```

上述示例中, `w` 表示符合筛选条件的首个控件.  
第三行 `console.log(w.centerY());` 可能永远无法执行, 除非 `sel.findOne()` 筛选成功解除阻塞.

## [m#] untilFindOne

### untilFindOne()

**`Global`** **`A11Y`** **`Non-UI`**

- <ins>**returns**</ins> { [UiObject](uiObjectType) }

根据选择器条件持续筛选控件, 直到出现符合筛选条件的控件.  
意味着此方法可能导致脚本 **永久阻塞**.  
筛选结果为单个控件.

特性:

- 阻塞筛选 - [ √ ]
- 集合结果 - [ × ]

此方法相当于 `UiSelector#findOne(-1)`.

```js
let sel = text('hello').boundsCenterY(0.3);
let w = sel.untilFindOne();
console.log(w.centerY());
```

上述示例中, `w` 表示符合筛选条件的首个控件.  
第三行 `console.log(w.centerY());` 可能永远无法执行, 除非 `sel.untilFindOne()` 筛选成功解除阻塞.

## [m#] untilFind

### untilFind()

**`Global`** **`A11Y`** **`Non-UI`**

- <ins>**returns**</ins> { [UiObjectCollection](uiObjectCollectionType) }

根据选择器条件持续筛选控件, 直到出现符合筛选条件的控件.  
意味着此方法可能导致脚本 **永久阻塞**.  
筛选结果为控件集合.

特性:

- 阻塞筛选 - [ √ ]
- 集合结果 - [ √ ]

```js
let sel = text('hello').boundsCenterY(0.3);
let wc = sel.untilFind();
console.log(wc.length);
```

上述示例中, `w` 表示符合筛选条件的首个控件.  
第三行 `console.log(wc.length);` 可能永远无法执行, 除非 `sel.untilFind()` 筛选成功解除阻塞.

## [m#] waitFor

### waitFor()

**`Global`** **`A11Y`** **`Non-UI`** **`DEPRECATED`**

- <ins>**returns**</ins> { [UiObjectCollection](uiObjectCollectionType) }

根据选择器条件持续筛选控件, 直到出现符合筛选条件的控件.  
意味着此方法可能导致脚本 **永久阻塞**.  
筛选结果为控件集合.

特性:

- 阻塞筛选 - [ √ ]
- 集合结果 - [ √ ]

[UiSelector#untilFind](#untilfind) 的别名方法.

因 `waitFor()` 易造成歧义及混淆, 因此被弃用, 建议使用 `untilFind()` 替代.

## [m#] performAction

用于执行指定的控件行为.  
在 [控件节点行为](uiObjectActionsType) 章节已详细描述相关内容, 此处仅注明方法签名, 相关内容将不再赘述.

### performAction(action, ...arguments)

**`Global`** **`A11Y`**

- **action** { [number](dataTypes#number) } - 行为的唯一标志符 (Action ID)
- **arguments** { [...](documentation#可变参数)[ActionArgument](uiObjectActionsType#i-actionargument)[[]](documentation#可变参数) } - 行为参数, 用于给行为传递参数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已执行且执行过程中无异常

## [m#] click

### click()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 点击 ] 行为](uiObjectActionsType#m-click).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险, 因此此方法不建议使用.

> 注: 此方法不是全局的, 它被 automator.click 替代.

## [m#] longClick

### longClick()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 长按 ] 行为](uiObjectActionsType#m-longclick).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险, 因此此方法不建议使用.

> 注: 此方法不是全局的, 它被 automator.longClick 替代.

## [m#] accessibilityFocus

### accessibilityFocus()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 获取无障碍焦点 ] 行为](uiObjectActionsType#m-accessibilityfocus).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] clearAccessibilityFocus

### clearAccessibilityFocus()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 清除无障碍焦点 ] 行为](uiObjectActionsType#m-clearaccessibilityfocus).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] focus

### focus()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 获取焦点 ] 行为](uiObjectActionsType#m-focus).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] clearFocus

### clearFocus()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 清除焦点 ] 行为](uiObjectActionsType#m-clearfocus).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] dragStart

### dragStart()

**`6.2.0`** **`Global`** **`A11Y`** **`API>=32`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 拖放开始 ] 行为](uiObjectActionsType#m-dragstart).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] dragDrop

### dragDrop()

**`6.2.0`** **`Global`** **`A11Y`** **`API>=32`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 拖放放下 ] 行为](uiObjectActionsType#m-dragdrop).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] dragCancel

### dragCancel()

**`6.2.0`** **`Global`** **`A11Y`** **`API>=32`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 拖放取消 ] 行为](uiObjectActionsType#m-dragcancel).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] imeEnter

### imeEnter()

**`6.2.0`** **`Global`** **`A11Y`** **`API>=30`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 输入法 ENTER 键 ] 行为](uiObjectActionsType#m-imeenter).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] moveWindow

### moveWindow(x, y)

**`6.2.0`** **`Global`** **`A11Y`** **`API>=26`**

- **x** { [number](dataTypes#number) } - X 坐标
- **y** { [number](dataTypes#number) } - Y 坐标
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 移动窗口到新位置 ] 行为](uiObjectActionsType#m-movewindow).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] nextAtMovementGranularity

### nextAtMovementGranularity(granularity, isExtendSelection)

**`6.2.0`** **`Global`** **`A11Y`**

- **granularity** { [number](dataTypes#number) } - 粒度
- **isExtendSelection** { [boolean](dataTypes#boolean) } - 是否扩展选则文本
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 按粒度移至下一位置 ] 行为](uiObjectActionsType#m-nextatmovementgranularity).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] nextHtmlElement

### nextHtmlElement(element)

**`6.2.0`** **`Global`** **`A11Y`**

- **element** { [string](dataTypes#string) } - 元素名称
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 按元素移至下一位置 ] 行为](uiObjectActionsType#m-nexthtmlelement).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] pageLeft

### pageLeft()

**`6.2.0`** **`Global`** **`A11Y`** **`API>=29`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 使视窗左移的翻页 ] 行为](uiObjectActionsType#m-pageleft).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] pageUp

### pageUp()

**`6.2.0`** **`Global`** **`A11Y`** **`API>=29`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 使视窗上移的翻页 ] 行为](uiObjectActionsType#m-pageup).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] pageRight

### pageRight()

**`6.2.0`** **`Global`** **`A11Y`** **`API>=29`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 使视窗右移的翻页 ] 行为](uiObjectActionsType#m-pageright).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] pageDown

### pageDown()

**`6.2.0`** **`Global`** **`A11Y`** **`API>=29`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 使视窗下移的翻页 ] 行为](uiObjectActionsType#m-pagedown).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] pressAndHold

### pressAndHold()

**`6.2.0`** **`Global`** **`A11Y`** **`API>=30`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 按住 ] 行为](uiObjectActionsType#m-pressandhold).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] previousAtMovementGranularity

### previousAtMovementGranularity(granularity, isExtendSelection)

**`6.2.0`** **`Global`** **`A11Y`**

- **granularity** { [number](dataTypes#number) } - 粒度
- **isExtendSelection** { [boolean](dataTypes#boolean) } - 是否扩展选则文本
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 按粒度移至上一位置 ] 行为](uiObjectActionsType#m-previousatmovementgranularity).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] previousHtmlElement

### previousHtmlElement(element)

**`6.2.0`** **`Global`** **`A11Y`**

- **element** { [string](dataTypes#string) } - 元素名称
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 按元素移至上一位置 ] 行为](uiObjectActionsType#m-previoushtmlelement).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] showTextSuggestions

### showTextSuggestions()

**`6.2.0`** **`Global`** **`A11Y`** **`API>=33`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 显示文本建议 ] 行为](uiObjectActionsType#m-showtextsuggestions).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] showTooltip

### showTooltip()

**`6.2.0`** **`Global`** **`A11Y`** **`API>=28`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 显示工具提示信息 ] 行为](uiObjectActionsType#m-showtooltip).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] hideTooltip

### hideTooltip()

**`6.2.0`** **`Global`** **`A11Y`** **`API>=28`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 隐藏工具提示信息 ] 行为](uiObjectActionsType#m-hidetooltip).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] show

### show()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 显示在视窗内 ] 行为](uiObjectActionsType#m-show).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] dismiss

### dismiss()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 消隐 ] 行为](uiObjectActionsType#m-dismiss).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] copy

### copy()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 复制文本 ] 行为](uiObjectActionsType#m-copy).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] cut

### cut()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 剪切文本 ] 行为](uiObjectActionsType#m-cut).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] paste

### paste()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 粘贴文本 ] 行为](uiObjectActionsType#m-paste).

当使用全局方法 `paste()` 时, 相当于 `untilFind().paste()`, `untilFind()` 前无筛选条件, 因此 `untilFind()` 将得到窗口全部控件的集合, 集合中的所有控件将全部执行一次 `paste()`.  
然而实际执行全局方法 `paste()` 时, 往往只有一个控件执行了粘贴行为, 并非所有控件都执行一遍.  
这是因为控件 `w` 完成粘贴行为的前提, 是它处于聚焦状态 (`w.focused()` 为 `true`).  
在一个活动窗口中, 往往最多只有一个控件处于聚焦状态, 因此只有该控件可以完成粘贴行为.  
如果需要所有的文本编辑控件全部完成粘贴行为, 可参考如下代码:

```js 
let wc = className('EditText').find();
wc.forEach((w) => {
    w.focus();
    w.paste();
});
wc.at(-1).clearFocus();
```

除了 `w.paste()`, `w.setText(getClip())` 也可用于实现粘贴效果:

```js
className('EditText').find().forEach(w => w.setText(getClip()));
```

与 `w.paste()` 不同的是, `w.setText()` 不需要控件 `w` 处于聚焦状态.

对已聚焦的文本编辑控件执行粘贴操作:

```js
focused().className('EditText').find().forEach(w => w.setText(getClip()));

/* 拾取器写法, 效果同上. */
pickup({
    focused: true,
    className: 'EditText',
}, '[w]').forEach(w => w.setText(getClip()));
```

上述示例虽然使用了集合筛选, 但得到的控件集合中往往只有一个控件.

## [m#] select

### select()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 选中 ] 行为](uiObjectActionsType#m-select).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] expand

### expand()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 展开 ] 行为](uiObjectActionsType#m-expand).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] collapse

### collapse()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 折叠 ] 行为](uiObjectActionsType#m-collapse).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] scrollLeft

### scrollLeft()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 使视窗左移的滚动 ] 行为](uiObjectActionsType#m-scrollleft).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] scrollUp

### scrollUp()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 使视窗上移的滚动 ] 行为](uiObjectActionsType#m-scrollup).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险, 因此此方法不建议使用.

> 注: 此方法不是全局的, 它被 automator.scrollUp 替代.

## [m#] scrollRight

### scrollRight()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 使视窗右移的滚动 ] 行为](uiObjectActionsType#m-scrollright).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] scrollDown

### scrollDown()

**`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 使视窗下移的滚动 ] 行为](uiObjectActionsType#m-scrolldown).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险, 因此此方法不建议使用.

> 注: 此方法不是全局的, 它被 automator.scrollDown 替代.

## [m#] scrollForward

### scrollForward()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 使视窗前移的滚动 ] 行为](uiObjectActionsType#m-scrollforward).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] scrollBackward

### scrollBackward()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 使视窗后移的滚动 ] 行为](uiObjectActionsType#m-scrollbackward).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] scrollTo

### scrollTo(row, column)

**`Global`** **`A11Y`**

- **row** { [number](dataTypes#number) } - 行序数
- **column** { [number](dataTypes#number) } - 列序数
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 将指定位置滚动至视窗内 ] 行为](uiObjectActionsType#m-scrollto).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] contextClick

### contextClick()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 上下文点击 ] 行为](uiObjectActionsType#m-contextclick).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] setText

### setText(text)

**`A11Y`**

- **text** { [string](dataTypes#string) } - 文本
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 设置文本 ] 行为](uiObjectActionsType#m-settext).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险, 因此此方法不建议使用.

> 注: 此方法不是全局的, 它被 automator.setText 替代.

## [m#] setSelection

### setSelection(start, end)

**`Global`** **`A11Y`**

- **start** { [number](dataTypes#number) } - 开始位置
- **end** { [number](dataTypes#number) } - 结束位置
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 选择文本 ] 行为](uiObjectActionsType#m-setselection).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] clearSelection

### clearSelection()

**`6.2.0`** **`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 取消选择文本 ] 行为](uiObjectActionsType#m-clearselection).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] setProgress

### setProgress(progress)

**`Global`** **`A11Y`**

- **progress** { [number](dataTypes#number) } - 进度值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否行为已全部执行且执行过程中无异常

根据选择器条件, 使用 [untilFind](#m-untilfind) 筛选得到控件集合, 对集合执行 [[ 设置进度值 ] 行为](uiObjectActionsType#m-setprogress).

因 [选择器行为](#选择器行为) 存在潜在的永久阻塞风险且全局行为缺少针对性, 因此此方法不建议使用.

## [m#] plus

### plus(selector)

**`6.5.0`**

- **selector** { [UiSelector](uiSelectorType) } - 待拼接的选择器
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) } - 拼接后的新选择器

选择器拼接, 不改变原选择器.

```js
let selA = text('A').minTop(0.5);
let selB = desc('B').maxHeight(0.5);
let selPlused = selA.plus(selB);
console.log(selPlused); // text("A").minTop(0.5).desc("B").maxHeight(0.5)
console.log(selA); // text("A").minTop(0.5)
```

上述示例可见, `plus` 方法不改变 `selA` 的值.

> 参阅: [append](#m-append) 方法小节.

## [m#] append

### append(selector)

**`6.5.0`**

- **selector** { [UiSelector](uiSelectorType) } - 待拼接的选择器
- <ins>**returns**</ins> { [UiSelector](uiSelectorType) } - 拼接后的新选择器

选择器拼接, 且改变原选择器. 是一种 `可变方法 (mutable method)`.

```js
let selA = text('A').minTop(0.5);
let selB = desc('B').maxHeight(0.5);
let selPlused = selA.append(selB);
console.log(selPlused); // text("A").minTop(0.5).desc("B").maxHeight(0.5)
console.log(selA); // text("A").minTop(0.5).desc("B").maxHeight(0.5)
```

上述示例可见, `append` 方法会改变 `selA` 的值.

因此上述示例等价于下述示例:

```js
let selA = text('A').minTop(0.5);
let selB = desc('B').maxHeight(0.5);
selA.append(selB);
console.log(selA); // text("A").minTop(0.5).desc("B").maxHeight(0.5)
```

> 参阅: [plus](#m-plus) 方法小节.

## [m] pickup

拾取选择器, 简称拾取器, 是高度封装的混合形式选择器, 用于在筛选控件及处理结果过程中实现快捷操作.  
支持 [ 选择器多形式混合 / 控件罗盘 / 结果筛选 / 参化调用 ] 等.

部分特性:

- `pickup` 已全局化, 支持全局使用.
- `pickup` 支持 [UiObject](uiObjectType) 类型参数, 但只是将其作为根节点进行控件筛选, 而不能对其进行罗盘导航及结果筛选等操作.
- `pickup` 的内部实现引用了 [detect](uiObjectType#m-detect) 方法.

### pickup()

**`6.2.0`** **`Global`** **`Overload 1/17`** **`A11Y`**

- <ins>**returns**</ins> { [UiObject](uiObjectType) | [null](dataTypes#null) }

无条件拾取器, 相当于 `findOnce()`, 此时得到的控件通常是活动窗口 [depth](uiObjectType#m-depth) 为 `0` 的控件.

```js
pickup().depth(); // 0
```

### pickup(selector)

**`6.2.0`** **`Global`** **`Overload 2/17`** **`A11Y`**

- **selector** { [PickupSelector](dataTypes#pickupselector) } - 混合选择器参数
- <ins>**returns**</ins> { [any](dataTypes#any) } - 筛选结果

相当于 `selector.findOnce()`.

selector 参数支持 [单一型选择器](dataTypes#单一型选择器) ([经典选择器](dataTypes#经典选择器) / [内容选择器](dataTypes#内容选择器) / [对象选择器](dataTypes#对象选择器)) 和 [混合型选择器](dataTypes#混合型选择器):

```js
/* 经典选择器参数. */
let selClassic = text('abc').clickable().centerX(0.5).boundsInside(0.2, 0.05, -1, -1).action('CLICK', 'SET_TEXT', 'LONG_CLICK');
pickup(selClassic);

/* 对象选择器参数. */
let selObject = {
    text: 'abc',
    clickable: [], /* 或 clickable: true . */
    centerX: 0.5,
    boundsInside: [ 0.2, 0.05, -1, -1 ],
    action: [ 'CLICK', 'SET_TEXT', 'LONG_CLICK' ],
};
pickup(selObject);

/* 混合型选择器参数. */
pickup([ 'abc', {
    clickable: [], /* 或 clickable: true . */
    centerX: 0.5,
    boundsInside: [ 0.2, 0.05, -1, -1 ],
    action: [ 'CLICK', 'SET_TEXT', 'LONG_CLICK' ],
} ]);
```

### pickup(selector, result)

**`6.2.0`** **`Global`** **`Overload 3/17`** **`A11Y`**

- **selector** { [PickupSelector](dataTypes#pickupselector) } - 混合选择器参数
- **result** { [PickupResult](dataTypes#pickupresult) } - 结果筛选参数
- <ins>**returns**</ins> { [any](dataTypes#any) } - 筛选结果

对 `selector.findOnce()` 根据 `result` 参数进行 [结果筛选](dataTypes#pickupresult) 或 [参化调用](dataTypes#uiobjectinvokable).

```js
/* 结果筛选 - 文本. */

pickup(textMatch(/ab?.+/), 'text'); /* 返回符合筛选条件控件的文本, 无符合条件的控件时返回空字符串 ("") . */

/* 结果筛选 - 点. */

pickup(clickable(true), 'point'); /* 返回符合筛选条件控件的坐标, 无符合条件的控件时返回 null . */
pickup(clickable(true), '.'); /* 同上. */

/* 参化调用 - 获取控件矩形 (Rect) . */

pickup(clickable(true), 'bounds'); /* 空指针安全. */
clickable(true).findOnce().bounds(); /* 效果同上, 但存在潜在的空指针异常. */

/* 参化调用 - 设置文本. */

pickup(className('EditText'), [ 'setText', 'hello' ]); /* 空指针安全. */
className('EditText').findOnce().setText('hello'); /* 效果同上, 但存在潜在的空指针异常. */

/* 参化调用 - 设置文本选区. */

pickup(className('EditText'), [ 'setSelection', 1, 5 ]); /* 空指针安全. */
className('EditText').findOnce().setSelection(1, 5); /* 效果同上, 但存在潜在的空指针异常. */
```

### pickup(selector, compass)

**`6.2.0`** **`Global`** **`Overload 4/17`** **`A11Y`**

- **selector** { [PickupSelector](dataTypes#pickupselector) } - 混合选择器参数
- **compass** { [DetectCompass](dataTypes#detectcompass) } - 控件罗盘参数
- <ins>**returns**</ins> { [any](dataTypes#any) } - 筛选结果

对 `selector.findOnce()` 进行 [罗盘定位](uiObjecttype#m-compass).

```js
pickup(text('abc'), 'p3'); /* 空指针安全. */
text('abc').findOnce().parent().parent().parent(); /* 效果同上, 但存在潜在的空指针异常. */
```

### pickup(selector, compass, result)

**`6.2.0`** **`Global`** **`Overload 5/17`** **`A11Y`**

- **selector** { [PickupSelector](dataTypes#pickupselector) } - 混合选择器参数
- **compass** { [DetectCompass](dataTypes#detectcompass) } - 控件罗盘参数
- **result** { [PickupResult](dataTypes#pickupresult) } - 结果筛选参数
- <ins>**returns**</ins> { [any](dataTypes#any) } - 筛选结果

对 `selector.findOnce()` 进行 [罗盘定位](uiObjecttype#m-compass) 后, 再进行 [结果筛选](dataTypes#pickupresult) 或 [参化调用](dataTypes#uiobjectinvokable).

```js
pickup(text('abc'), 'p3', 'click'); /* 空指针安全. */
text('abc').findOnce().parent().parent().parent().click(); /* 效果同上, 但存在潜在的空指针异常. */

pickup(text('abc'), 's>1', 'bounds'); /* 空指针安全. */
let w = text('abc').findOnce();
w.parent().child(w.indexInParent() + 1).bounds(); /* 效果同上, 但存在潜在的空指针异常. */
```

### pickup(root, selector)

**`6.2.0`** **`Global`** **`Overload 6/17`** **`A11Y`**

- **root** { [UiObject](uiObjectType) } - 筛选根节点参数
- **selector** { [PickupSelector](dataTypes#pickupselector) } - 混合选择器参数
- <ins>**returns**</ins> { [any](dataTypes#any) } - 筛选结果

以 `root` 参数指定的控件为根节点, 执行 `selector.findOnce()` 筛选.

```js
let w = text('abc').findOnce();
pickup(w, 'xyz'); /* 在 w 控件的所有子孙节点中筛选内容为 'xyz' 的控件. */
```

> 参阅: [pickup(selector)](#pickupselector)

### pickup(root, selector, result)

**`6.2.0`** **`Global`** **`Overload 7/17`** **`A11Y`**

- **root** { [UiObject](uiObjectType) } - 筛选根节点参数
- **selector** { [PickupSelector](dataTypes#pickupselector) } - 混合选择器参数
- **result** { [PickupResult](dataTypes#pickupresult) } - 结果筛选参数
- <ins>**returns**</ins> { [any](dataTypes#any) } - 筛选结果

以 `root` 参数指定的控件为根节点, 对 `selector.findOnce()` 根据 `result` 参数进行 [结果筛选](dataTypes#pickupresult) 或 [参化调用](dataTypes#uiobjectinvokable).

```js
let w = text('abc').findOnce();
pickup(w, 'xyz', 'height'); /* 在 w 控件的所有子孙节点中筛选内容为 'xyz' 的控件的高度. */
```

> 参阅: [pickup(selector, result)](#pickupselector-result)

### pickup(root, selector, compass)

**`6.2.0`** **`Global`** **`Overload 8/17`** **`A11Y`**

- **root** { [UiObject](uiObjectType) } - 筛选根节点参数
- **selector** { [PickupSelector](dataTypes#pickupselector) } - 混合选择器参数
- **compass** { [DetectCompass](dataTypes#detectcompass) } - 控件罗盘参数
- <ins>**returns**</ins> { [any](dataTypes#any) } - 筛选结果

以 `root` 参数指定的控件为根节点, 对 `selector.findOnce()` 进行 [罗盘定位](uiObjecttype#m-compass).

```js
let w = text('abc').findOnce();
pickup(w, 'xyz', 'p2'); /* 在 w 控件的所有子孙节点中筛选内容为 'xyz' 的控件的二级父节点. */
```

> 参阅: [pickup(selector, compass)](#pickupselector-compass)

### pickup(root, selector, compass, result)

**`6.2.0`** **`Global`** **`Overload 9/17`** **`A11Y`**

- **root** { [UiObject](uiObjectType) } - 筛选根节点参数
- **selector** { [PickupSelector](dataTypes#pickupselector) } - 混合选择器参数
- **compass** { [DetectCompass](dataTypes#detectcompass) } - 控件罗盘参数
- **result** { [PickupResult](dataTypes#pickupresult) } - 结果筛选参数
- <ins>**returns**</ins> { [any](dataTypes#any) } - 筛选结果

以 `root` 参数指定的控件为根节点, 对 `selector.findOnce()` 进行 [罗盘定位](uiObjecttype#m-compass) 后, 再进行 [结果筛选](dataTypes#pickupresult) 或 [参化调用](dataTypes#uiobjectinvokable).

```js
let w = text('abc').findOnce();
pickup(w, 'xyz', 'p2', 'width'); /* 在 w 控件的所有子孙节点中筛选内容为 'xyz' 的控件的二级父节点的宽度. */
```

> 参阅: [pickup(selector, compass, result)](#pickupselector-compass-result)

### pickup(selector, callback)

**`6.2.0`** **`Global`** **`Overload 10/17`** **`A11Y`**

- **selector** { [PickupSelector](dataTypes#pickupselector) } - 混合选择器参数
- **callback** { [(](dataTypes#function)o: [any](dataTypes#any)[)](dataTypes#function) [=>](dataTypes#function) [R](dataTypes#generic) } - 筛选回调参数
- <ins>**returns**</ins> { [R](dataTypes#generic) }

对 [pickup(selector)](#pickupselector) 增加回调处理, 将回调函数的返回值 (`undefined` 除外) 作为最终结果. 当回调函数返回 `undefined` 时, 则将拾取器的结果作为最终结果.

```js
pickup(text('abc'), (o) => {
    if (o !== null) {
        console.log(`已找到所需控件, 其文本为${o.text()}`);
        return o.text();
    } else {
        console.warn(`未找到所需控件`);
        return '';
    }
}); /* pickup 的结果可能为所需控件文本或空字符串. */
```

### pickup(selector, result, callback)

**`6.2.0`** **`Global`** **`Overload 11/17`** **`A11Y`**

- **selector** { [PickupSelector](dataTypes#pickupselector) } - 混合选择器参数
- **result** { [PickupResult](dataTypes#pickupresult) } - 结果筛选参数
- **callback** { [(](dataTypes#function)o: [any](dataTypes#any)[)](dataTypes#function) [=>](dataTypes#function) [R](dataTypes#generic) } - 筛选回调参数
- <ins>**returns**</ins> { [any](dataTypes#any) } - 筛选结果

对 [pickup(selector, result)](#pickupselector-result) 增加回调处理, 将回调函数的返回值 (`undefined` 除外) 作为最终结果. 当回调函数返回 `undefined` 时, 则将拾取器的结果作为最终结果.

```js
pickup(clickable(true), 'point', (o) => {
    if (o !== null) {
        console.log(`已找到控件, 其中心位于坐标${o}`);
        return o;
    }
    return org.opencv.core.Point();
}); /* pickup 返回控件真实坐标点或坐标点 (0, 0) . */
```

### pickup(selector, compass, callback)

**`6.2.0`** **`Global`** **`Overload 12/17`** **`A11Y`**

- **selector** { [PickupSelector](dataTypes#pickupselector) } - 混合选择器参数
- **compass** { [DetectCompass](dataTypes#detectcompass) } - 控件罗盘参数
- **callback** { [(](dataTypes#function)o: [any](dataTypes#any)[)](dataTypes#function) [=>](dataTypes#function) [R](dataTypes#generic) } - 筛选回调参数
- <ins>**returns**</ins> { [any](dataTypes#any) } - 筛选结果

对 [pickup(selector, compass)](#pickupselector-compass) 增加回调处理, 将回调函数的返回值 (`undefined` 除外) 作为最终结果. 当回调函数返回 `undefined` 时, 则将拾取器的结果作为最终结果.

```js
pickup(text('abc'), 'p3', (o) => {
    if (o !== null && o.childCount() > 0) {
        o.children().forEach(w => w.setText('hello'));
    }
}); /* pickup 结果为原本的拾取结果. */
```

### pickup(selector, compass, result, callback)

**`6.2.0`** **`Global`** **`Overload 13/17`** **`A11Y`**

- **selector** { [PickupSelector](dataTypes#pickupselector) } - 混合选择器参数
- **compass** { [DetectCompass](dataTypes#detectcompass) } - 控件罗盘参数
- **result** { [PickupResult](dataTypes#pickupresult) } - 结果筛选参数
- **callback** { [(](dataTypes#function)o: [any](dataTypes#any)[)](dataTypes#function) [=>](dataTypes#function) [R](dataTypes#generic) } - 筛选回调参数
- <ins>**returns**</ins> { [any](dataTypes#any) } - 筛选结果

以 `root` 参数指定的控件为根节点, 对 [pickup(selector, compass, result)](#pickupselector-compass-result) 增加回调处理, 将回调函数的返回值 (`undefined` 除外) 作为最终结果. 当回调函数返回 `undefined` 时, 则将拾取器的结果作为最终结果.

### pickup(root, selector, callback)

**`6.2.0`** **`Global`** **`Overload 14/17`** **`A11Y`**

- **root** { [UiObject](uiObjectType) } - 筛选根节点参数
- **selector** { [PickupSelector](dataTypes#pickupselector) } - 混合选择器参数
- **callback** { [(](dataTypes#function)o: [any](dataTypes#any)[)](dataTypes#function) [=>](dataTypes#function) [R](dataTypes#generic) } - 筛选回调参数
- <ins>**returns**</ins> { [R](dataTypes#generic) }

对 [pickup(selector)](#pickupselector) 增加回调处理, 将回调函数的返回值 (`undefined` 除外) 作为最终结果. 当回调函数返回 `undefined` 时, 则将拾取器的结果作为最终结果.

```js
/* w 将作为根节点. */
/* 也可使用 pickup({descMatch: /hello?.+/}) 替换. */
let w = descMatch(/hello?.+/).findOnce();

pickup(w, text('abc'), (o) => {
    if (o !== null) {
        console.log(`已找到所需控件, 其文本为${o.text()}`);
        return o.text();
    } else {
        console.warn(`未找到所需控件`);
        return '';
    }
}); /* pickup 的结果可能为所需控件文本或空字符串. */
```

### pickup(root, selector, result, callback)

**`6.2.0`** **`Global`** **`Overload 15/17`** **`A11Y`**

- **root** { [UiObject](uiObjectType) } - 筛选根节点参数
- **selector** { [PickupSelector](dataTypes#pickupselector) } - 混合选择器参数
- **result** { [PickupResult](dataTypes#pickupresult) } - 结果筛选参数
- **callback** { [(](dataTypes#function)o: [any](dataTypes#any)[)](dataTypes#function) [=>](dataTypes#function) [R](dataTypes#generic) } - 筛选回调参数
- <ins>**returns**</ins> { [any](dataTypes#any) } - 筛选结果

以 `root` 参数指定的控件为根节点, 对 [pickup(selector, result)](#pickupselector-result) 增加回调处理, 将回调函数的返回值 (`undefined` 除外) 作为最终结果. 当回调函数返回 `undefined` 时, 则将拾取器的结果作为最终结果.

```js
/* w 将作为根节点. */
/* 也可使用 pickup({descMatch: /hello?.+/}) 替换. */
let w = descMatch(/hello?.+/).findOnce();

pickup(w, clickable(true), 'point', (o) => {
    if (o !== null) {
        console.log(`已找到控件, 其中心位于坐标${o}`);
        return o;
    }
    return org.opencv.core.Point();
}); /* pickup 返回控件真实坐标点或坐标点 (0, 0) . */
```

### pickup(root, selector, compass, callback)

**`6.2.0`** **`Global`** **`Overload 16/17`** **`A11Y`**

- **root** { [UiObject](uiObjectType) } - 筛选根节点参数
- **selector** { [PickupSelector](dataTypes#pickupselector) } - 混合选择器参数
- **compass** { [DetectCompass](dataTypes#detectcompass) } - 控件罗盘参数
- **callback** { [(](dataTypes#function)o: [any](dataTypes#any)[)](dataTypes#function) [=>](dataTypes#function) [R](dataTypes#generic) } - 筛选回调参数
- <ins>**returns**</ins> { [any](dataTypes#any) } - 筛选结果

以 `root` 参数指定的控件为根节点, 对 [pickup(selector, compass)](#pickupselector-compass) 增加回调处理, 将回调函数的返回值 (`undefined` 除外) 作为最终结果. 当回调函数返回 `undefined` 时, 则将拾取器的结果作为最终结果.

```js
/* w 将作为根节点. */
/* 也可使用 pickup({descMatch: /hello?.+/}) 替换. */
let w = descMatch(/hello?.+/).findOnce();

pickup(w, text('abc'), 'p3', (o) => {
    if (o !== null && o.childCount() > 0) {
        o.children().forEach(w => w.setText('hello'));
    }
}); /* pickup 结果为原本的拾取结果. */
```

### pickup(root, selector, compass, result, callback)

**`6.2.0`** **`Global`** **`Overload 17/17`** **`A11Y`**

- **root** { [UiObject](uiObjectType) } - 筛选根节点参数
- **selector** { [PickupSelector](dataTypes#pickupselector) } - 混合选择器参数
- **compass** { [DetectCompass](dataTypes#detectcompass) } - 控件罗盘参数
- **result** { [PickupResult](dataTypes#pickupresult) } - 结果筛选参数
- **callback** { [(](dataTypes#function)o: [any](dataTypes#any)[)](dataTypes#function) [=>](dataTypes#function) [R](dataTypes#generic) } - 筛选回调参数
- <ins>**returns**</ins> { [any](dataTypes#any) } - 筛选结果

以 `root` 参数指定的控件为根节点, 对 [pickup(selector, compass, result)](#pickupselector-compass-result) 增加回调处理, 将回调函数的返回值 (`undefined` 除外) 作为最终结果. 当回调函数返回 `undefined` 时, 则将拾取器的结果作为最终结果.

```js
/* w 将作为根节点. */
/* 也可使用 pickup({descMatch: /hello?.+/}) 替换. */
let w = descMatch(/hello?.+/).findOnce();

pickup(w, text('abc'), 's>1', 'bounds', (o) => {
    if (o === null) {
        throw Error('获取控件矩形失败, 请确保前台页面符合需求.');
    }
}); /* 如果没有异常, pickup 结果为原本的拾取结果. */
```

---

# 选择器行为

通常执行控件行为时, 按以下过程进行:

```text
构建选择器 - 筛选 (查找) - 对结果 (控件或集合) 执行行为
```

而选择器行为的过程:

```text
构建选择器 - 执行行为
```

## 执行原理

选择器行为隐含默认的筛选过程, 即 [untilFind](#m-untilfind).

例如 `text('abc').click()`, 相当于 `text('abc').untilFind().click()`.

## 谨慎使用

与选择器行为相关的全局方法, 均不建议使用. 原因如下.

1. **潜在的永久阻塞风险**

   因 `untilFind` 方法具有阻塞特性, 意味着此方法可能导致脚本 **永久阻塞**.  
   如上述示例, `text('abc')` 不存在时, 脚本将持续阻塞.

2. **全局行为缺少针对性**

   以 `paste()` 为例.  
   当使用全局方法 `paste()` 时, 相当于 `untilFind().paste()`, `untilFind()` 前无筛选条件, 因此 `untilFind()` 将得到窗口全部控件的集合.  
   这样的集合往往有几十甚至几百个控件, 再执行 `paste()` 时, 集合中的所有控件全部执行一次 `paste()`.  
   这样的操作往往是非预期且耗时的, 因此不建议使用 `paste()` 这样的全局方法, 推荐使用具体且尽量可控的筛选器筛选出特定的控件或集合, 再有针对性地执行 `paste()` 操作.

---

# 筛选器类型

## xxxStartsWith

前缀匹配筛选器.

筛选条件为 [字符串](dataTypes#string) 类型, 匹配对应控件属性串值的前缀.

```js
w.desc(); // splendid
descStartsWith('spl'); /* 可匹配 w. */
descStartsWith('spa'); /* 不可匹配 w. */
```

## xxxEndsWith

后缀匹配筛选器.

筛选条件为 [字符串](dataTypes#string) 类型, 匹配对应控件属性串值的后缀.

```js
w.desc(); // splendid
descEndsWith('did'); /* 可匹配 w. */
descEndsWith('diy'); /* 不可匹配 w. */
```

## xxxContains

包含匹配筛选器.

筛选条件为 [字符串](dataTypes#string) 类型, 匹配任意长度连续的控件属性串值.

```js
w.desc(); // splendid
descContains('did'); /* 可匹配 w. */
descContains('spl'); /* 可匹配 w. */
descContains('len'); /* 可匹配 w. */
descContains(''); /* 可匹配 w, 但通常无实际意义. */
descContains('app'); /* 不可匹配 w. */
```

## xxxMatches

正则全匹配筛选器.

筛选条件为 [字符串](dataTypes#string) 类型或 [正则表达式](dataTypes#regexp) 类型, 按正则表达式规则完全匹配控件属性串值.

### 正则表达式类型

筛选条件为正则表达式类型时, 效果等同于 JavaScript 的 [RegExp.prototype.test](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test), 但依照起止位置做完全匹配, 相当于自动添加匹配起始位置的 `^` 与匹配结束位置的 `$`.

```js
w.desc(); // splendid
/* 相当于 descMatch(/^s.*did$/) . */
descMatches(/s.*did/); /* 不可匹配 w. */
/* 相当于 descMatch(/^did$/) . */
descMatches(/did/); /* 不可匹配 w. */
/* 相当于 descMatch(/^did$/) . */
descMatches(/did$/); /* 不可匹配 w. */
/* 相当于 descMatch(/^did$/) . */
descMatches(/^did/); /* 不可匹配 w. */
/* 相当于 descMatch(/^.*did.*$/) . */
descMatches(/.*did.*/); /* 可匹配 w. */
/* 相当于 descMatch(/^l[ae]ng?$/) . */
descMatches(/l[ae]ng?/); /* 不可匹配 w. */
/* 相当于 descMatch(/^.+$/) . */
descMatches(/.+/); /* 可匹配 w. */
/* 相当于 descMatch(/^(?:)$/) . */
descMatches(/(?:)/); /* 不可匹配 w. */
/* 相当于 descMatch(/^spl\.?.+$/) . */
descMatches(new RegExp('spl\\.?.+$')); /* 不可匹配 w. */
```

### 字符串类型

筛选条件为字符串类型时, 相当于 JavaScript 的 [RegExp.prototype.constructor](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/RegExp) 构造函数的 `pattern (模式)` 参数, 但依照起止位置做完全匹配, 相当于自动添加匹配起始位置的 `^` 与匹配结束位置的 `$`.

如字符串 `'abc'` 按照正则表达式 `/^abc$/` 处理,  
字符串 `'\\d+'` 按照正则表达式 `/^\d+$/` 处理.

```js
w.desc(); // splendid
/* 相当于 descMatch(/^s.*did$/) . */
descMatches('s.*did'); /* 不可匹配 w. */
/* 相当于 descMatch(/^did$/) . */
descMatches('did'); /* 不可匹配 w. */
/* 相当于 descMatch(/^did$/) . */
descMatches('did$'); /* 不可匹配 w. */
/* 相当于 descMatch(/^did$/) . */
descMatches('^did'); /* 不可匹配 w. */
/* 相当于 descMatch(/^.*did.*$/) . */
descMatches('.*did.*'); /* 可匹配 w. */
/* 相当于 descMatch(/^l[ae]ng?$/) . */
descMatches('l[ae]ng?'); /* 不可匹配 w. */
/* 相当于 descMatch(/^.+$/) . */
descMatches('.+'); /* 可匹配 w. */
/* 相当于 descMatch(/^$/) . */
descMatches(''); /* 不可匹配 w. */
/* 相当于 descMatch(/^spl\.?.+$/) . */
descMatches('spl\\.?.+$'); /* 不可匹配 w. */
```

对于 xxxMatches, 会经常出现类似如下的匹配方式:

```js
/* 相当于 descMatch(/^.*word.*$/) . */
xxxMatches(/.*word.*/); /* 或 xxxMatches('.*word.*') . */
```

而对于 xxxMatch, 其匹配方式往往更符合 JavaScript 开发者的使用习惯:

```js
xxxMatch(/word/);
```

方法 xxxMatches 的内部实现采用 Java [matches](https://docs.oracle.com/javase/7/docs/api/java/lang/String.html#matches(java.lang.String)), 它与 JavaScript [match](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/match) 的不同导致上述使用方式的差异.

因此在 AutoJs6 中, xxxMatches 的全部方法均已标记为 `Deprecated (已弃用)`, 除非需要考虑多版本兼容, 否则建议始终使用 xxxMatch 替代 xxxMatches.

> 参阅: [Difference in results between Java matches vs JavaScript match](https://stackoverflow.com/questions/21883629/difference-in-results-between-java-matches-vs-javascript-match)

## xxxMatch

正则匹配筛选器.

筛选条件为 [字符串](dataTypes#string) 类型或 [正则表达式](dataTypes#regexp) 类型, 按正则表达式规则匹配控件属性串值.

### 正则表达式类型

筛选条件为正则表达式类型时, 效果等同于 JavaScript 的 [RegExp.prototype.test](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test).

```js
w.desc(); // splendid
descMatch(/s.*did/); /* 可匹配 w. */
descMatch(/did/); /* 可匹配 w. */
descMatch(/did$/); /* 可匹配 w. */
descMatch(/^did/); /* 不可匹配 w. */
descMatch(/l[ae]ng?/); /* 可匹配 w. */
descMatch(/.+/); /* 可匹配 w, 与 descMatch(/(?:)/) 效果相同. */
descMatch(new RegExp('spl\\.?.+$')); /* 可匹配 w. */
```

筛选条件为正则表达式类型时, 支持 [修饰符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions#%E9%80%9A%E8%BF%87%E6%A0%87%E5%BF%97%E8%BF%9B%E8%A1%8C%E9%AB%98%E7%BA%A7%E6%90%9C%E7%B4%A2) (又称 `标志`):

```js
w.desc(); // AutoJs6
descMatch(/autojs6/i); /* 可匹配 w. */
descMatch(new RegExp('autojs6', 'i')); /* 可匹配 w. */
```

> 注: 截至 2022 年 12 月, 支持的修饰符仅包含 'i'.

### 字符串类型

筛选条件为字符串类型时, 相当于 JavaScript 的 [RegExp.prototype.constructor](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/RegExp) 构造函数的 `pattern (模式)` 参数.

如字符串 `'abc'` 按照正则表达式 `/abc/` 处理,  
字符串 `'\\d+'` 按照正则表达式 `/\d+/` 处理.

```js
w.desc(); // splendid
/* 相当于 descMatch(/s.*did/) . */
descMatch('s.*did'); /* 可匹配 w. */
/* 相当于 descMatch(/did/) . */
descMatch('did'); /* 可匹配 w. */
/* 相当于 descMatch(/did$/) . */
descMatch('did$'); /* 可匹配 w. */
/* 相当于 descMatch(/^did/) . */
descMatch('^did'); /* 不可匹配 w. */
/* 相当于 descMatch(/l[ae]ng?/) . */
descMatch('l[ae]ng?'); /* 可匹配 w. */
/* 相当于 descMatch(/.+/) . */
descMatch('.+'); /* 可匹配 w, 与 descMatch('') 效果相同. */
/* 相当于 descMatch(/spl\.?.+$/) . */
descMatch('spl\\.?.+$'); /* 可匹配 w. */
```

# 链式特性

链式调用可以构建出多条件筛选的选择器:

```js
let sel = text("立即开始").minHeight(0.2).clickable(true);
let w = sel.findOnce();
if (w !== null) { /* ... */ }
```

但需特别留意, 上述示例 `sel` 变量是 `可变的 (mutable)`:

```js
let sel = text("立即开始").minHeight(0.2).clickable(true);

let wA = sel.findOnce();
if (wA != null) { /* ... */}
console.log(sel); // text("立即开始").minHeight(0.2).clickable(true)

let wB = sel.descMatch(/\w+/).findOnce();
if (wB != null) { /* ... */}
console.log(sel); // text("立即开始").minHeight(0.2).clickable(true).descMatch(/\w+/)

let wC = sel.findOnce();
if (wC != null) { /* ... */}
console.log(sel); // text("立即开始").minHeight(0.2).clickable(true).descMatch(/\w+/)
```

上述示例中, `wB` 变量赋值时, `sel.descMatch(/\w+/)` 使得 `sel` 发生改变.

此时的 `sel` 相当于是 `text("立即开始").minHeight(0.2).clickable(true).sel.descMatch(/\w+/)`.

因此 `wC` 与 `wA` 虽然使用了同样赋值语句, 但它们的 `sel` 并不相同.

将语句 `let wB = sel.descMatch(/\w+/).findOnce()`  
修改为 `let wB = sel.plus(descMatch(/\w+/)).findOnce()`  
即可保持 `sel` 变量不变.  

关于选择器的拼接, 可参阅 [plus](#m-plus) 与 [append](#m-append) 方法小节.