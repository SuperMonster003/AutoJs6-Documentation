# 拼音 (Pinyin)

pinyin 模块用于将汉字转换为拼音, 并支持声调格式, 姓氏模式, 地名模式, 分词, 多音字和单次调用自定义词典等选项.

此模块自 AutoJs6 6.6.1 起提供. `pinyin` 与 `$pinyin` 指向同一个可调用模块对象.

自 AutoJs6 6.8.0 起, pinyin 转换由外置 Pinyin 插件提供. 调用转换方法前, 必须安装并启用与当前 AutoJs6 版本兼容的 Pinyin 插件. 未发现可用插件引擎时, 调用将抛出异常.

同版本起, Node.js Runtime 可通过公开的 `autojs6:bridge` facade 调用相同的插件能力, 详见 [Node.js Runtime](#nodejs-runtime).

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

## [m] compare

### compare(hanA, hanB)

**`6.8.0`**

- **hanA** { [string](dataTypes#string) } - 待比较文本 A
- **hanB** { [string](dataTypes#string) } - 待比较文本 B
- <ins>**returns**</ins> { [number](dataTypes#number) } - A 应排在 B 前时为负数, 顺序相同时为 `0`, A 应排在 B 后时为正数

按拼音比较两段文本, 可直接作为 `Array.prototype.sort` 的比较函数.

实现使用默认 `STYLE_TONE` 选项转换两段文本, 按 JavaScript 嵌套数组的字符串形式连接候选项, 再使用设备当前 locale 的排序规则比较. 返回值只保证符号语义, 不保证固定为 `-1` 或 `1`.

```js
let names = [ '张三', '李四', '王五' ];
names.sort(pinyin.compare);
console.log(names);
```

## [m] compact

### compact(matrix)

**`6.8.0`**

- **matrix** { [PinyinMatrix](#pinyinmatrix) } - 二维候选数组
- <ins>**returns**</ins> { [PinyinMatrix](#pinyinmatrix) } - 各行候选项的笛卡尔组合

展开二维候选数组的全部组合. 此顶层方法与 [PinyinResult#compact](#m-pinyinresult-compact) 使用相同实现; 参数必须是严格的二维数组.

```js
console.log(pinyin.compact([
    [ 'zhòng', 'chóng' ],
    [ 'qìng' ],
]));
// [ [ 'zhòng', 'qìng' ], [ 'chóng', 'qìng' ] ]
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

### [p] PinyinOptions#customDictionary

**`6.8.0`**

- [ `{}` ] { [PinyinCustomDictionary](#pinyincustomdictionary) | [null](dataTypes#null) }

为当前一次 `pinyin` 或 `pinyin.convert` 调用覆盖汉字和词组读音.

对象 key 必须由 1 到 32 个汉字 Unicode code point 组成. value 是与 key 字位数完全一致的二维数组, 每行保存该字位的 1 到 8 个带调候选音节. 候选必须使用 NFC 规范化的小写拉丁字母及受支持的拼音声调字符, 不接受数字声调, 空白, 重复项或其他符号. v1 执行表示形式校验, 不判断候选是否是语言学上存在的普通话音节; 不带声调符号的候选可表示轻声.

自定义词典使用 Unicode code point trie 做最长匹配, 优先级高于 `SURNAME`, `PLACE_NAME`, 内置词组和内置单字. 未命中部分继续使用当前转换模式. 词典只在本次调用内存在, 不写入插件词典, 不跨脚本或调用共享.

v1 边界如下:

- 规范化 JSON 的 UTF-8 大小不超过 64 KiB.
- 词条数不超过 1,024.
- 每个 key 不超过 32 个汉字 code point.
- 每个字位不超过 8 个候选, 每个音节不超过 16 个 code point.
- 单个词条的候选笛卡尔组合不超过 256.

宿主和插件都会执行完整校验. 非空 `customDictionary` 只会发送给声明 `pinyin.customDictionary.v1` capability 的插件; 旧插件会收到明确的更新提示, 不会静默忽略覆盖. 省略, 传入 `null` 或传入空对象时不要求该 capability.

```js
let result = pinyin.convert('六安市', {
    style: 'TONE2',
    customDictionary: {
        '六安': [ [ 'liú' ], [ 'ān' ] ],
        '市': [ [ 'shì' ] ],
    },
});

console.log(result);
// [ [ 'liu2' ], [ 'an1' ], [ 'shi4' ] ]
```

## PinyinCustomDictionary

- { [Object](dataTypes#object) }

单次调用自定义读音词典. 对象结构为 `Record<string, string[][]>`; key 是汉字或词组, value 按 key 的 Unicode 字位排列带调拼音候选数组. 具体格式, 优先级和资源限制见 [PinyinOptions#customDictionary](#p-pinyinoptions-customdictionary).

## PinyinMatrix

- { [string](dataTypes#string)[[]](dataTypes#array)[[]](dataTypes#array) }

二维拼音数组. 每个内层数组保存对应文本单元或分组的一个或多个拼音候选项.

## PinyinResult

- { [PinyinMatrix](#pinyinmatrix) }

由 `pinyin` 或 `pinyin.convert` 返回的二维拼音数组. 除普通数组成员外, 它还带有不可枚举的 `compact()` 方法.

### [m] PinyinResult#compact

#### compact()

**`6.6.1`**

- <ins>**returns**</ins> { [PinyinMatrix](#pinyinmatrix) } - 各行候选项的笛卡尔组合

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

---

## Node.js Runtime

**`6.8.0`**

Node.js 脚本不注入 Rhino 的 `pinyin` 全局对象. 请通过 Node.js Runtime 内置的公开 `autojs6:bridge` facade 调用宿主 provider, 并为每次请求显式声明 `pinyin` capability:

```js
const { callAutoJs } = require('autojs6:bridge');

(async () => {
    const result = await callAutoJs(
        'pinyin',
        'convert',
        [ '中心', { style: 'TONE2' } ],
        { permissions: [ 'pinyin' ] },
    );

    console.log(result);
    // [ [ 'zhong1' ], [ 'xin1' ] ]
})();
```

`pinyin` provider 开放下列异步桥接方法. `args` 数组中的位置参数与同名 Rhino 方法一致, 返回值会从严格 JSON 解码为普通 Node.js 值:

| method | args | result |
| --- | --- | --- |
| `convert` | `[ text, options? ]` | `string[][]` |
| `simple` | `[ text, enableNumericTone?, enableSegment? ]` | `string` |
| `compare` | `[ textA, textB ]` | `number` |
| `compact` | `[ matrix ]` | `string[][]` |
| `fromCodePoint` | `[ codePoint ]` | `string \| null` |
| `fromPhrase` | `[ phrase ]` | `string[][]` |

Node.js 的 `convert` 支持相同的 `customDictionary` 格式和限制. 请求仍由宿主执行权限, JSON 大小和调用配额校验, 最终转换由当前选择的外置 Pinyin 插件完成. 未声明 `pinyin` capability, 未安装兼容插件或词典超限时, Promise 会以对应的 bridge 错误拒绝.

## PinyinStyle

pinyin 模块公开的拼音风格枚举类型. 可通过 `STYLE_NORMAL`, `STYLE_TONE`, `STYLE_TONE2`, `STYLE_TO3NE`, `STYLE_INITIALS` 和 `STYLE_FIRST_LETTER` 常量取得.

## PinyinMode

pinyin 模块公开的转换模式枚举类型. 可通过 `MODE_NORMAL`, `MODE_SURNAME`, `MODE_PLACENAME` 和 `MODE_PLACE_NAME` 常量取得.
