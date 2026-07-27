# 单位转换 (Converter)

`cvt` 模块用于在不同数据单位之间转换数值.

当前模块提供字节单位转换. `cvt` 与 `$cvt` 引用同一个对象.

字节单位支持 `B`, `KB` 到 `QB`, 以及严格模式下对应的 IEC 单位 `KiB` 到 `QiB`. 当目标单位为 `AUTO` 时, 模块会根据数值自动选择单位.

```js
cvt.bytes('1.5 MiB', 'KiB'); // 1536
cvt.bytes.strict('1 KB', 'B'); // 1000
cvt.bytes.strict('1 KiB', 'B'); // 1024
```

## 严格模式与宽松模式

常规调用默认使用宽松模式.

| 模式 | 单位解析 | 换算基数 |
|---|---|---:|
| 宽松 | 不区分大小写, 并将 `KiB` 等 IEC 写法归一化为 `KB` | 1024 |
| 严格 | 区分 SI 单位与 IEC 单位, 如 `KB` 与 `KiB` | `KB` 为 1000, `KiB` 为 1024 |

- [cvt.bytes.strict](#m-strict) 强制使用严格模式.
- [cvt.bytes.loose](#m-loose) 强制使用宽松模式.
- 常规调用可通过 `options.strict` 选择模式.

---

<p style="font: bold 2em sans-serif; color: #FF7043">cvt</p>

---

## [m+] bytes

`cvt.bytes` 是可调用的字节单位转换对象, 同时包含严格模式, 宽松模式和单位常量.

### cvt.bytes(source)

**`6.7.0`** **`Overload 1/5`**

- **source** { [number](dataTypes#number) | [string](dataTypes#string) } - 待转换数值, 字符串可包含单位
- <ins>**returns**</ins> { [number](dataTypes#number) } - 转换结果

将 `source` 转换为自动选择的目标单位.

默认源单位为 `B`, 默认目标单位为 `AUTO`, 默认保留 2 位小数.

```js
cvt.bytes(1536); // 1.5
cvt.bytes('1536 B'); // 1.5
cvt.bytes('1.5 MiB'); // 1.5
```

### cvt.bytes(source, toUnit)

**`6.7.0`** **`Overload 2/5`**

- **source** { [number](dataTypes#number) | [string](dataTypes#string) } - 待转换数值, 字符串可包含单位
- **toUnit** { [string](dataTypes#string) } - 目标单位
- <ins>**returns**</ins> { [number](dataTypes#number) } - 转换结果

将 `source` 转换为 `toUnit`.

```js
cvt.bytes(1536, 'KB'); // 1.5
cvt.bytes('1.5 MB', 'KB'); // 1536
cvt.bytes('1 KiB', 'B'); // 1024
```

### cvt.bytes(source, options)

**`6.7.0`** **`Overload 3/5`**

- **source** { [number](dataTypes#number) | [string](dataTypes#string) } - 待转换数值, 字符串可包含单位
- **options** { [CvtBytesOptions](#cvtbytesoptions) | [number](dataTypes#number) } - 转换选项, 数值表示 `fractionDigits`
- <ins>**returns**</ins> { [number](dataTypes#number) } - 转换结果

使用选项转换 `source`.

```js
cvt.bytes(1536, {
    fromUnit: 'B',
    toUnit: 'KB',
    fractionDigits: 3,
}); // 1.5

cvt.bytes(1536, 0); // 2
```

### cvt.bytes(source, toUnit, options)

**`6.7.0`** **`Overload 4/5`**

- **source** { [number](dataTypes#number) | [string](dataTypes#string) } - 待转换数值, 字符串可包含单位
- **toUnit** { [string](dataTypes#string) } - 目标单位
- **options** { [CvtBytesOptions](#cvtbytesoptions) | [number](dataTypes#number) } - 转换选项, 数值表示 `fractionDigits`
- <ins>**returns**</ins> { [number](dataTypes#number) } - 转换结果

将 `source` 转换为 `toUnit`, 并应用 `options`.

`options.toUnit` 存在时优先于位置参数 `toUnit`.

```js
cvt.bytes(1536, 'KB', 3); // 1.5
cvt.bytes(1536, 'MB', { toUnit: 'KB' }); // 1.5
```

### cvt.bytes(source, fromUnit, toUnit, options?)

**`6.7.0`** **`Overload 5/5`**

- **source** { [number](dataTypes#number) | [string](dataTypes#string) } - 待转换数值, 字符串可包含单位
- **fromUnit** { [string](dataTypes#string) } - 源单位
- **toUnit** { [string](dataTypes#string) } - 目标单位
- **[ options ]** { [CvtBytesOptions](#cvtbytesoptions) | [number](dataTypes#number) } - 转换选项, 数值表示 `fractionDigits`
- <ins>**returns**</ins> { [number](dataTypes#number) } - 转换结果

将数值从 `fromUnit` 转换为 `toUnit`.

`options.fromUnit` 和 `options.toUnit` 存在时分别优先于位置参数.

```js
cvt.bytes(2, 'MB', 'KB'); // 2048
cvt.bytes.strict(2, 'MB', 'KB'); // 2000
cvt.bytes.strict(2, 'MiB', 'KiB'); // 2048
```

当字符串 `source` 已包含单位时, 该单位必须与显式 `fromUnit` 一致, 否则抛出异常.

### [m] strict

#### cvt.bytes.strict(source, ...args)

**`6.7.0`**

- **source** { [number](dataTypes#number) | [string](dataTypes#string) } - 待转换数值, 字符串可包含单位
- **...args** { ...([string](dataTypes#string) | [number](dataTypes#number) | [CvtBytesOptions](#cvtbytesoptions))[] } - 与 `cvt.bytes` 相同的位置参数
- <ins>**returns**</ins> { [number](dataTypes#number) } - 转换结果

以严格模式转换字节单位.

严格模式区分 SI 单位与 IEC 单位. SI 单位使用 1000 作为换算基数, IEC 单位使用 1024 作为换算基数.

```js
cvt.bytes.strict('1 KB', 'B'); // 1000
cvt.bytes.strict('1 KiB', 'B'); // 1024
cvt.bytes.strict(1000, 'B', 'KB'); // 1
cvt.bytes.strict(1024, 'B', 'KiB'); // 1
```

调用此方法时, `options.strict` 必须省略或为 `null` / `undefined`.

### [m] loose

#### cvt.bytes.loose(source, ...args)

**`6.7.0`**

- **source** { [number](dataTypes#number) | [string](dataTypes#string) } - 待转换数值, 字符串可包含单位
- **...args** { ...([string](dataTypes#string) | [number](dataTypes#number) | [CvtBytesOptions](#cvtbytesoptions))[] } - 与 `cvt.bytes` 相同的位置参数
- <ins>**returns**</ins> { [number](dataTypes#number) } - 转换结果

以宽松模式转换字节单位.

宽松模式不区分 `KB` 与 `KiB`, 并统一使用 1024 作为换算基数.

```js
cvt.bytes.loose('1 KB', 'B'); // 1024
cvt.bytes.loose('1 KiB', 'B'); // 1024
```

调用此方法时, `options.strict` 必须省略或为 `null` / `undefined`.

### [p] UNITS

#### cvt.bytes.UNITS

**`6.7.0`** **`CONSTANT`**

- [[ `'KMGTPEZYRQ'` ]] { [string](dataTypes#string) }

字节单位前缀字符, 按从小到大的顺序排列.

完整单位范围为 `B`, `KB` 到 `QB`, 严格模式还支持 `KiB` 到 `QiB`.

### [p] AUTO

#### cvt.bytes.AUTO

**`6.7.0`** **`CONSTANT`**

- [[ `'AUTO'` ]] { [string](dataTypes#string) }

自动目标单位标识.

### [p] IEC_DIV

#### cvt.bytes.IEC_DIV

**`6.7.0`** **`CONSTANT`**

- [[ `1024` ]] { [number](dataTypes#number) }

IEC 字节单位换算基数.

### [p] SI_DIV

#### cvt.bytes.SI_DIV

**`6.7.0`** **`CONSTANT`**

- [[ `1000` ]] { [number](dataTypes#number) }

SI 字节单位换算基数.

---

## CvtBytesOptions

- {{
    - fromUnit?: [string](dataTypes#string);
    - toUnit?: [string](dataTypes#string);
    - fractionDigits?: [number](dataTypes#number);
    - autoCarryThreshold?: [number](dataTypes#number);
    - strict?: [boolean](dataTypes#boolean);
- }}

`cvt.bytes` 的选项对象.

| 属性 | 默认值 | 说明 |
|---|---:|---|
| `fromUnit` | `'B'` | 源单位 |
| `toUnit` | `'AUTO'` | 目标单位 |
| `fractionDigits` | `2` | 小数位数, 必须为非负整数 |
| `autoCarryThreshold` | `1024` | 自动进位阈值, 必须为正数且仅可在 `toUnit` 为 `AUTO` 时使用 |
| `strict` | `false` | 是否使用严格模式 |

`source` 必须为非负数值. 字符串形式由数值和可选单位组成, 如 `'1536'`, `'1536 B'` 或 `'1.5 MiB'`.
