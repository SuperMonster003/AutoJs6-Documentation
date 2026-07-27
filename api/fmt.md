# 格式化 (Formatter)

`fmt` 模块用于将数据格式化为字符串.

当前模块提供字节数据格式化. `fmt` 与 `$fmt` 引用同一个对象.

```js
fmt.bytes(1536); // "1.50 KB"
fmt.bytes.strict(1000, 'B', 'KB'); // "1.00 KB"
fmt.bytes.strict(1024, 'B', 'KiB'); // "1.00 KiB"
```

字节单位支持 `B`, `KB` 到 `QB`, 以及严格模式下对应的 IEC 单位 `KiB` 到 `QiB`. 当目标单位为 `AUTO` 时, 模块会根据数值自动选择单位.

## 严格模式与宽松模式

常规调用默认使用宽松模式.

| 模式 | 单位解析 | 换算基数 |
|---|---|---:|
| 宽松 | 不区分大小写, 并将 `KiB` 等 IEC 写法归一化为 `KB` | 1024 |
| 严格 | 区分 SI 单位与 IEC 单位, 如 `KB` 与 `KiB` | `KB` 为 1000, `KiB` 为 1024 |

- [fmt.bytes.strict](#m-strict) 强制使用严格模式.
- [fmt.bytes.loose](#m-loose) 强制使用宽松模式.
- 常规调用可通过 `options.strict` 选择模式.

---

<p style="font: bold 2em sans-serif; color: #FF7043">fmt</p>

---

## [m+] bytes

`fmt.bytes` 是可调用的字节格式化对象, 同时包含严格模式, 宽松模式和单位常量.

### fmt.bytes(source)

**`6.7.0`** **`Overload 1/5`**

- **source** { [number](dataTypes#number) | [string](dataTypes#string) } - 待格式化数值, 字符串可包含单位
- <ins>**returns**</ins> { [string](dataTypes#string) } - 格式化结果

格式化 `source`, 并自动选择目标单位.

默认源单位为 `B`, 默认目标单位为 `AUTO`, 默认保留 2 位小数.

```js
fmt.bytes(1536); // "1.50 KB"
fmt.bytes('1536 B'); // "1.50 KB"
fmt.bytes('1.5 MiB'); // "1.50 MB"
```

### fmt.bytes(source, toUnit)

**`6.7.0`** **`Overload 2/5`**

- **source** { [number](dataTypes#number) | [string](dataTypes#string) } - 待格式化数值, 字符串可包含单位
- **toUnit** { [string](dataTypes#string) } - 目标单位
- <ins>**returns**</ins> { [string](dataTypes#string) } - 格式化结果

将 `source` 格式化为 `toUnit`.

```js
fmt.bytes(1536, 'KB'); // "1.50 KB"
fmt.bytes('1.5 MB', 'KB'); // "1536.00 KB"
fmt.bytes('1 KiB', 'B'); // "1024.00 B"
```

### fmt.bytes(source, options)

**`6.7.0`** **`Overload 3/5`**

- **source** { [number](dataTypes#number) | [string](dataTypes#string) } - 待格式化数值, 字符串可包含单位
- **options** { [FmtBytesOptions](#fmtbytesoptions) | [number](dataTypes#number) | [boolean](dataTypes#boolean) } - 格式化选项, 数值表示 `fractionDigits`, 布尔值表示 `useIecIdentifier`
- <ins>**returns**</ins> { [string](dataTypes#string) } - 格式化结果

使用选项格式化 `source`.

```js
fmt.bytes(1536, {
    toUnit: 'KB',
    fractionDigits: 3,
    useSpace: false,
}); // "1.500KB"

fmt.bytes(1536, 0); // "2 KB"
fmt.bytes(1536, true); // "1.50 KiB"
```

### fmt.bytes(source, toUnit, options)

**`6.7.0`** **`Overload 4/5`**

- **source** { [number](dataTypes#number) | [string](dataTypes#string) } - 待格式化数值, 字符串可包含单位
- **toUnit** { [string](dataTypes#string) } - 目标单位
- **options** { [FmtBytesOptions](#fmtbytesoptions) | [number](dataTypes#number) | [boolean](dataTypes#boolean) } - 格式化选项, 数值表示 `fractionDigits`, 布尔值表示 `useIecIdentifier`
- <ins>**returns**</ins> { [string](dataTypes#string) } - 格式化结果

将 `source` 格式化为 `toUnit`, 并应用 `options`.

`options.toUnit` 存在时优先于位置参数 `toUnit`.

```js
fmt.bytes(1536, 'KB', 3); // "1.500 KB"
fmt.bytes(1536, 'KB', true); // "1.50 KiB"
fmt.bytes(1536, 'MB', { toUnit: 'KB' }); // "1.50 KB"
```

### fmt.bytes(source, fromUnit, toUnit, options?)

**`6.7.0`** **`Overload 5/5`**

- **source** { [number](dataTypes#number) | [string](dataTypes#string) } - 待格式化数值, 字符串可包含单位
- **fromUnit** { [string](dataTypes#string) } - 源单位
- **toUnit** { [string](dataTypes#string) } - 目标单位
- **[ options ]** { [FmtBytesOptions](#fmtbytesoptions) | [number](dataTypes#number) | [boolean](dataTypes#boolean) } - 格式化选项, 数值表示 `fractionDigits`, 布尔值表示 `useIecIdentifier`
- <ins>**returns**</ins> { [string](dataTypes#string) } - 格式化结果

将数值从 `fromUnit` 格式化为 `toUnit`.

`options.fromUnit` 和 `options.toUnit` 存在时分别优先于位置参数.

```js
fmt.bytes(2, 'MB', 'KB'); // "2048.00 KB"
fmt.bytes.strict(2, 'MB', 'KB'); // "2000.00 KB"
fmt.bytes.strict(2, 'MiB', 'KiB'); // "2048.00 KiB"
```

当字符串 `source` 已包含单位时, 该单位必须与显式 `fromUnit` 一致, 否则抛出异常.

### [m] strict

#### fmt.bytes.strict(source, ...args)

**`6.7.0`**

- **source** { [number](dataTypes#number) | [string](dataTypes#string) } - 待格式化数值, 字符串可包含单位
- **...args** { ...([string](dataTypes#string) | [number](dataTypes#number) | [FmtBytesOptions](#fmtbytesoptions))[] } - 与 `fmt.bytes` 相同的位置参数
- <ins>**returns**</ins> { [string](dataTypes#string) } - 格式化结果

以严格模式格式化字节数据.

严格模式区分 SI 单位与 IEC 单位. SI 单位使用 1000 作为换算基数, IEC 单位使用 1024 作为换算基数.

```js
fmt.bytes.strict('1 KB', 'B'); // "1000.00 B"
fmt.bytes.strict('1 KiB', 'B'); // "1024.00 B"
fmt.bytes.strict(1000, 'B', 'KB'); // "1.00 KB"
fmt.bytes.strict(1024, 'B', 'KiB'); // "1.00 KiB"
```

调用此方法时, `options.strict` 和 `options.useIecIdentifier` 必须省略或为 `null` / `undefined`. 输出单位标识由严格模式下的目标单位决定.

### [m] loose

#### fmt.bytes.loose(source, ...args)

**`6.7.0`**

- **source** { [number](dataTypes#number) | [string](dataTypes#string) } - 待格式化数值, 字符串可包含单位
- **...args** { ...([string](dataTypes#string) | [number](dataTypes#number) | [boolean](dataTypes#boolean) | [FmtBytesOptions](#fmtbytesoptions))[] } - 与 `fmt.bytes` 相同的位置参数
- <ins>**returns**</ins> { [string](dataTypes#string) } - 格式化结果

以宽松模式格式化字节数据.

宽松模式不区分 `KB` 与 `KiB`, 并统一使用 1024 作为换算基数. `useIecIdentifier` 只控制结果是否使用 `KiB` 等 IEC 标识.

```js
fmt.bytes.loose('1 KB', 'B'); // "1024.00 B"
fmt.bytes.loose(1024, 'KB'); // "1.00 KB"
fmt.bytes.loose(1024, 'KB', true); // "1.00 KiB"
```

调用此方法时, `options.strict` 必须省略或为 `null` / `undefined`.

### [p] UNITS

#### fmt.bytes.UNITS

**`6.7.0`** **`CONSTANT`**

- [[ `'KMGTPEZYRQ'` ]] { [string](dataTypes#string) }

字节单位前缀字符, 按从小到大的顺序排列.

完整单位范围为 `B`, `KB` 到 `QB`, 严格模式还支持 `KiB` 到 `QiB`.

### [p] AUTO

#### fmt.bytes.AUTO

**`6.7.0`** **`CONSTANT`**

- [[ `'AUTO'` ]] { [string](dataTypes#string) }

自动目标单位标识.

### [p] IEC_DIV

#### fmt.bytes.IEC_DIV

**`6.7.0`** **`CONSTANT`**

- [[ `1024` ]] { [number](dataTypes#number) }

IEC 字节单位换算基数.

### [p] SI_DIV

#### fmt.bytes.SI_DIV

**`6.7.0`** **`CONSTANT`**

- [[ `1000` ]] { [number](dataTypes#number) }

SI 字节单位换算基数.

---

## FmtBytesOptions

- {{
    - fromUnit?: [string](dataTypes#string);
    - toUnit?: [string](dataTypes#string);
    - useIecIdentifier?: [boolean](dataTypes#boolean);
    - useSpace?: [boolean](dataTypes#boolean);
    - fractionDigits?: [number](dataTypes#number);
    - trimTrailingZero?: [boolean](dataTypes#boolean);
    - autoCarryThreshold?: [number](dataTypes#number);
    - strict?: [boolean](dataTypes#boolean);
- }}

`fmt.bytes` 的选项对象.

| 属性 | 默认值 | 说明 |
|---|---:|---|
| `fromUnit` | `'B'` | 源单位 |
| `toUnit` | `'AUTO'` | 目标单位 |
| `useIecIdentifier` | `false` | 宽松模式是否使用 `KiB` 等 IEC 单位标识 |
| `useSpace` | `true` | 数值与单位之间是否插入空格 |
| `fractionDigits` | `2` | 小数位数, 必须为非负整数 |
| `trimTrailingZero` | `false` | 是否移除小数末尾的 `0` |
| `autoCarryThreshold` | `1024` | 自动进位阈值, 必须为正数且仅可在 `toUnit` 为 `AUTO` 时使用 |
| `strict` | `false` | 是否使用严格模式 |

`source` 必须为非负数值. 字符串形式由数值和可选单位组成, 如 `'1536'`, `'1536 B'` 或 `'1.5 MiB'`.
