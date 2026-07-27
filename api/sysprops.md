# 系统属性 (Sysprops)

sysprops 模块用于读取 Android 系统属性.

`sysprops` 与 `$sysprops` 指向同一个模块对象.

---

<p style="font: bold 2em sans-serif; color: #FF7043">sysprops</p>

---

## [@] sysprops

### sysprops(propName, defaultValue?)

**`6.8.0`** **`Overload [1-2]/2`**

- **propName** { [string](dataTypes#string) } - 系统属性名称
- **[ defaultValue = `null` ]** { [string](dataTypes#string) | [null](dataTypes#null) } - 属性不存在或无法读取时使用的默认值
- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - 系统属性值或默认值

读取字符串形式的系统属性.

此调用与 [sysprops.get(propName, defaultValue?)](#m-get) 等价.

```js
let model = sysprops('ro.product.model', 'unknown');
console.log(model);
```

## [m] get

### get(propName, defaultValue?)

**`6.6.0`** **`[6.8.0]`** **`Overload [1-2]/2`**

- **propName** { [string](dataTypes#string) } - 系统属性名称
- **[ defaultValue = `null` ]** { [string](dataTypes#string) | [null](dataTypes#null) } - 属性不存在或无法读取时使用的默认值
- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - 系统属性值或默认值

读取字符串形式的系统属性.

从 AutoJs6 6.8.0 起, 此方法优先调用 Android 系统属性接口. 接口调用抛出异常时使用 `getprop` 命令读取; 接口方法不可用时返回 `defaultValue`.

## [m] getInt

### getInt(propName, defaultValue?)

**`6.6.0`** **`[6.8.0]`** **`Overload [1-2]/2`**

- **propName** { [string](dataTypes#string) } - 系统属性名称
- **[ defaultValue = `null` ]** { [number](dataTypes#number) | [null](dataTypes#null) } - 无法得到整数时使用的默认值
- <ins>**returns**</ins> { [number](dataTypes#number) | [null](dataTypes#null) } - 整数属性值或默认值

读取整数形式的系统属性.

从 AutoJs6 6.8.0 起, 省略 `defaultValue` 且无法得到整数时返回 `null`.

```js
let apiLevel = sysprops.getInt('ro.build.version.sdk');
console.log(apiLevel);
```

## [m] getBoolean

### getBoolean(propName, defaultValue?)

**`6.6.0`** **`[6.8.0]`** **`Overload [1-2]/2`**

- **propName** { [string](dataTypes#string) } - 系统属性名称
- **[ defaultValue = `null` ]** { [boolean](dataTypes#boolean) | [null](dataTypes#null) } - 无法得到布尔值时使用的默认值
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) | [null](dataTypes#null) } - 布尔属性值或默认值

读取布尔形式的系统属性.

系统属性值 `1`, `true`, `y`, `yes` 和 `on` 解析为 `true`.<br>
系统属性值 `0`, `false`, `n`, `no` 和 `off` 解析为 `false`.

从 AutoJs6 6.8.0 起, 省略 `defaultValue` 且无法得到布尔值时返回 `null`.

## [m] getAll

### getAll(keyFilter?, valueFilter?)

**`6.6.0`** **`[6.8.0]`** **`Overload [1-3]/4`**

- **[ keyFilter = `null` ]** { [string](dataTypes#string) | [RegExp](dataTypes#regexp) | [null](dataTypes#null) } - 属性名称过滤器
- **[ valueFilter = `null` ]** { [string](dataTypes#string) | [RegExp](dataTypes#regexp) | [null](dataTypes#null) } - 属性值过滤器
- <ins>**returns**</ins> { [Object](dataTypes#object) } - 系统属性名称和值组成的对象

读取全部系统属性, 并按需过滤结果.

此方法通过 `getprop` 命令读取系统属性列表.

字符串过滤器执行区分大小写的包含匹配.<br>
正则表达式过滤器调用其 `test` 方法.<br>
`null` 和 `undefined` 不限制对应字段.

```js
let productProperties = sysprops.getAll(/^ro\.product\./);
Object.keys(productProperties).forEach((key) => {
    console.log(key + ': ' + productProperties[key]);
});
```

### getAll(options)

**`6.6.0`** **`[6.8.0]`** **`Overload 4/4`**

- **options** {{
    - key: [string](dataTypes#string) | [RegExp](dataTypes#regexp) | [null](dataTypes#null);
    - keys: [string](dataTypes#string) | [RegExp](dataTypes#regexp) | [null](dataTypes#null);
    - value: [string](dataTypes#string) | [RegExp](dataTypes#regexp) | [null](dataTypes#null);
    - values: [string](dataTypes#string) | [RegExp](dataTypes#regexp) | [null](dataTypes#null);
- }}
- <ins>**returns**</ins> { [Object](dataTypes#object) } - 系统属性名称和值组成的对象

使用对象形式指定过滤器.

`key` 与 `keys` 互为别名, `value` 与 `values` 互为别名.

```js
let versionProperties = sysprops.getAll({
    key: /^ro\.build\.version\./,
    value: /\S+/,
});
console.log(versionProperties);
```
