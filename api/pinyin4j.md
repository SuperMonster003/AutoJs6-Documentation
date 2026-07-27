# Pinyin4j

pinyin4j 模块用于将中文转换为拼音字符串, 并控制分隔符, 大小写, 声调和 `v` 字符格式.

此模块自 AutoJs6 6.6.1 起提供. `pinyin4j` 与 `$pinyin4j` 指向同一个可调用模块对象.

自 AutoJs6 6.8.0 起, pinyin4j 转换由外置 Pinyin4j 插件提供. 调用转换方法前, 必须安装并启用与当前 AutoJs6 版本兼容的 Pinyin4j 插件. 未发现可用插件引擎时, 调用将抛出异常.

---

<p style="font: bold 2em sans-serif; color: #FF7043">pinyin4j</p>

---

## [@] pinyin4j

### pinyin4j(source, options?)

**`6.6.1`** **`[6.8.0]`** **`Overload [1-2]/2`**

- **source** { [string](dataTypes#string) } - 待转换文本
- **[ options ]** { [string](dataTypes#string) | [Pinyin4jOptions](#pinyin4joptions) } - 分隔符或转换选项
- <ins>**returns**</ins> { [string](dataTypes#string) } - 拼音转换结果

将文本转换为拼音字符串.

当 `options` 是字符串时, 该字符串作为拼音分隔符. 此调用与 [pinyin4j.of(source, options?)](#m-of) 等价.

```js
console.log(pinyin4j('中国', {
    separator: ' ',
    tone: 'WITH_TONE_NUMBER',
})); // zhong1 guo2
```

## [m] of

### of(source, options?)

**`6.6.1`** **`[6.8.0]`** **`Overload [1-2]/2`**

- **source** { [string](dataTypes#string) } - 待转换文本
- **[ options ]** { [string](dataTypes#string) | [Pinyin4jOptions](#pinyin4joptions) } - 分隔符或转换选项
- <ins>**returns**</ins> { [string](dataTypes#string) } - 拼音转换结果

将文本转换为拼音字符串.

空字符串直接返回空字符串, 不调用插件. 当 `options` 是字符串时, 该字符串作为拼音分隔符.

```js
console.log(pinyin4j.of('中国', '-')); // zhong-guo
```

## [m] as

### as(source)

**`6.6.1`** **`[6.8.0]`**

- **source** { [string](dataTypes#string) } - 含数字声调的拼音文本
- <ins>**returns**</ins> { [string](dataTypes#string) } - 使用带声调字符的拼音文本

将数字声调转换为带声调字符.

```js
console.log(pinyin4j.as('zhong1 guo2')); // zhōng guó
```

---

## Pinyin4jOptions

pinyin4j 转换选项. 选项值中的名称不区分大小写, 无效名称会抛出异常.

### [p] Pinyin4jOptions#separator

- [ `''` ] { [string](dataTypes#string) }

拼音项之间的分隔符.

别名为 `sep`.

### [p] Pinyin4jOptions#tone

- [ `'WITHOUT_TONE'` ] { [string](dataTypes#string) }

声调格式.

别名为 `toneType`. 支持以下值:

- `WITH_TONE_NUMBER`, `WITH_NUMBER`, `NUMBER`, `NUM`: 使用数字声调
- `WITHOUT_TONE`, `NO_TONE`, `NO`, `FALSE`, `0`: 不标注声调
- `WITH_TONE_MARK`, `WITH_MARK`, `MARK`, `TRUE`, `1`: 使用带声调字符

### [p] Pinyin4jOptions#case

- [ `'LOWERCASE'` ] { [string](dataTypes#string) }

字母大小写格式.

别名为 `caseType`. 支持以下值:

- `LOWERCASE`, `LOW`, `L`, `0`: 小写
- `UPPERCASE`, `UP`, `U`, `1`: 大写

### [p] Pinyin4jOptions#v

- [ `'WITH_V'` ] { [string](dataTypes#string) }

韵母 `v` 的输出格式.

别名为 `vChar` 和 `vCharType`. 支持以下值:

- `WITH_U_AND_COLON`, `U_AND_COLON`, `U_COLON`, `U:`: 使用 `u:`
- `WITH_V`, `V`: 使用 `v`
- `WITH_U_UNICODE`, `U_UNICODE`, `UNICODE`, `U`, `\u00DC`: 使用 Unicode `U+00DC` 对应字符

当 `tone` 为 `WITH_TONE_MARK` 时, 此选项的默认值改为 `WITH_U_UNICODE`.
