# Pinyin4j

pinyin4j 模块用于将中文转换为拼音字符串, 查询逐 Unicode 码点的全部读音, 并控制分隔符, 大小写, 声调和 `v` 字符格式.

此模块自 AutoJs6 6.6.1 起提供. `pinyin4j` 与 `$pinyin4j` 指向同一个可调用模块对象.

自 AutoJs6 6.8.0 起, pinyin4j 转换由外置 Pinyin4j 插件提供. 调用转换方法前, 必须安装并启用与当前 AutoJs6 版本兼容的 Pinyin4j 插件. 未发现可用插件引擎时, 调用将抛出异常.

同版本起, Node.js Runtime 可通过公开的 `autojs6:bridge` facade 调用相同的插件能力, 详见 [Node.js Runtime](#nodejs-runtime).

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

## [m] readings

### readings(source, options?)

**`6.8.0`** **`Overload [1-2]/2`**

- **source** { [string](dataTypes#string) } - 待读取全部读音的文本
- **[ options ]** { [Pinyin4jReadingsOptions](#pinyin4jreadingsoptions) } - 多读音与罗马化选项
- <ins>**returns**</ins> { [string](dataTypes#string)[][] } - 与源文本 Unicode 码点逐项对应的候选读音矩阵

查询每个 Unicode 码点的全部候选读音. 返回矩阵的每个内层数组对应源文本中的一个 Unicode 码点, 因而代理对表示的补充平面字符也只占一行. 汉字以外的字符通常原样保留为单候选行.

默认使用 Hanyu Pinyin, 数字声调, 小写字母和 `v` 字符. 与 [of(source, options?)](#m-of) 不同, 此方法不接受分隔符, 且默认保留数字声调.

```js
console.log(pinyin4j.readings('重A𠀀'));
// [ [ 'zhong4', 'chong2' ], [ 'A' ], [ '𠀀' ] ]

console.log(pinyin4j.readings('好', {
    tone: 'MARK',
    case: 'UPPERCASE',
}));
// [ [ 'HǍO', 'HÀO' ] ]

console.log(pinyin4j.readings('间', {
    system: 'WADE_GILES',
}));
// [ [ 'chien1', 'chien4' ] ]
```

宿主通过插件 capability `pinyin4j.readings.version` 协商原生多读音事务. 对未声明该 capability 的旧版插件, Hanyu Pinyin 请求会安全回退为逐码点的单候选结果; 其他罗马化体系会直接抛出异常并提示升级插件, 不会静默返回错误体系.

为限制 Binder 和 JSON 传输开销, 源文本最多包含 16,384 个 Unicode 码点, 返回 JSON 最多为 512 KiB, 每个码点最多包含 64 个候选读音, 每个候选最多包含 64 个 Unicode 码点. 插件返回的矩阵行数, 元素类型或上述限制不合法时, 宿主会拒绝结果.

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

---

## Pinyin4jReadingsOptions

[readings(source, options?)](#m-readings) 使用的多读音选项.

### [p] Pinyin4jReadingsOptions#romanization

- [ `'HANYU'` ] { [string](dataTypes#string) }

罗马化体系.

别名为 `system`. 名称不区分大小写, 连字符和空格会按下划线处理. 支持以下值:

- `HANYU`, `HANYU_PINYIN`, `PINYIN`: Hanyu Pinyin
- `TONGYONG`, `TONGYONG_PINYIN`: Tongyong Pinyin
- `WADE`, `WADE_GILES`, `WADEGILES`, `WADE_GILES_PINYIN`: Wade-Giles
- `MPS2`, `MANDARIN_PHONETIC_SYMBOLS_2`: Mandarin Phonetic Symbols II
- `YALE`, `YALE_PINYIN`: Yale romanization
- `GWOYEU`, `GWOYEU_ROMATZYH`, `GR`: Gwoyeu Romatzyh

### [p] Pinyin4jReadingsOptions#tone

- [ `'WITH_TONE_NUMBER'` ] { [string](dataTypes#string) }

Hanyu Pinyin 的声调格式. 别名和可选值与 [Pinyin4jOptions#tone](#p-pinyin4joptions-tone) 相同.

此选项仅适用于 `HANYU`. 对其他罗马化体系显式传入此选项会抛出异常.

### [p] Pinyin4jReadingsOptions#case

- [ `'LOWERCASE'` ] { [string](dataTypes#string) }

Hanyu Pinyin 的字母大小写格式. 别名和可选值与 [Pinyin4jOptions#case](#p-pinyin4joptions-case) 相同.

此选项仅适用于 `HANYU`. 对其他罗马化体系显式传入此选项会抛出异常.

### [p] Pinyin4jReadingsOptions#v

- [ `'WITH_V'` ] { [string](dataTypes#string) }

Hanyu Pinyin 的韵母 `v` 输出格式. 别名和可选值与 [Pinyin4jOptions#v](#p-pinyin4joptions-v) 相同. 当 `tone` 为 `WITH_TONE_MARK` 时, 默认值改为 `WITH_U_UNICODE`.

此选项仅适用于 `HANYU`. 对其他罗马化体系显式传入此选项会抛出异常.

---

## Node.js Runtime

**`6.8.0`**

Node.js 脚本不注入 Rhino 的 `pinyin4j` 全局对象. 请通过 Node.js Runtime 内置的公开 `autojs6:bridge` facade 调用宿主 provider, 并为每次请求显式声明 `pinyin4j` capability:

```js
const { callAutoJs } = require('autojs6:bridge');

(async () => {
    const result = await callAutoJs(
        'pinyin4j',
        'readings',
        [ '重A𠀀', { system: 'HANYU' } ],
        { permissions: [ 'pinyin4j' ] },
    );

    console.log(result);
    // [ [ 'zhong4', 'chong2' ], [ 'A' ], [ '𠀀' ] ]
})();
```

`pinyin4j` provider 开放下列异步桥接方法. `args` 数组中的位置参数与同名 Rhino 方法一致, 返回值会从严格 JSON 解码为普通 Node.js 值:

| method | args | result |
| --- | --- | --- |
| `of` | `[ source, options? ]` | `string` |
| `as` | `[ source ]` | `string` |
| `readings` | `[ source, options? ]` | `string[][]` |

请求由宿主执行 capability, JSON 大小和调用配额校验, 最终转换由当前选择的外置 Pinyin4j 插件完成. 未声明 `pinyin4j` capability, 未安装兼容插件, 参数不合法或矩阵超限时, Promise 会以对应的 bridge 错误拒绝.
