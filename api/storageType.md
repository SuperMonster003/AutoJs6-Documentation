# Storage (存储类)

存储类 Storage 是一个虚拟类, 实例通常由 [storages](storages) 全局模块产生:

```js
/* Storage 为虚拟类, 并非真实存在. */
typeof global.Storage; // "undefined"

let sto = storages.create('test');
sto._storage instanceof org.autojs.autojs.core.storage.LocalStorage; // true
```

常见相关方法或属性:

- [storages.create](storages#m-create)

---

<p style="font: bold 2em sans-serif; color: #FF7043">Storage</p>

---

## [m#] put

### put(key, value)

**`[6.3.0]`**

- **key** { [string](dataTypes#string) } - 待存入键名
- **value** { [AnyBut](dataTypes#anybut)[<](dataTypes#generic)[undefined](dataTypes#undefined), [bigint](glossaries#bigint)[>](dataTypes#generic) } - 待存入数据
- <ins>**returns**</ins> { [Storage](storageType) }

将 `value` 参数经 JSON 序列化后, 与 `key` 参数以键值对形式存入本地存储.

支持存入的数据类型:

- [number](dataTypes#number)
- [boolean](dataTypes#boolean)
- [string](dataTypes#string)
- [null](dataTypes#null)
- [Array](dataTypes#array)
- [Object](dataTypes#object)
- ... ...

理论上, 除 [undefined](dataTypes#undefined) 和 [bigint](glossaries#bigint) 外的任意类型数据均可存入本地存储,  
试图存入不支持类型的数据时, 将抛出异常.

存入时, 由 [JSON.stringify](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) 序列化数据为 [string](dataTypes#string) 类型后再存入,  
因此数据转换时遵循 JSON 序列化规则 (如 NaN 将被转换为 null 等).

```js
let sto = storages.create('fruit');
sto.put('total', 500); /* 存入数字. */
sto.put('products', [ 'apple', 'banana' ]); /* 存入数组时将被 JSON 序列化.  */
```

链式调用:

```js
let sto = storages.create('test');
sto.put('a', 1).put('b', 2).put('c', 3).put('d', 4);
```

## [m#] get

### get(key, defaultValue?)

**`Overload [1-2]/2`**

- **key** { [string](dataTypes#string) } - 数据的键名
- **[ defaultValue ]** { [any](dataTypes#any) } - 数据默认值
- <ins>**returns**</ins> { [any](dataTypes#any) }

读取本地存储中键值与 `key` 参数对应的数据.

当本地存储中不存在键值 `key` 时, 返回 [undefined](dataTypes#undefined).

本地存储中返回的数据, 来源于 put 方法的 value 参数:

```js
let sto = storages.create('test');

sto.put('apple', 10); /* 原始数据是 number 类型的 10. */
sto.get('apple'); /* 获取的数据依然是 number 类型的 10. */

sto.put('fruits', [ 'apple', 'banana' ]); /* 原始数据是字符串数组. */
sto.get('fruits'); /* 获取的数据还原为同类型的字符串数组, 即 ['apple', 'banana']. */
```

存入时, 由 [JSON.stringify](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) 序列化数据为 [string](dataTypes#string) 类型后再存入,  
读取时, 由 [JSON.parse](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) 还原为原本的数据类型.

因此部分数据受 JSON 序列化的影响, 可能导致读取数据与原始数据存在差距:

```js
sto.put('apple', NaN); /* 原始数据是 number 类型的 NaN. */
sto.get('apple'); /* 获取的数据是 null. */
```

## [m#] contains

### contains(key)

- **key** { [string](dataTypes#string) } - 键名
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回本地存储中是否存在键值 `key`.

```js
let sto = storages.create('fruit');
if (!sto.contains('apple')) {
    sto.put('apple', 10);
}
```

## [m#] remove

### remove(key)

- **key** { [string](dataTypes#string) } - 键名
- <ins>**returns**</ins> { [Storage](storageType) }

移除本地存储中键值 `key` 对应的数据.

```js
let sto = storages.create('fruit');
sto.remove('apple').remove('banana').remove('cherry');
```

## [m#] clear

### clear()

- <ins>**returns**</ins> { [void](dataTypes#void) }

清除本地存储所有数据.

```js
let sto = storages.create('fruit');
sto.put('apple', 10);
sto.get('apple'); // 10
sto.clear();
sto.get('apple'); // undefined
```