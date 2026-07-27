# 拼音 (Pinyin)

pinyin 模块用于将汉字转换为拼音, 并支持声调格式, 姓氏模式, 地名模式, 分词和多音字等选项.

此模块自 AutoJs6 6.6.1 起提供. `pinyin` 与 `$pinyin` 指向同一个可调用模块对象.

自 AutoJs6 6.8.0 起, pinyin 转换由外置 Pinyin 插件提供. 调用转换方法前, 必须安装并启用与当前 AutoJs6 版本兼容的 Pinyin 插件. 未发现可用插件引擎时, 调用将抛出异常.

---

<p style="font: bold 2em sans-serif; color: #FF7043">pinyin</p>

---

## [@] pinyin

### pinyin(hans, options?)

**`6.6.1`** **`[6.8.0]`** **`Overload [1-2]/2`**

- **hans** { [string](dataTypes#string) } - 待转换文本
- **[ options = `{}` ]** { [PinyinOptions](#pinyinoptions) } - 转换选项
- <ins>**returns**</ins> { [PinyinResult](#pinyinresult) } - 二维拼音结果

将文本转换为拼音.

此调用与 [pinyin.convert(hans, options?)](#m-convert) 等价.

```js
let result = pinyin('重庆', {
    style: pinyin.STYLE_TONE,
    heteronym: true,
});

console.log(result);
```

## [p] STYLE_NORMAL

**`6.6.1`** **`CONSTANT`**

- { [PinyinStyle](#pinyinstyle) }

不标注声调的拼音风格, 对应数值 `0` 和名称 `NORMAL`.

## [p] STYLE_TONE

**`6.6.1`** **`CONSTANT`**

- { [PinyinStyle](#pinyinstyle) }

使用带声调字符的拼音风格, 对应数值 `1` 和名称 `TONE`.

这是 [PinyinOptions#style](#p-pinyinoptions-style) 的默认值.

## [p] STYLE_TONE2

**`6.6.1`** **`CONSTANT`**

- { [PinyinStyle](#pinyinstyle) }

在音节末尾使用数字声调的拼音风格, 对应数值 `2` 和名称 `TONE2`.

## [p] STYLE_TO3NE

**`6.6.1`** **`CONSTANT`**

- { [PinyinStyle](#pinyinstyle) }

使用数字声调的 `TO3NE` 拼音风格, 对应数值 `5` 和名称 `TO3NE`.

`TO3NE` 是当前公开常量和选项名称的实际拼写.

## [p] STYLE_INITIALS

**`6.6.1`** **`CONSTANT`**

- { [PinyinStyle](#pinyinstyle) }

仅保留声母的拼音风格, 对应数值 `3` 和名称 `INITIALS`.

## [p] STYLE_FIRST_LETTER

**`6.6.1`** **`CONSTANT`**

- { [PinyinStyle](#pinyinstyle) }

仅保留首字母的拼音风格, 对应数值 `4` 和名称 `FIRST_LETTER`.

## [p] MODE_NORMAL

**`6.6.1`** **`CONSTANT`**

- { [PinyinMode](#pinyinmode) }

普通转换模式, 对应数值 `0` 和名称 `NORMAL`.

这是 [PinyinOptions#mode](#p-pinyinoptions-mode) 的默认值.

## [p] MODE_SURNAME

**`6.6.1`** **`CONSTANT`**

- { [PinyinMode](#pinyinmode) }

姓氏转换模式, 对应数值 `1` 和名称 `SURNAME`.

## [p] MODE_PLACENAME

**`6.6.1`** **`CONSTANT`**

- { [PinyinMode](#pinyinmode) }

地名转换模式, 对应数值 `2` 和名称 `PLACE_NAME`.

此属性与 [MODE_PLACE_NAME](#p-mode-place-name) 指向同一个常量.

## [p] MODE_PLACE_NAME

**`6.6.1`** **`CONSTANT`**

- { [PinyinMode](#pinyinmode) }

地名转换模式, 对应数值 `2` 和名称 `PLACE_NAME`.

此属性与 [MODE_PLACENAME](#p-mode-placename) 指向同一个常量.

## [m] convert

### convert(hans, options?)

**`6.6.1`** **`[6.8.0]`** **`Overload [1-2]/2`**

- **hans** { [string](dataTypes#string) } - 待转换文本
- **[ options = `{}` ]** { [PinyinOptions](#pinyinoptions) } - 转换选项
- <ins>**returns**</ins> { [PinyinResult](#pinyinresult) } - 二维拼音结果

将文本转换为拼音.

空字符串返回空数组. 插件返回的数据会被解析为二维字符串数组. 外层分组方式受 `segment`, `heteronym` 和 `group` 等选项及插件实现影响.

返回数组带有一个不可枚举的 `compact()` 方法. 此方法计算各内层候选项的组合, 并返回组合后的二维字符串数组.

```js
let result = pinyin.convert('你好', {
    style: pinyin.STYLE_TONE2,
});

console.log(result);
console.log(result.compact());
```

## [m] simple

### simple(str, enableNumericTone?, enableSegment?)

**`6.6.1`** **`[6.8.0]`** **`Overload [1-3]/3`**

- **str** { [string](dataTypes#string) } - 待转换文本
- **[ enableNumericTone = `false` ]** { [boolean](dataTypes#boolean) } - 是否使用数字声调
- **[ enableSegment = `false` ]** { [boolean](dataTypes#boolean) } - 是否启用分词
- <ins>**returns**</ins> { [string](dataTypes#string) } - 拼音转换结果

使用简化选项将文本转换为拼音字符串.

```js
console.log(pinyin.simple('你好'));
console.log(pinyin.simple('你好', true));
```

## [m] fromCodePoint

### fromCodePoint(codePoint)

**`6.6.1`** **`[6.8.0]`**

- **codePoint** { [number](dataTypes#number) } - Unicode 代码点
- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - 插件中的拼音记录, 无记录时为 `null`

查询单个 Unicode 代码点对应的拼音记录.

## [m] fromPhrase

### fromPhrase(phrase)

**`6.6.1`** **`[6.8.0]`**

- **phrase** { [string](dataTypes#string) } - 待查询词组
- <ins>**returns**</ins> { [string](dataTypes#string)[[]](dataTypes#array)[[]](dataTypes#array) } - 二维拼音结果

查询插件词组数据中的拼音结果.

插件返回的空字符串会被转换为空数组.

---

## PinyinOptions

pinyin 转换选项.

### [p] PinyinOptions#mode

- [ `pinyin.MODE_NORMAL` ] { [PinyinMode](#pinyinmode) | [number](dataTypes#number) | [string](dataTypes#string) }

转换模式.

可使用模块常量, 数值 `0`, `1`, `2`, 或不区分大小写的名称 `NORMAL`, `SURNAME`, `PLACE_NAME`, `PLACENAME`.

### [p] PinyinOptions#style

- [ `pinyin.STYLE_TONE` ] { [PinyinStyle](#pinyinstyle) | [number](dataTypes#number) | [string](dataTypes#string) }

拼音风格.

可使用模块常量, 数值 `0` 到 `5`, 或不区分大小写的名称 `NORMAL`, `TONE`, `TONE2`, `TO3NE`, `INITIALS`, `FIRST_LETTER`.

数值必须对应一个已定义风格. 无效数值或名称会抛出异常.

### [p] PinyinOptions#segment

- [ `false` ] { [boolean](dataTypes#boolean) }

是否请求插件在转换前执行分词.

### [p] PinyinOptions#heteronym

- [ `false` ] { [boolean](dataTypes#boolean) }

是否保留多音字候选项.

### [p] PinyinOptions#group

- [ `false` ] { [boolean](dataTypes#boolean) }

是否启用插件的结果分组选项. 具体分组结果由当前 Pinyin 插件实现决定.

## PinyinResult

- { [string](dataTypes#string)[[]](dataTypes#array)[[]](dataTypes#array) }

二维拼音数组. 每个内层数组保存对应文本单元或分组的一个或多个拼音候选项.

结果对象还提供不可枚举的 `compact()` 方法:

```js
let result = pinyin('海前', {
    heteronym: true,
    style: pinyin.STYLE_NORMAL,
});

let combinations = result.compact();
console.log(combinations);
```

`compact()` 对各内层数组执行笛卡尔组合, 返回值仍为二维字符串数组.

## PinyinStyle

pinyin 模块公开的拼音风格枚举类型. 可通过 `STYLE_NORMAL`, `STYLE_TONE`, `STYLE_TONE2`, `STYLE_TO3NE`, `STYLE_INITIALS` 和 `STYLE_FIRST_LETTER` 常量取得.

## PinyinMode

pinyin 模块公开的转换模式枚举类型. 可通过 `MODE_NORMAL`, `MODE_SURNAME`, `MODE_PLACENAME` 和 `MODE_PLACE_NAME` 常量取得.
